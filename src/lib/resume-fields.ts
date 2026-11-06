import { z } from "zod";
import type { LucideIcon } from "lucide-react";
import {
  User, Mail, Phone, MapPin, Github, Linkedin, Globe, Target, GraduationCap, Wrench,
  FolderKanban, FlaskConical, Briefcase, Users, Award, UserCheck, Sparkles,
} from "lucide-react";

/** The 17 field names exactly as the n8n workflow expects them. */
export const FIELD_NAMES = [
  "Name", "Email", "Phone", "Address", "GitHub Profile", "LinkedIn Profile", "Personal Portfolio",
  "Career Goal", "Education", "Skills", "Projects", "Research", "Experience", "Leadership",
  "Awards and Certifications", "References", "CV Description or Suggestions",
] as const;
export type FieldName = (typeof FIELD_NAMES)[number];
export type ResumeData = Record<FieldName, string>;

export type FieldDef = {
  name: FieldName;
  type: "text" | "email" | "url" | "textarea";
  placeholder: string;
  required?: boolean;
  icon: LucideIcon;
};

export const STEPS: { title: string; description: string; fields: FieldDef[] }[] = [
  {
    title: "Personal Information",
    description: "How recruiters will reach you.",
    fields: [
      { name: "Name", type: "text", placeholder: "Enter your full name", required: true, icon: User },
      { name: "Email", type: "email", placeholder: "Enter your email address", required: true, icon: Mail },
      { name: "Phone", type: "text", placeholder: "Enter your phone number", icon: Phone },
      { name: "Address", type: "text", placeholder: "Enter your address", icon: MapPin },
      { name: "GitHub Profile", type: "url", placeholder: "https://github.com/username", icon: Github },
      { name: "LinkedIn Profile", type: "url", placeholder: "https://linkedin.com/in/username", icon: Linkedin },
      { name: "Personal Portfolio", type: "url", placeholder: "https://yourportfolio.com", icon: Globe },
    ],
  },
  {
    title: "Career and Education",
    description: "Where you're headed and what you've studied.",
    fields: [
      { name: "Career Goal", type: "textarea", placeholder: "Describe your career objectives and professional goals.", required: true, icon: Target },
      { name: "Education", type: "textarea", placeholder: "Enter your educational qualifications, institutions, degrees, and graduation years.", required: true, icon: GraduationCap },
    ],
  },
  {
    title: "Skills and Experience",
    description: "The substance of your resume.",
    fields: [
      { name: "Skills", type: "textarea", placeholder: "List your technical skills, soft skills, programming languages, and tools.", required: true, icon: Wrench },
      { name: "Projects", type: "textarea", placeholder: "Describe your important projects, technologies used, and achievements.", icon: FolderKanban },
      { name: "Research", type: "textarea", placeholder: "Describe your research experience, publications, or academic work.", icon: FlaskConical },
      { name: "Experience", type: "textarea", placeholder: "Enter your professional experience, internships, responsibilities, and achievements.", icon: Briefcase },
      { name: "Leadership", type: "textarea", placeholder: "Describe your leadership experience, teamwork, and extracurricular activities.", icon: Users },
    ],
  },
  {
    title: "Additional Information",
    description: "Finishing touches and instructions for the AI.",
    fields: [
      { name: "Awards and Certifications", type: "textarea", placeholder: "List your awards, certificates, and professional achievements.", icon: Award },
      { name: "References", type: "textarea", placeholder: "Enter your professional references, if applicable.", icon: UserCheck },
      { name: "CV Description or Suggestions", type: "textarea", placeholder: "Tell AI about your preferred resume style, formatting, target job role, or additional instructions.", icon: Sparkles },
    ],
  },
];

export const emptyResume = (): ResumeData =>
  Object.fromEntries(FIELD_NAMES.map((n) => [n, ""])) as ResumeData;

const optUrl = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https?:\/\/\S+\.\S+/.test(v), "Enter a valid URL starting with http(s)://");
const req = (label: string, max = 5000) => z.string().trim().min(1, `${label} is required`).max(max);
const opt = (max = 5000) => z.string().trim().max(max);

export const resumeSchema = z.object({
  Name: req("Name", 120),
  Email: z.string().trim().min(1, "Email is required").email("Enter a valid email").max(255),
  Phone: opt(40),
  Address: opt(300),
  "GitHub Profile": optUrl,
  "LinkedIn Profile": optUrl,
  "Personal Portfolio": optUrl,
  "Career Goal": req("Career Goal"),
  Education: req("Education"),
  Skills: req("Skills"),
  Projects: opt(),
  Research: opt(),
  Experience: opt(),
  Leadership: opt(),
  "Awards and Certifications": opt(),
  References: opt(),
  "CV Description or Suggestions": opt(),
});

/** Validate only the fields of one step; returns field → message. */
export function validateStep(step: number, data: ResumeData): Partial<Record<FieldName, string>> {
  const errors: Partial<Record<FieldName, string>> = {};
  for (const f of STEPS[step].fields) {
    const r = resumeSchema.shape[f.name].safeParse(data[f.name]);
    if (!r.success) errors[f.name] = r.error.issues[0]?.message;
  }
  return errors;
}
