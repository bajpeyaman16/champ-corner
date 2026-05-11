import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { OUTDOOR_SPORTS } from "@/lib/mock-data";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/sports/outdoor")({
  component: Outdoor,
  head: () => ({ meta: [{ title: "Outdoor Sports — Eventra" }] }),
});

function Outdoor() {
  return (
    <PageShell title="Outdoor Sports">
      <div className="space-y-3">
        {OUTDOOR_SPORTS.map((s) => (
          <Link
            key={s.name}
            to="/sports/$sport"
            params={{ sport: s.name.toLowerCase() }}
            className="flex items-center gap-4 glass-strong rounded-2xl p-3 hover:shadow-glow transition"
          >
            <div className="size-20 rounded-xl overflow-hidden flex-shrink-0">
              <img src={s.image} alt={s.name} className="size-full object-cover" loading="lazy" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-bold">{s.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-primary font-semibold">{s.tournaments}</span> tournaments ·{" "}
                <span className="text-orange font-semibold">{s.events}</span> events
              </p>
            </div>
            <ChevronRight className="size-5 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
