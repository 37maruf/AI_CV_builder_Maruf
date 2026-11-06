import { createFileRoute } from "@tanstack/react-router";
import { ProsePage } from "@/components/site/PageShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — ResumeAI" },
      { name: "description", content: "The terms for using ResumeAI." },
      { property: "og:title", content: "Terms & Conditions — ResumeAI" },
      { property: "og:description", content: "Terms for using ResumeAI." },
    ],
  }),
  component: () => (
    <ProsePage title="Terms & Conditions">
      <p>ResumeAI generates resume content with AI. Please review your resume for accuracy before sending it to employers — you are responsible for the information it contains.</p>
      <p>Do not submit information you don't have the right to share. We may suspend accounts that misuse the service.</p>
    </ProsePage>
  ),
});
