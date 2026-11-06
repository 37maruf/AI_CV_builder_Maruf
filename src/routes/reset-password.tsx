import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — ResumeAI" },
      { name: "description", content: "Choose a new password for your ResumeAI account." },
      { property: "og:title", content: "Set a new password — ResumeAI" },
      { property: "og:description", content: "Choose a new ResumeAI password." },
    ],
  }),
  component: Reset,
});

function Reset() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.length < 8) { toast.error("Use at least 8 characters"); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated");
    navigate({ to: "/dashboard" });
  };
  return (
    <AuthCard title="Set a new password" subtitle="Enter a new password for your account.">
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="pw">New Password</Label>
          <PasswordInput id="pw" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />
        </div>
        <Button type="submit" variant="hero" size="xl" className="w-full" disabled={busy}>
          {busy && <Loader2 className="animate-spin" />} Update password
        </Button>
      </form>
    </AuthCard>
  );
}
