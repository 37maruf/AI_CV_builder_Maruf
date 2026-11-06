import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Resume = Tables<"resumes">;

export async function listResumes(): Promise<Resume[]> {
  const { data, error } = await supabase.from("resumes").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getResume(id: string): Promise<Resume | null> {
  const { data, error } = await supabase.from("resumes").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data;
}

/** Downloads the stored PDF and returns a Blob URL (caller revokes it). */
export async function pdfBlobUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage.from("resumes").download(path);
  if (error || !data) throw error ?? new Error("PDF not found");
  return URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
}

export async function downloadResume(r: Resume) {
  if (!r.pdf_path) return;
  const url = await pdfBlobUrl(r.pdf_path);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${r.title.replace(/[^\w\- ]+/g, "").trim() || "resume"}.pdf`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  await supabase.from("resumes").update({ download_count: r.download_count + 1 }).eq("id", r.id);
}

export async function openResume(r: Resume) {
  if (!r.pdf_path) return;
  const win = window.open("", "_blank");
  const url = await pdfBlobUrl(r.pdf_path);
  if (win) win.location.href = url;
}

export const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
