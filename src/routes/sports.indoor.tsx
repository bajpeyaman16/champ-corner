import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { INDOOR_SPORTS } from "@/lib/mock-data";

export const Route = createFileRoute("/sports/indoor")({
  component: Indoor,
  head: () => ({ meta: [{ title: "Indoor Sports — Eventra" }] }),
});

function Indoor() {
  return (
    <PageShell title="Indoor Sports">
      <div className="grid grid-cols-2 gap-3">
        {INDOOR_SPORTS.map((s) => (
          <Link
            key={s.name}
            to="/sports/$sport"
            params={{ sport: s.name.toLowerCase() }}
            className="relative h-44 rounded-2xl overflow-hidden glass-strong group"
          >
            <img src={s.image} alt={s.name} className="absolute inset-0 size-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
            <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-accent/80 text-accent-foreground text-[10px] font-bold uppercase">
              Indoor
            </span>
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="font-display font-bold leading-tight">{s.name}</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {s.tournaments} tournaments · {s.events} events
              </p>
            </div>
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
