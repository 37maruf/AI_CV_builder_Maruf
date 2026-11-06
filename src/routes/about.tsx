import { createFileRoute } from "@tanstack/react-router";
import { ProsePage } from "@/components/site/PageShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ResumeAI" },
      { name: "description", content: "ResumeAI turns your experience into a polished, ATS-friendly resume using AI." },
      { property: "og:title", content: "About — ResumeAI" },
      { property: "og:description", content: "Why we built ResumeAI." },
    ],
  }),
  component: () => (
    <ProsePage title="About ResumeAI">
      <p>ResumeAI helps students and professionals turn scattered notes about their work into a focused, recruiter-ready resume.</p>
      <p>You fill in four short steps. Our AI analyzes your profile, writes clear achievement-driven content, formats it into a clean PDF and emails you a copy.</p>
      <p>Questions? Reach us at <a className="text-primary underline" href="mailto:hello@resumeai.app">hello@resumeai.app</a>.</p>
    </ProsePage>
  ),
});
