import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, FileCheck2, FileDown, LayoutTemplate, Mail, Zap, UserPlus, PencilLine, Sparkles, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/site/PageShell";
import hero from "@/assets/hero-resume.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ResumeAI — Build Your Professional Resume with AI" },
      { name: "description", content: "Create a professional, ATS-friendly resume in minutes. Enter your details and let AI write, format and email your PDF." },
      { property: "og:title", content: "ResumeAI — Build Your Professional Resume with AI" },
      { property: "og:description", content: "AI-written, ATS-friendly resumes delivered as PDF to your inbox." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const features = [
  { icon: Brain, title: "AI-Powered Resume Writing", text: "Your raw notes become crisp, achievement-focused bullet points." },
  { icon: LayoutTemplate, title: "Professional Formatting", text: "Clean, modern layouts that look sharp on screen and in print." },
  { icon: FileCheck2, title: "ATS-Friendly Content", text: "Structured and keyword-aware so applicant tracking systems can read it." },
  { icon: FileDown, title: "PDF Resume Generation", text: "A polished, ready-to-send PDF — preview and download instantly." },
  { icon: Mail, title: "Email Delivery", text: "A copy of your CV is sent straight to your inbox." },
  { icon: Zap, title: "Fast and Easy Process", text: "Four guided steps. No design skills, no templates to fight." },
];

const steps = [
  { icon: UserPlus, title: "Create an account", text: "Sign up or log in in seconds." },
  { icon: PencilLine, title: "Fill in your details", text: "Personal, education, skills and experience." },
  { icon: Sparkles, title: "AI generates your resume", text: "It analyzes your profile and writes your CV." },
  { icon: Download, title: "Preview & receive", text: "Download your PDF and get it by email." },
];

function Home() {
  return (
    <PageShell>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-grid" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Powered by Gemini AI
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
              Build Your Professional Resume with <span className="text-gradient">AI</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Create a professional, ATS-friendly resume in minutes. Simply enter your information and let AI transform your experience into an impressive resume.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="hero" size="xl" asChild>
                <Link to="/resume-builder">Create My Resume <ArrowRight /></Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="#how-it-works">Learn More</a>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-primary opacity-20 blur-3xl" />
            <img src={hero} alt="AI-generated resume illustration" width={1200} height={1104} className="relative animate-float rounded-3xl border border-border shadow-elegant" />
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Features</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Everything you need to stand out</h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elegant">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-gradient-primary group-hover:text-primary-foreground">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-20 border-y border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">How It Works</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">From blank page to PDF in four steps</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border border-border bg-background p-6">
                <span className="font-display text-5xl font-extrabold text-gradient opacity-30">0{i + 1}</span>
                <s.icon className="mt-2 h-6 w-6 text-primary" />
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary px-6 py-14 text-center text-primary-foreground shadow-elegant sm:px-12">
          <div className="absolute inset-0 bg-grid opacity-40" />
          <h2 className="relative text-3xl font-bold sm:text-4xl">Ready to Build Your Professional Resume?</h2>
          <p className="relative mx-auto mt-3 max-w-xl opacity-90">Join and get an AI-written, recruiter-ready CV today.</p>
          <Button size="xl" variant="secondary" className="relative mt-8" asChild>
            <Link to="/resume-builder">Generate My Resume <ArrowRight /></Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
