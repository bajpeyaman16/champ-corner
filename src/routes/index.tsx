import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { EventCard } from "@/components/EventCard";
import { CATEGORIES, FEATURED } from "@/lib/mock-data";
import { useAuth } from "@/lib/app-store";
import { useEffect } from "react";
import { ChevronRight, MapPin } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Eventra — Discover sports events near you" },
      { name: "description", content: "Browse, join and organize sports tournaments. Cricket, Football, Badminton and more." },
      { property: "og:title", content: "Eventra — Discover sports events" },
      { property: "og:description", content: "Browse, join and organize sports tournaments." },
    ],
  }),
});

function Home() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Demo: if no user, auto-create a guest so the UI feels alive (frontend-only).
    if (!user) login({ name: "Jon Snow", email: "jon@eventra.app", phone: "+91 98765 43210" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const greeting = (user?.name ?? "Jon").split(" ")[0];

  return (
    <PageShell greeting={greeting}>
      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
        <MapPin className="size-3.5 text-accent" /> Bhopal, MP · <span className="underline">Change</span>
      </div>

      <section className="mb-7">
        <SectionHeader title="Explore by Event Type" />
        <div className="grid grid-cols-4 gap-3 mt-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => c.slug === "sports" ? navigate({ to: "/sports" }) : null}
              className="glass rounded-2xl p-3 flex flex-col items-center gap-2 hover:scale-105 transition"
            >
              <span className={`size-12 rounded-2xl bg-gradient-to-br ${c.color} grid place-items-center text-2xl`}>
                {c.icon}
              </span>
              <span className="text-xs font-medium">{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Featured Events" actionTo="/explore" />
        <div className="mt-3 space-y-4">
          {FEATURED.map((e) => <EventCard key={e.id} e={e} />)}
        </div>
      </section>
    </PageShell>
  );
}

export function SectionHeader({ title, actionTo }: { title: string; actionTo?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-display text-lg font-bold">{title}</h2>
      {actionTo && (
        <Link to={actionTo as "/"} className="text-xs text-primary inline-flex items-center gap-0.5">
          See all <ChevronRight className="size-3" />
        </Link>
      )}
    </div>
  );
}
