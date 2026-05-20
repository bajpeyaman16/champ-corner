// my-events.tsx — RESPONSIVE
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { useRegistrations, useAllEvents } from "@/lib/app-store";
import { Calendar, MapPin, Download } from "lucide-react";
import { useState } from "react";
 
export const Route = createFileRoute("/my-events")({
  component: MyEvents,
  head: () => ({ meta: [{ title: "My Events — Eventra" }] }),
});
 
const TABS = ["Upcoming", "Ongoing", "Completed", "Registered"] as const;
 
function MyEvents() {
  const { list } = useRegistrations();
  const { list: allEvents } = useAllEvents();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Registered");
 
  const events = list
    .map((r) => ({ reg: r, event: allEvents.find((t) => t.id === r.eventId)! }))
    .filter((x) => x.event);
 
  return (
    <PageShell title="My Events">
      {/* Horizontally scrollable tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition ${
              tab === t ? "bg-gradient-primary text-primary-foreground shadow-glow" : "glass text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
 
      {events.length === 0 ? (
        <div className="glass-strong rounded-3xl p-8 text-center">
          <p className="text-muted-foreground text-sm">No events yet.</p>
          <Link
            to="/explore"
            className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm"
          >
            Explore events
          </Link>
        </div>
      ) : (
        /* Mobile: 1-col | Tablet: 2-col */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {events.map(({ reg, event }) => (
            <div key={reg.txnId} className="glass-strong rounded-3xl overflow-hidden">
              <div className="flex gap-3 p-3">
                <img
                  src={event.banner}
                  alt={event.name}
                  className="size-20 sm:size-24 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-primary text-primary-foreground font-bold">
                    {tab}
                  </span>
                  <h3 className="font-display font-bold mt-1.5 truncate text-sm sm:text-base">{event.name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="size-3 shrink-0" />
                    <span className="truncate">{event.date.split(" · ")[0]}</span>
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="size-3 shrink-0" />
                    <span className="truncate">{event.venue}</span>
                  </p>
                </div>
              </div>
              <div className="flex border-t border-border">
                <Link
                  to="/events/$eventId"
                  params={{ eventId: event.id }}
                  className="flex-1 py-3 text-center text-xs sm:text-sm font-semibold text-primary"
                >
                  View Details
                </Link>
                <button className="flex-1 py-3 text-center text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 border-l border-border">
                  <Download className="size-3.5 sm:size-4" /> Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}