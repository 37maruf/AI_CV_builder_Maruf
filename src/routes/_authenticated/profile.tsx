import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, displayName } from "@/hooks/use-auth";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile Settings — ResumeAI" }, { name: "description", content: "Manage your ResumeAI account." }, { property: "og:title", content: "Profile Settings — ResumeAI" }, { property: "og:description", content: "Account settings." }] }),
  component: Profile,
});

function Card({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mb-5 text-sm text-muted-foreground">{desc}</p>
      {children}
    </section>
  );
}

function Profile() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cur, setCur] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(displayName(user));
      setEmail(user.email ?? "");
    }
  }, [user]);

  const saveName = async () => {
    if (!user || !name.trim()) return;
    setBusy("name");
    const { error } = await supabase.auth.updateUser({ data: { full_name: name.trim() } });
    if (!error) await supabase.from("profiles").update({ full_name: name.trim() }).eq("id", user.id);
    setBusy(null);
    error ? toast.error(error.message) : toast.success("Name updated");
  };
  const saveEmail = async () => {
    setBusy("email");
    const { error } = await supabase.auth.updateUser({ email: email.trim() });
    setBusy(null);
    error ? toast.error(error.message) : toast.success("Check your new inbox to confirm the change");
  };
  const savePw = async () => {
    if (pw.length < 8) return toast.error("Use at least 8 characters");
    setBusy("pw");
    const { error } = await supabase.auth.updateUser({ password: pw, current_password: cur } as never);
    setBusy(null);
    if (error) return toast.error(error.message);
    setCur("");
    setPw("");
    toast.success("Password changed");
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your account and preferences.</p>
      </div>
      <Card title="Full name" desc="Shown in your dashboard.">
        <div className="flex gap-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl" />
          <Button onClick={saveName} disabled={busy === "name"}>{busy === "name" && <Loader2 className="animate-spin" />} Save</Button>
        </div>
      </Card>
      <Card title="Email address" desc="We'll send a confirmation link to the new address.">
        <div className="flex gap-2">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl" />
          <Button onClick={saveEmail} disabled={busy === "email" || email === user?.email}>{busy === "email" && <Loader2 className="animate-spin" />} Update</Button>
        </div>
      </Card>
      <Card title="Change password" desc="Enter your current password, then a new one.">
        <div className="space-y-3">
          <div className="space-y-1.5"><Label>Current password</Label><PasswordInput value={cur} onChange={(e) => setCur(e.target.value)} autoComplete="current-password" /></div>
          <div className="space-y-1.5"><Label>New password</Label><PasswordInput value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" /></div>
          <Button onClick={savePw} disabled={busy === "pw"}>{busy === "pw" && <Loader2 className="animate-spin" />} Change password</Button>
        </div>
      </Card>
      <Card title="Appearance" desc="Choose how ResumeAI looks to you.">
        <div className="grid grid-cols-2 gap-3">
          {(["light", "dark"] as const).map((t) => (
            <button key={t} onClick={() => setTheme(t)} className={cn("flex items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium capitalize transition-colors", theme === t ? "border-primary bg-accent text-accent-foreground" : "border-border hover:bg-muted")}>
              {t === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />} {t}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
