import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock, Download, FileStack, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ResumeTable } from "@/components/app/ResumeTable";
import { fmtDate, listResumes } from "@/lib/resumes";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — ResumeAI" }, { name: "description", content: "Your ResumeAI dashboard." }, { property: "og:title", content: "Dashboard — ResumeAI" }, { property: "og:description", content: "Manage your AI resumes." }] }),
  component: Dashboard,
});

function Dashboard() {
  const q = useQuery({ queryKey: ["resumes"], queryFn: listResumes });
  const resumes = q.data ?? [];
  const ready = resumes.filter((r) => r.pdf_status === "ready");
  const stats = [
    { icon: FileStack, label: "Total Resumes Created", value: String(ready.length) },
    { icon: Clock, label: "Last Resume Generated", value: ready[0] ? fmtDate(ready[0].created_at) : "—" },
    { icon: Download, label: "Downloaded Resumes", value: String(resumes.filter((r) => r.download_count > 0).length) },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold">Welcome Back!</h1>
        <p className="mt-1 text-muted-foreground">Create and manage your professional resumes with AI.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            {q.isLoading ? <Skeleton className="mt-3 h-8 w-20" /> : <p className="mt-2 font-display text-3xl font-bold">{s.value}</p>}
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-8 text-primary-foreground shadow-elegant">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <Sparkles className="mb-3 h-6 w-6" />
            <h2 className="text-2xl font-bold">Ready to create your next resume?</h2>
            <p className="mt-1 opacity-90">Four quick steps and the AI does the rest.</p>
          </div>
          <Button variant="secondary" size="xl" asChild><Link to="/resume-builder">Create New Resume <ArrowRight /></Link></Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">My Recent Resumes</h2>
          <Link to="/my-resumes" className="text-sm font-medium text-primary hover:underline">View all</Link>
        </div>
        {q.isLoading ? <Skeleton className="h-32 w-full rounded-2xl" /> : q.error ? <p className="text-sm text-destructive">Couldn't load resumes.</p> : <ResumeTable resumes={resumes.slice(0, 5)} onChange={() => q.refetch()} />}
      </div>
    </div>
  );
}
