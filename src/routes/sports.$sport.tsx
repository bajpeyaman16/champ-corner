import { createFileRoute, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { EventCard } from "@/components/EventCard";
import { SPORT_ICONS, OUTDOOR_SPORTS, INDOOR_SPORTS } from "@/lib/mock-data";
import { useAllEvents } from "@/lib/app-store";
 
export const Route = createFileRoute("/sports/$sport")({
  component: SportPage,
  loader: ({ params }) => {
    const sport = params.sport.toLowerCase();
    const validOutdoor = OUTDOOR_SPORTS.map((s) => s.slug.toLowerCase());
    const validIndoor = INDOOR_SPORTS.map((s) => s.name.toLowerCase());
    const allValid = [...validOutdoor, ...validIndoor];
    if (!allValid.includes(sport)) throw notFound();
    return { sport };
  },
  notFoundComponent: () => (
    <PageShell title="Not found">
      <p className="text-muted-foreground">No tournaments for this sport yet.</p>
    </PageShell>
  ),
  head: ({ params }) => ({
    meta: [
      { title: `${cap(params.sport)} Tournaments — Eventra` },
      { name: "description", content: `Live and upcoming ${cap(params.sport)} tournaments on Eventra.` },
    ],
  }),
});
 
function cap(s: string) {
  return s
    .split(" ")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}
 
function SportPage() {
  const { sport } = Route.useLoaderData();
  const display = cap(sport);
  const list = TOURNAMENTS.filter((t) => t.sport.toLowerCase() === sport);
  const icon = SPORT_ICONS[display] ?? "🏆";
 
  return (
    <PageShell title={`${icon} ${display}`}>
      {list.length === 0 ? (
        <div className="glass-strong rounded-3xl p-8 sm:p-10 text-center text-muted-foreground">
          No {display} tournaments yet — check back soon.
        </div>
      ) : (
        /* Mobile: 1-col | Tablet: 2-col */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {list.map((e) => (
            <EventCard key={e.id} e={e} />
          ))}
        </div>
      )}
    </PageShell>
  );
}