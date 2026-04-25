import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, X, Trophy, ShieldAlert, LogOut } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { to: "/", label: "Home" },
  { to: "/predictions", label: "Predictions" },
  { to: "/odds", label: "Odds" },
  { to: "/fixtures", label: "Fixtures" },
  { to: "/vip", label: "VIP Tips" },
  { to: "/blog", label: "News" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await signOut();
    void navigate({ to: "/" });
  };
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Trophy className="h-5 w-5 text-primary-foreground" />
          </span>
          <span>Simple<span className="text-primary">Bet</span>Hub</span>
        </Link>
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-2 text-sm font-medium text-muted-foreground transition-smooth hover:text-foreground rounded-md hover:bg-surface"
              activeProps={{ className: "px-3 py-2 text-sm font-medium text-primary rounded-md bg-surface" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-2">
          {isAdmin && (
            <Link to="/admin" className="text-muted-foreground hover:text-foreground p-2 rounded-md hover:bg-surface" aria-label="Admin">
              <ShieldAlert className="h-4 w-4" />
            </Link>
          )}
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-1" /> Sign Out
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
          <Button asChild size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
            <Link to="/vip">Join VIP</Link>
          </Button>
        </div>
        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-md hover:bg-surface" aria-label="Menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border/60 bg-background animate-float-up">
          <nav className="flex flex-col p-4 gap-1">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className="px-3 py-3 text-sm font-medium rounded-md hover:bg-surface"
                activeProps={{ className: "px-3 py-3 text-sm font-medium rounded-md bg-surface text-primary" }}
                activeOptions={{ exact: l.to === "/" }}>
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-3">
              {user ? (
                <Button variant="outline" className="flex-1" onClick={handleSignOut}>Sign Out</Button>
              ) : (
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/auth" onClick={() => setOpen(false)}>Sign In</Link>
                </Button>
              )}
              <Button asChild className="flex-1 bg-gradient-primary text-primary-foreground">
                <Link to="/vip" onClick={() => setOpen(false)}>Join VIP</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
