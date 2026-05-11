import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Home, Compass, Calendar, User, Search, SlidersHorizontal, Menu } from "lucide-react";
import { useState } from "react";
import { AppDrawer } from "./AppDrawer";
import { useAuth } from "@/lib/app-store";

export function AppHeader({ title, greeting, showSearch = true }: { title?: string; greeting?: string; showSearch?: boolean }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-30 px-4 pt-4 pb-3 bg-background/60 backdrop-blur-xl border-b border-border">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setOpen(true)}
            className="size-10 rounded-full glass grid place-items-center hover:scale-105 transition"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          <Link to="/" className="font-display text-xl tracking-tight">
            <span className="text-gradient-gold font-bold">EVENTRA</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/notifications" className="relative size-10 rounded-full glass grid place-items-center hover:scale-105 transition">
              <Bell className="size-5" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-orange" />
            </Link>
            <Link to="/profile" className="size-10 rounded-full overflow-hidden bg-gradient-primary grid place-items-center text-primary-foreground font-semibold">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="size-full object-cover" />
              ) : (
                (user?.name?.[0] ?? "J").toUpperCase()
              )}
            </Link>
          </div>
        </div>

        {(greeting || title) && (
          <div className="mt-5">
            {greeting && (
              <h1 className="text-2xl font-bold leading-tight">
                Hello, <span className="text-gradient-gold">{greeting}</span>!
              </h1>
            )}
            {title && !greeting && <h1 className="text-2xl font-bold leading-tight">{title}</h1>}
            {greeting && (
              <p className="text-sm text-muted-foreground mt-1">
                Explore exciting events near you and beyond.
              </p>
            )}
          </div>
        )}

        {showSearch && (
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-4 h-12 rounded-2xl glass">
              <Search className="size-4 text-muted-foreground" />
              <input
                placeholder="Search events, sports, cities..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
            </div>
            <button className="size-12 rounded-2xl bg-gradient-primary grid place-items-center text-primary-foreground shadow-glow">
              <SlidersHorizontal className="size-5" />
            </button>
          </div>
        )}
      </div>
      <AppDrawer open={open} onOpenChange={setOpen} />
    </header>
  );
}

const tabs: { to: string; label: string; icon: typeof Home; exact?: boolean }[] = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/explore", label: "Explore", icon: Compass },
  { to: "/my-events", label: "My Events", icon: Calendar },
  { to: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-1.5rem)] max-w-md">
      <div className="glass-strong rounded-3xl px-2 py-2 flex items-center justify-between shadow-card">
        {tabs.map((t) => {
          const active = t.exact ? path === t.to : path.startsWith(t.to);
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-2xl transition ${
                active ? "bg-gradient-primary text-primary-foreground shadow-glow" : "text-muted-foreground"
              }`}
            >
              <Icon className="size-5" />
              <span className="text-[10px] font-medium">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function PageShell({ children, greeting, title, showSearch = true, hideBottomNav = false }: {
  children: React.ReactNode;
  greeting?: string;
  title?: string;
  showSearch?: boolean;
  hideBottomNav?: boolean;
}) {
  return (
    <div className="min-h-screen pb-28">
      <AppHeader greeting={greeting} title={title} showSearch={showSearch} />
      <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
}
