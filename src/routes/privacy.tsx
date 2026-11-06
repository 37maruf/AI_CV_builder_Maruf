import { createFileRoute } from "@tanstack/react-router";
import { ProsePage } from "@/components/site/PageShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ResumeAI" },
      { name: "description", content: "How ResumeAI handles your personal information." },
      { property: "og:title", content: "Privacy Policy — ResumeAI" },
      { property: "og:description", content: "How ResumeAI handles your data." },
    ],
  }),
  component: () => (
    <ProsePage title="Privacy Policy">
      <p>The details you enter are used only to generate your resume. They are sent to our AI processing workflow and the resulting PDF is stored privately in your account.</p>
      <p>Only you can see your resumes. You can request deletion of your account and data at any time by contacting us.</p>
    </ProsePage>
  ),
});
