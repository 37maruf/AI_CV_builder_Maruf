import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { AlertTriangle, CheckCircle2, Download, LayoutDashboard, Maximize2, Mail, Plus, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { downloadResume, getResume, pdfBlobUrl } from "@/lib/resumes";

export const Route = createFileRoute("/_authenticated/resume-result")({
  validateSearch: z.object({ id: z.string().uuid().optional() }),
  head: () => ({ meta: [{ title: "Your Resume — ResumeAI" }, { name: "description", content: "Preview and download your AI-generated resume." }, { property: "og:title", content: "Your Resume — ResumeAI" }, { property: "og:description", content: "Your generated resume." }] }),
  component: Result,
});

function Result() {
  const { id } = Route.useSearch();
  const q = useQuery({ queryKey: ["resume", id], queryFn: () => getResume(id!), enabled: !!id });
  const r = q.data;
  const [url, setUrl] = useState<string | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!r?.pdf_path) return;
    let u: string | null = null;
    pdfBlobUrl(r.pdf_path).then((x) => { u = x; setUrl(x); }).catch(() => setUrl(null));
    return () => { if (u) URL.revokeObjectURL(u); };
  }, [r?.pdf_path]);

  if (!id || (!q.isLoading && !r))
    return <div className="py-20 text-center"><p className="text-muted-foreground">Resume not found.</p><Button asChild className="mt-4"><Link to="/my-resumes">My Resumes</Link></Button></div>;
  if (q.isLoading || !r) return <Skeleton className="h-[70vh] w-full rounded-3xl" />;

  const ok = r.pdf_status === "ready";
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-soft sm:p-8">
        {ok ? <CheckCircle2 className="mx-auto h-14 w-14 text-success" /> : <AlertTriangle className="mx-auto h-14 w-14 text-destructive" />}
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">{ok ? "Your Resume Has Been Successfully Generated!" : "Resume generation failed"}</h1>
        {ok && (
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            Congratulations! Your professional AI-generated resume is ready.
            {r.email_status === "sent" && " A copy of your CV has also been sent to your email address."}
          </p>
        )}
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
          <Mail className="h-4 w-4 text-primary" />
          {r.email_status === "sent" && <>Your CV has been sent to your email! <strong>{r.email}</strong></>}
          {r.email_status === "failed" && <>Email delivery to <strong>{r.email}</strong> failed.</>}
          {r.email_status === "unconfirmed" && <>Email delivery to <strong>{r.email}</strong> wasn't confirmed by the workflow — check your inbox.</>}
        </div>
      </div>

      {ok && (
        <>
          <div className="flex flex-wrap gap-2">
            <Button variant="hero" onClick={() => downloadResume(r)}><Download /> Download PDF</Button>
            <Button variant="outline" disabled={!url} onClick={() => url && window.open(url, "_blank")}><Maximize2 /> View Fullscreen</Button>
            <Button variant="outline" disabled={!url} onClick={() => frame.current?.contentWindow?.print()}><Printer /> Print</Button>
            <Button variant="ghost" asChild><Link to="/dashboard"><LayoutDashboard /> Back to Dashboard</Link></Button>
            <Button variant="ghost" asChild><Link to="/resume-builder"><Plus /> Create Another Resume</Link></Button>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-muted shadow-soft">
            {url ? <iframe ref={frame} src={url} title="Resume PDF preview" className="h-[80vh] w-full" /> : <Skeleton className="h-[80vh] w-full" />}
          </div>
        </>
      )}
    </div>
  );
}
