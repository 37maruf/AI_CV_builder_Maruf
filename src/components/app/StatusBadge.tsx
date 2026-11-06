import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  ready: "bg-success/12 text-success",
  sent: "bg-success/12 text-success",
  failed: "bg-destructive/12 text-destructive",
  pending: "bg-warning/20 text-warning-foreground dark:text-warning",
  unconfirmed: "bg-muted text-muted-foreground",
};
const labels: Record<string, string> = {
  ready: "PDF ready", failed: "Failed", pending: "Pending", sent: "Email sent", unconfirmed: "Email unconfirmed",
};

export function StatusBadge({ status, kind }: { status: string; kind?: "email" | "pdf" }) {
  const label = kind === "email" && status === "failed" ? "Email failed" : kind === "pdf" && status === "failed" ? "PDF failed" : labels[status] ?? status;
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", styles[status] ?? styles.unconfirmed)}>
      {label}
    </span>
  );
}
