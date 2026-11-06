import { Link } from "@tanstack/react-router";
import { FileText, Sparkles } from "lucide-react";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight">
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-elegant">
        <FileText className="h-[18px] w-[18px]" />
        <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 text-primary-glow" />
      </span>
      Resume<span className="text-gradient">AI</span>
    </Link>
  );
}
