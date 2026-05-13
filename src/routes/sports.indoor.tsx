import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { EventCard } from "@/components/EventCard";
import { INDOOR_SPORTS, TOURNAMENTS } from "@/lib/mock-data";
import { Search, X } from "lucide-react";
import { useState } from "react";
 
export const Route = createFileRoute("/sports/indoor")({
  component: Indoor,
  head: () => ({ meta: [{ title: "Indoor Sports — Eventra" }] }),
});
 
function Indoor() {
  const [query, setQuery] = useState("");
  const [sport, setSport] = useState<string>("all");
  const indoorNames = INDOOR_SPORTS.map((s) => s.name);
  const term = query.trim().toLowerCase();
  const events = TOURNAMENTS.filter((event) => {
    const isIndoor = indoorNames.includes(event.sport);
    const matchesSport = sport === "all" || event.sport === sport;
    const hay = `${event.name} ${event.sport} ${event.city} ${event.venue} ${event.organizer}`.toLowerCase();
    return isIndoor && matchesSport && (!term || hay.includes(term));
  });
 
  return (
    <PageShell title="Indoor Sports">
        <div className="space-y-5">
          <div className="relative h-44 sm:h-56 rounded-3xl overflow-hidden glass-strong shadow-card">
            <img
              src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=1200&q=80"
              alt="Indoor sports arena"
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
              <p className="text-xs uppercase tracking-widest text-accent font-bold">Indoor arena tournaments</p>
              <h2 className="font-display text-2xl sm:text-3xl font-bold mt-1">All Indoor Events</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">Badminton, Chess, Snooker, Table Tennis, Kabaddi aur Boxing events.</p>
            </div>
          </div>

          <div className="glass rounded-xl px-3 py-2.5 flex items-center gap-2">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search indoor events..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear">
                <X className="size-4 text-muted-foreground" />
              </button>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSport("all")}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${sport === "all" ? "bg-gradient-primary text-primary-foreground shadow-glow" : "glass text-muted-foreground"}`}
            >
              All Indoor
            </button>
            {INDOOR_SPORTS.map((s) => (
              <button
                key={s.name}
                onClick={() => setSport(s.name)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${sport === s.name ? "bg-gradient-primary text-primary-foreground shadow-glow" : "glass text-muted-foreground"}`}
              >
                {s.name}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mb-4">
            {events.length} event{events.length === 1 ? "" : "s"} found — event select karne par details aur registration button milega.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {events.map((event) => <EventCard key={event.id} e={event} />)}
          </div>

          {events.length === 0 && (
            <div className="glass-strong rounded-3xl p-8 text-center text-muted-foreground">
              No indoor events found for "{query}"
            </div>
          )}
        </div>
    </PageShell>
  );
}