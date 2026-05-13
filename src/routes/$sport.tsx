import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/$sport")({
  component: SportsLanding,
  head: () => ({
    meta: [
      { title: "Sports — Eventra" },
      { name: "description", content: "Choose Outdoor or Indoor sports tournaments on Eventra." },
    ],
  }),
});

function SportsLanding() {
  return (
    <PageShell title="Sports">
      <div className="space-y-5">
        <Link
          to="/sports/outdoor"
          className="block relative h-56 rounded-3xl overflow-hidden glass-strong shadow-card group"
        >
          <img
            src="https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80"
            alt="Outdoor sports stadium"
            className="absolute inset-0 size-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-xs uppercase tracking-widest text-primary font-bold">Open air</p>
            <h3 className="font-display text-2xl font-bold mt-1">Outdoor Sports</h3>
            <p className="text-sm text-muted-foreground mt-1">Cricket, Football, Hockey, Athletics & more</p>
            <span className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-full bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-glow">
              Explore Outdoor Sports <ArrowRight className="size-4" />
            </span>
          </div>
        </Link>

        <Link
          to="/sports/indoor"
          className="block relative h-56 rounded-3xl overflow-hidden glass-strong shadow-card group"
        >
          <img
            src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80"
            alt="Indoor arena"
            className="absolute inset-0 size-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="text-xs uppercase tracking-widest text-accent font-bold">Indoor arena</p>
            <h3 className="font-display text-2xl font-bold mt-1">Indoor Sports</h3>
            <p className="text-sm text-muted-foreground mt-1">Badminton, Chess, Snooker, Esports & more</p>
            <span className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-full bg-gradient-accent text-accent-foreground text-sm font-semibold shadow-glow">
              Explore Indoor Sports <ArrowRight className="size-4" />
            </span>
          </div>
        </Link>
      </div>
    </PageShell>
  );
}