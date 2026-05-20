import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { useSavedEvents, useAllEvents } from "@/lib/app-store";
import { Calendar, MapPin, Trophy, Users, Bookmark, Share2, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
 
export const Route = createFileRoute("/events/$eventId")({
  component: EventDetails,
  head: () => ({
    meta: [{ title: "Event — Eventra" }],
  }),
});
 
const TABS = ["Details", "Rules", "Participants", "Reviews"] as const;
 
function EventDetails() {
  const { eventId } = Route.useParams();
  const { list: allEvents } = useAllEvents();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const saved = useSavedEvents();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Details");
  const e = allEvents.find((t) => t.id === eventId);
  if (pathname !== `/events/${eventId}`) return <Outlet />;
  if (!e) {
    return (
      <PageShell title="Loading…">
        <p className="text-muted-foreground text-sm">Loading event…</p>
      </PageShell>
    );
  }
 
  return (
    <div className="min-h-screen pb-28 sm:pb-32">
      {/* Banner — taller on larger screens */}
      <div className="relative h-56 sm:h-72 md:h-80">
        <img src={e.banner} alt={e.name} className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/30 to-background" />
 
        {/* Back button */}
        <Link
          to="/explore"
          className="absolute top-4 left-4 size-9 sm:size-10 rounded-full glass grid place-items-center text-sm"
        >
          ←
        </Link>
 
        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => saved.toggle(e.id)}
            className="size-9 sm:size-10 rounded-full glass grid place-items-center"
            aria-label="Save event"
          >
            <Bookmark className={`size-4 ${saved.has(e.id) ? "fill-primary text-primary" : ""}`} />
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              toast.success("Link copied");
            }}
            className="size-9 sm:size-10 rounded-full glass grid place-items-center"
            aria-label="Share"
          >
            <Share2 className="size-4" />
          </button>
        </div>
 
        {/* Title overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-[10px] sm:text-xs uppercase tracking-widest text-primary font-bold">{e.sport}</p>
          <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold mt-1 leading-tight">{e.name}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">by {e.organizer}</p>
        </div>
      </div>
 
      <div className="mx-auto max-w-2xl px-4 -mt-6 relative">
        {/* Stats card — 2-col on mobile, 4-col on sm+ */}
        <div className="glass-strong rounded-3xl p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 shadow-card">
          <Stat icon={<Calendar className="size-4 text-primary" />} label="Date" value={e.date} />
          <Stat icon={<MapPin className="size-4 text-accent" />} label="Venue" value={`${e.venue}, ${e.city}`} />
          <Stat icon={<Trophy className="size-4 text-orange" />} label="Prize Pool" value={e.prizePool} />
          <Stat icon={<Users className="size-4 text-primary" />} label="Slots" value={e.slots} />
        </div>
 
        {/* Tabs — horizontally scrollable on small screens */}
        <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                tab === t ? "bg-gradient-primary text-primary-foreground shadow-glow" : "glass text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
 
        {/* Tab content */}
        <div className="mt-5 glass-strong rounded-3xl p-4 sm:p-5">
          {tab === "Details" && (
            <div className="space-y-3 sm:space-y-4 text-sm">
              <Row label="Format" value={e.format} />
              <Row label="Team Size" value={e.teamSize} />
              <Row label="Entry Fee" value={e.entryFee} />
              <Row label="Winning Prize" value={e.prizePool} />
              <Row label="Venue" value={`${e.venue}, ${e.city}`} />
              <Row label="Schedule" value={e.date} />
            </div>
          )}
          {tab === "Rules" && (
            <ul className="space-y-2.5 text-sm">
              {e.rules.map((r: string, i: number) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary font-bold shrink-0">{String(i + 1).padStart(2, "0")}.</span>
                  <span className="text-muted-foreground">{r}</span>
                </li>
              ))}
            </ul>
          )}
          {tab === "Participants" && (
            <p className="text-sm text-muted-foreground">{e.slots} confirmed. List opens 48h before kickoff.</p>
          )}
          {tab === "Reviews" && (
            <div className="flex items-center gap-3">
              <div className="text-4xl font-bold text-gradient-gold">{e.rating}</div>
              <div className="flex flex-col">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${i < Math.round(e.rating) ? "fill-primary text-primary" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Based on past editions</p>
              </div>
            </div>
          )}
        </div>
      </div>
 
      {/* Sticky CTA — full width on mobile, centered on larger screens */}
      <div className="fixed bottom-4 left-0 right-0 px-4 z-40 sm:left-1/2 sm:-translate-x-1/2 sm:w-[calc(100%-2rem)] sm:max-w-md">
        <Link
          to="/events/$eventId/register"
          params={{ eventId: e.id }}
          className="block w-full text-center py-4 rounded-3xl bg-gradient-primary text-primary-foreground font-bold shadow-glow text-sm sm:text-base"
        >
          Register Now · {e.entryFee}
        </Link>
      </div>
    </div>
  );
}
 
function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="size-7 sm:size-8 rounded-lg glass grid place-items-center mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-xs sm:text-sm font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}
 
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="font-semibold text-right">{value}</span>
    </div>
  );
}