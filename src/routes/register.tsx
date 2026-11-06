import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Check, Loader2, MailCheck, X } from "lucide-react";
import { AuthCard, GoogleButton } from "@/components/auth/AuthCard";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — ResumeAI" },
      { name: "description", content: "Create a free ResumeAI account and generate your first AI resume." },
      { property: "og:title", content: "Create account — ResumeAI" },
      { property: "og:description", content: "Start building AI-written resumes." },
    ],
  }),
  component: Register,
});

const rules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
];

function Register() {
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) return toast.error("Enter your full name");
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return toast.error("Enter a valid email");
    if (!rules.every((r) => r.test(f.password))) return toast.error("Password doesn't meet the requirements");
    if (f.password !== f.confirm) return toast.error("Passwords don't match");
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: f.email.trim(),
      password: f.password,
      options: { emailRedirectTo: window.location.origin + "/dashboard", data: { full_name: f.name.trim() } },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setSent(true);
  };

  if (sent)
    return (
      <AuthCard title="Check your email" subtitle={`We sent a confirmation link to ${f.email}.`} footer={<Link to="/login" className="font-semibold text-primary hover:underline">Back to login</Link>}>
        <div className="flex flex-col items-center gap-3 py-4 text-center text-sm text-muted-foreground">
          <MailCheck className="h-12 w-12 text-primary" />
          Click the link in the email to activate your account, then log in.
        </div>
      </AuthCard>
    );

  return (
    <AuthCard title="Create your account" subtitle="Start building AI-powered resumes in minutes." footer={<>Already have an account? <Link to="/login" className="font-semibold text-primary hover:underline">Log in</Link></>}>
      <GoogleButton />
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" value={f.name} onChange={set("name")} placeholder="Jane Doe" className="h-11 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" autoComplete="email" value={f.email} onChange={set("email")} placeholder="you@example.com" className="h-11 rounded-xl" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <PasswordInput id="password" autoComplete="new-password" value={f.password} onChange={set("password")} placeholder="••••••••" />
          <ul className="grid gap-1 pt-1 text-xs">
            {rules.map((r) => {
              const ok = r.test(f.password);
              return (
                <li key={r.label} className={cn("flex items-center gap-1.5", ok ? "text-success" : "text-muted-foreground")}>
                  {ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />} {r.label}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirm Password</Label>
          <PasswordInput id="confirm" autoComplete="new-password" value={f.confirm} onChange={set("confirm")} placeholder="••••••••" />
          {f.confirm && f.confirm !== f.password && <p className="text-xs text-destructive">Passwords don't match</p>}
        </div>
        <Button type="submit" variant="hero" size="xl" className="w-full" disabled={busy}>
          {busy && <Loader2 className="animate-spin" />} Create Account
        </Button>
      </form>
    </AuthCard>
  );
}
