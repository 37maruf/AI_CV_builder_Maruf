import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { resumeSchema } from "./resume-fields";

// Override with the N8N_WEBHOOK_URL secret; this default is the user's workflow webhook.
const DEFAULT_WEBHOOK =
  "https://maruf37.app.n8n.cloud/webhook/resume-builder";

type EmailStatus = "sent" | "failed" | "unconfirmed";

function readEmailStatus(v: unknown): EmailStatus {
  if (v === true || v === "sent" || v === "true" || v === "success") return "sent";
  if (v === false || v === "failed" || v === "false" || v === "error") return "failed";
  return "unconfirmed";
}

export const generateResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => resumeSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const webhook = process.env["N8N_WEBHOOK_URL"] || DEFAULT_WEBHOOK;
    const title = `${data.Name} – Resume`;

    let res: Response;
    try {
      res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/pdf, application/json" },
        body: JSON.stringify(data),
      });
    } catch (e) {
      throw new Error(`Could not reach the resume workflow: ${(e as Error).message}`);
    }

    if (!res.ok) {
      const body = (await res.text()).slice(0, 400);
      const hint =
        res.status === 404 && webhook.includes("/webhook-test/")
          ? " (test webhooks only work while 'Listen for test event' is active in n8n — activate the workflow and use the production URL)"
          : "";
      throw new Error(`Workflow returned ${res.status}${hint}: ${body}`);
    }

    const ct = res.headers.get("content-type") ?? "";
    let pdf: ArrayBuffer | null = null;
    let emailStatus = readEmailStatus(res.headers.get("x-email-status"));

    if (ct.includes("application/pdf") || ct.includes("octet-stream")) {
      pdf = await res.arrayBuffer();
    } else if (ct.includes("json")) {
      const json = (await res.json()) as Record<string, unknown>;
      const j = Array.isArray(json) ? (json[0] as Record<string, unknown>) : json;
      if (emailStatus === "unconfirmed") emailStatus = readEmailStatus(j?.["emailSent"] ?? j?.["emailStatus"]);
      const url = (j?.["pdfUrl"] ?? j?.["pdf_url"] ?? j?.["url"]) as string | undefined;
      if (url && /^https?:\/\//.test(url)) {
        const p = await fetch(url);
        if (p.ok) pdf = await p.arrayBuffer();
      }
    } else {
      const buf = await res.arrayBuffer();
      const head = new TextDecoder().decode(buf.slice(0, 5));
      if (head === "%PDF-") pdf = buf;
    }

    if (!pdf || pdf.byteLength < 100) {
      await supabase.from("resumes").insert({
        user_id: userId, title, email: data.Email, pdf_status: "failed", email_status: emailStatus,
        error_message: "The workflow finished but did not return a PDF file.",
      });
      throw new Error(
        "The workflow finished but did not send back a PDF. Make sure the 'Respond to Webhook' node returns the PDF binary.",
      );
    }

    const path = `${userId}/${crypto.randomUUID()}.pdf`;
    const { error: upErr } = await supabase.storage
      .from("resumes")
      .upload(path, new Uint8Array(pdf), { contentType: "application/pdf" });
    if (upErr) throw new Error(`Saving the PDF failed: ${upErr.message}`);

    const { data: row, error } = await supabase
      .from("resumes")
      .insert({ user_id: userId, title, email: data.Email, pdf_path: path, pdf_status: "ready", email_status: emailStatus })
      .select("id")
      .single();
    if (error) throw new Error(`Saving the resume failed: ${error.message}`);

    return { id: row.id };
  });
