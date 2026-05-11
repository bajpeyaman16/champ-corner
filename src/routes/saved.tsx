import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { useSavedEvents } from "@/lib/app-store";
import { TOURNAMENTS } from "@/lib/mock-data";
import { EventCard } from "@/components/EventCard";

export const Route = createFileRoute("/saved")({
  component: Saved,
  head: () => ({ meta: [{ title: "Saved Events — Eventra" }] }),
});

function Saved() {
  const { ids } = useSavedEvents();
  const events = TOURNAMENTS.filter((t) => ids.includes(t.id));
  return (
    <PageShell title="Saved Events">
      {events.length === 0 ? (
        <div className="glass-strong rounded-3xl p-8 text-center">
          <p className="text-muted-foreground">No bookmarks yet. Tap the bookmark icon on any event to save it.</p>
          <Link to="/explore" className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold">
            Browse events
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((e) => <EventCard key={e.id} e={e} />)}
        </div>
      )}
    </PageShell>
  );
}
