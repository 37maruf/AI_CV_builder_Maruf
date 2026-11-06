import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ResumeTable } from "@/components/app/ResumeTable";
import { listResumes } from "@/lib/resumes";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/my-resumes")({
  head: () => ({ meta: [{ title: "My Resumes — ResumeAI" }, { name: "description", content: "All your generated resumes." }, { property: "og:title", content: "My Resumes — ResumeAI" }, { property: "og:description", content: "Your resume history." }] }),
  component: MyResumes,
});

const filters = [
  { key: "all", label: "All" },
  { key: "ready", label: "PDF ready" },
  { key: "sent", label: "Email sent" },
  { key: "failed", label: "Failed" },
] as const;

function MyResumes() {
  const q = useQuery({ queryKey: ["resumes"], queryFn: listResumes });
  const [term, setTerm] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]["key"]>("all");

  const list = useMemo(() => {
    const t = term.toLowerCase();
    return (q.data ?? []).filter((r) => {
      if (t && !r.title.toLowerCase().includes(t) && !r.email.toLowerCase().includes(t)) return false;
      if (filter === "ready") return r.pdf_status === "ready";
      if (filter === "sent") return r.email_status === "sent";
      if (filter === "failed") return r.pdf_status === "failed" || r.email_status === "failed";
      return true;
    });
  }, [q.data, term, filter]);

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold">My Resumes</h1>
        <p className="mt-1 text-muted-foreground">Preview, download and manage every resume you've generated.</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Search by title or email" className="h-11 rounded-xl pl-9" />
        </div>
        <div className="flex gap-1 rounded-xl border border-border bg-card p-1">
          {filters.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={cn("rounded-lg px-3 py-1.5 text-sm font-medium transition-colors", filter === f.key ? "bg-gradient-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
              {f.label}
            </button>
          ))}
        </div>
      </div>
      {q.isLoading ? <Skeleton className="h-48 w-full rounded-2xl" /> : <ResumeTable resumes={list} onChange={() => q.refetch()} />}
    </div>
  );
}
