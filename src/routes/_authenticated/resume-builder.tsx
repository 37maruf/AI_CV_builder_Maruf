import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { generateResume } from "@/lib/n8n.functions";
import { STEPS, emptyResume, validateStep, type FieldName, type ResumeData } from "@/lib/resume-fields";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/resume-builder")({
  head: () => ({ meta: [{ title: "AI Resume Builder — ResumeAI" }, { name: "description", content: "Enter your details and let AI write your resume." }, { property: "og:title", content: "AI Resume Builder — ResumeAI" }, { property: "og:description", content: "Generate your resume with AI." }] }),
  component: Builder,
});

const MESSAGES = [
  "Submitting your information...",
  "AI is analyzing your profile...",
  "Writing your professional resume...",
  "Formatting your resume...",
  "Generating your PDF...",
  "Sending your resume to your email...",
];

function Builder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const generate = useServerFn(generateResume);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ResumeData>(emptyResume);
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(0);
  const [failure, setFailure] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email && !data.Email) setData((d) => ({ ...d, Email: user.email ?? "" }));
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!busy) return;
    setMsg(0);
    const t = setInterval(() => setMsg((m) => Math.min(m + 1, MESSAGES.length - 1)), 9000);
    return () => clearInterval(t);
  }, [busy]);

  const current = STEPS[step]!;
  const last = step === STEPS.length - 1;

  const next = () => {
    const e = validateStep(step, data);
    setErrors(e);
    if (Object.keys(e).length) return;
    setStep(step + 1);
  };

  const submit = async () => {
    if (busy) return;
    for (let i = 0; i < STEPS.length; i++) {
      const e = validateStep(i, data);
      if (Object.keys(e).length) {
        setErrors(e);
        setStep(i);
        return;
      }
    }
    setFailure(null);
    setBusy(true);
    try {
      const r = await generate({ data });
      navigate({ to: "/resume-result", search: { id: r.id } });
    } catch (e) {
      setFailure((e as Error).message || "Resume generation failed.");
    } finally {
      setBusy(false);
    }
  };

  if (busy)
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center animate-fade-up">
        <div className="relative grid h-28 w-28 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <span className="absolute inset-2 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <Sparkles className="h-9 w-9 text-primary" />
        </div>
        <h2 className="mt-8 text-2xl font-bold">Generating your resume</h2>
        <p className="mt-2 text-muted-foreground" aria-live="polite">{MESSAGES[msg]}</p>
        <p className="mt-6 max-w-sm text-xs text-muted-foreground">This usually takes up to a minute. Please keep this page open — these messages describe the typical stages; we'll only show success once your workflow confirms it.</p>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold">AI Resume Builder</h1>
        <p className="mt-1 text-muted-foreground">Provide your personal, educational, and professional details. Our AI will transform your information into a professional resume.</p>
      </div>

      <ol className="grid grid-cols-4 gap-2">
        {STEPS.map((s, i) => (
          <li key={s.title}>
            <div className={cn("h-1.5 rounded-full transition-colors", i <= step ? "bg-gradient-primary" : "bg-muted")} />
            <p className={cn("mt-2 hidden text-xs font-medium sm:block", i === step ? "text-foreground" : "text-muted-foreground")}>
              {i < step && <Check className="mr-1 inline h-3 w-3 text-success" />}{s.title}
            </p>
          </li>
        ))}
      </ol>

      {failure && (
        <div className="flex gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
          <div className="flex-1">
            <p className="font-semibold text-destructive">We couldn't generate your resume</p>
            <p className="mt-1 break-words text-muted-foreground">{failure}</p>
          </div>
          <Button size="sm" variant="outline" onClick={submit}><RotateCcw /> Retry</Button>
        </div>
      )}

      <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Step {step + 1} of {STEPS.length}</p>
        <h2 className="mt-1 text-xl font-semibold">{current.title}</h2>
        <p className="text-sm text-muted-foreground">{current.description}</p>
        <div className={cn("mt-6 grid gap-5", step === 0 && "sm:grid-cols-2")}>
          {current.fields.map((f) => {
            const Comp = f.type === "textarea" ? Textarea : Input;
            return (
              <div key={f.name} className={cn("space-y-1.5", f.type === "textarea" && "sm:col-span-2")}>
                <label htmlFor={f.name} className="flex items-center gap-2 text-sm font-medium">
                  <f.icon className="h-4 w-4 text-primary" /> {f.name}{f.required && <span className="text-destructive">*</span>}
                </label>
                <Comp
                  id={f.name}
                  type={f.type === "textarea" ? undefined : f.type}
                  placeholder={f.placeholder}
                  value={data[f.name]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setData({ ...data, [f.name]: e.target.value })}
                  className={cn("rounded-xl", f.type === "textarea" ? "min-h-28" : "h-11", errors[f.name] && "border-destructive")}
                />
                {errors[f.name] && <p className="text-xs text-destructive">{errors[f.name]}</p>}
              </div>
            );
          })}
        </div>
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <Button variant="outline" size="lg" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft /> Previous</Button>
          {last ? (
            <Button variant="hero" size="xl" onClick={submit} disabled={busy}>
              {busy ? <Loader2 className="animate-spin" /> : <Sparkles />} Generate My Resume
            </Button>
          ) : (
            <Button size="lg" onClick={next}>Next <ArrowRight /></Button>
          )}
        </div>
      </div>
    </div>
  );
}
