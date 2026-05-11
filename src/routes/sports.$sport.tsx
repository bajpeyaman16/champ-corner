import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { EventCard } from "@/components/EventCard";
import { TOURNAMENTS, SPORT_ICONS } from "@/lib/mock-data";

export const Route = createFileRoute("/sports/$sport")({
  component: SportPage,
  loader: ({ params }) => {
    const sport = params.sport.toLowerCase();
    const all = Object.keys(SPORT_ICONS).map((s) => s.toLowerCase());
    if (!all.includes(sport)) throw notFound();
    return { sport };
  },
  notFoundComponent: () => (
    <PageShell title="Not found"><p className="text-muted-foreground">No tournaments for this sport yet.</p></PageShell>
  ),
  head: ({ params }) => ({
    meta: [
      { title: `${cap(params.sport)} Tournaments — Eventra` },
      { name: "description", content: `Live and upcoming ${cap(params.sport)} tournaments on Eventra.` },
    ],
  }),
});

function cap(s: string) {
  return s.split(" ").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}

function SportPage() {
  const { sport } = Route.useLoaderData();
  const display = cap(sport);
  const list = TOURNAMENTS.filter((t) => t.sport.toLowerCase() === sport);

  return (
    <PageShell title={`${SPORT_ICONS[display] ?? "🏆"} ${display}`}>
      {list.length === 0 ? (
        <div className="glass-strong rounded-3xl p-8 text-center text-muted-foreground">
          No {display} tournaments yet — check back soon.
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((e) => <EventCard key={e.id} e={e} />)}
        </div>
      )}
    </PageShell>
  );
}
