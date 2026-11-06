import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutDashboard, LogOut, Menu, User as UserIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth, displayName } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const links = [
  { label: "Home", href: "/" },
  { label: "Create Resume", href: "/resume-builder" },
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About", href: "/about" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const name = displayName(user);

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground" aria-label="Account menu">
                  {name.charAt(0).toUpperCase()}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="truncate">{name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate({ to: "/dashboard" })}><LayoutDashboard /> Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}><UserIcon /> Profile</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}><LogOut /> Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-1.5 sm:flex">
              <Button variant="ghost" asChild><Link to="/login">Login</Link></Button>
              <Button variant="hero" asChild><Link to="/register">Register</Link></Button>
            </div>
          )}
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background px-4 pb-4 pt-2 lg:hidden animate-fade-up">
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent">
              {l.label}
            </a>
          ))}
          {!user && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="outline" asChild><Link to="/login">Login</Link></Button>
              <Button variant="hero" asChild><Link to="/register">Register</Link></Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
