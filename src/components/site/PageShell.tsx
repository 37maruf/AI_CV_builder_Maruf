import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export function ProsePage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl font-bold">{title}</h1>
        <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">{children}</div>
      </section>
    </PageShell>
  );
}
