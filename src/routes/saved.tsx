import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { useSavedEvents, useAllEvents } from "@/lib/app-store";
import { EventCard } from "@/components/EventCard";

export const Route = createFileRoute("/saved")({
  component: Saved,
  head: () => ({ meta: [{ title: "Saved Events — Eventra" }] }),
});

function Saved() {
  const { ids } = useSavedEvents();
  const { list: allEvents } = useAllEvents();
  const events = allEvents.filter((t) => ids.includes(t.id));
 
  return (
    <PageShell title="Saved Events">
      {events.length === 0 ? (
        <div className="glass-strong rounded-3xl p-8 sm:p-10 text-center max-w-sm mx-auto">
          <p className="text-2xl mb-3">🔖</p>
          <p className="text-muted-foreground text-sm">
            No bookmarks yet. Tap the bookmark icon on any event to save it.
          </p>
          <Link
            to="/explore"
            className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm"
          >
            Browse events
          </Link>
        </div>
      ) : (
        /* Mobile: 1-col | Tablet: 2-col */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {events.map((e) => <EventCard key={e.id} e={e} />)}
        </div>
      )}
    </PageShell>
  );
}