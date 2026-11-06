import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { FilePlus2, Files, LayoutDashboard, LogOut, Menu, Settings, X } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, displayName } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/resume-builder", label: "Create New Resume", icon: FilePlus2 },
  { to: "/my-resumes", label: "My Resumes", icon: Files },
  { to: "/profile", label: "Profile Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const name = displayName(user);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  const sidebar = (
    <div className="flex h-full flex-col gap-6 p-5">
      <Logo />
      <nav className="flex flex-1 flex-col gap-1">
        {nav.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            activeProps={{ className: "bg-sidebar-accent !text-sidebar-accent-foreground" }}
          >
            <n.icon className="h-4 w-4" /> {n.label}
          </Link>
        ))}
        <button onClick={logout} className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </nav>
      <div className="flex items-center gap-3 rounded-xl border border-sidebar-border p-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground">
          {name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{name}</p>
          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-sidebar-border bg-sidebar lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-sidebar-border bg-sidebar animate-fade-up">{sidebar}</aside>
        </div>
      )}
      <div className="min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/60 bg-background/75 px-4 backdrop-blur-xl sm:px-8">
          <Button variant="ghost" size="icon" className={cn("lg:hidden")} onClick={() => setOpen(true)} aria-label="Open menu">
            {open ? <X /> : <Menu />}
          </Button>
          <div className="lg:hidden"><Logo /></div>
          <div className="ml-auto"><ThemeToggle /></div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
