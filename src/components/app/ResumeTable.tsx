import { Link } from "@tanstack/react-router";
import { Download, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { downloadResume, fmtDate, type Resume } from "@/lib/resumes";

export function ResumeTable({ resumes, onChange }: { resumes: Resume[]; onChange?: () => void }) {
  if (!resumes.length)
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border p-10 text-center">
        <FileText className="h-10 w-10 text-muted-foreground" />
        <p className="font-medium">No resumes yet</p>
        <p className="text-sm text-muted-foreground">Your generated resumes will appear here.</p>
        <Button variant="hero" asChild><Link to="/resume-builder">Create your first resume</Link></Button>
      </div>
    );

  const dl = async (r: Resume) => {
    try {
      await downloadResume(r);
      onChange?.();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  return (
    <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
      {resumes.map((r) => (
        <div key={r.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground"><FileText className="h-5 w-5" /></span>
            <div className="min-w-0">
              <p className="truncate font-medium">{r.title}</p>
              <p className="text-xs text-muted-foreground">{fmtDate(r.created_at)} · {r.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={r.pdf_status} kind="pdf" />
            <StatusBadge status={r.email_status} kind="email" />
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" disabled={!r.pdf_path} asChild={!!r.pdf_path}>
              {r.pdf_path ? <Link to="/resume-result" search={{ id: r.id }}><Eye /> View</Link> : <span><Eye /> View</span>}
            </Button>
            <Button size="sm" variant="soft" disabled={!r.pdf_path} onClick={() => dl(r)}><Download /> PDF</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
