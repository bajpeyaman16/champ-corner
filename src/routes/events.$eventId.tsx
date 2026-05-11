import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { TOURNAMENTS } from "@/lib/mock-data";
import { useSavedEvents } from "@/lib/app-store";
import { Calendar, MapPin, Trophy, Users, Bookmark, Share2, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/events/$eventId")({
  component: EventDetails,
  loader: ({ params }) => {
    const e = TOURNAMENTS.find((t) => t.id === params.eventId);
    if (!e) throw notFound();
    return { event: e };
  },
  notFoundComponent: () => (
    <PageShell title="Not found"><p className="text-muted-foreground">Event not found.</p></PageShell>
  ),
  head: ({ loaderData }) => ({
    meta: loaderData?.event
      ? [
          { title: `${loaderData.event.name} — Eventra` },
          { name: "description", content: `${loaderData.event.name} at ${loaderData.event.venue}, ${loaderData.event.city}.` },
          { property: "og:title", content: loaderData.event.name },
          { property: "og:description", content: `${loaderData.event.organizer} · ${loaderData.event.date}` },
          { property: "og:image", content: loaderData.event.banner },
        ]
      : [],
  }),
});

const TABS = ["Details", "Rules", "Participants", "Reviews"] as const;

function EventDetails() {
  const { event: e } = Route.useLoaderData();
  const saved = useSavedEvents();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Details");

  return (
    <div className="min-h-screen pb-32">
      <div className="relative h-72">
        <img src={e.banner} alt={e.name} className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/30 to-background" />
        <Link to="/explore" className="absolute top-4 left-4 size-10 rounded-full glass grid place-items-center">←</Link>
        <div className="absolute top-4 right-4 flex gap-2">
          <button onClick={() => saved.toggle(e.id)} className="size-10 rounded-full glass grid place-items-center">
            <Bookmark className={`size-4 ${saved.has(e.id) ? "fill-primary text-primary" : ""}`} />
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              toast.success("Link copied");
            }}
            className="size-10 rounded-full glass grid place-items-center"
          >
            <Share2 className="size-4" />
          </button>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-xs uppercase tracking-widest text-primary font-bold">{e.sport}</p>
          <h1 className="font-display text-2xl font-bold mt-1">{e.name}</h1>
          <p className="text-sm text-muted-foreground">by {e.organizer}</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 -mt-6 relative">
        <div className="glass-strong rounded-3xl p-4 grid grid-cols-2 gap-3 shadow-card">
          <Stat icon={<Calendar className="size-4 text-primary" />} label="Date" value={e.date} />
          <Stat icon={<MapPin className="size-4 text-accent" />} label="Venue" value={`${e.venue}, ${e.city}`} />
          <Stat icon={<Trophy className="size-4 text-orange" />} label="Prize Pool" value={e.prizePool} />
          <Stat icon={<Users className="size-4 text-primary" />} label="Slots" value={e.slots} />
        </div>

        <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                tab === t ? "bg-gradient-primary text-primary-foreground shadow-glow" : "glass text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-5 glass-strong rounded-3xl p-5">
          {tab === "Details" && (
            <div className="space-y-4 text-sm">
              <Row label="Format" value={e.format} />
              <Row label="Team Size" value={e.teamSize} />
              <Row label="Entry Fee" value={e.entryFee} />
              <Row label="Winning Prize" value={e.prizePool} />
              <Row label="Venue" value={`${e.venue}, ${e.city}`} />
              <Row label="Schedule" value={e.date} />
            </div>
          )}
          {tab === "Rules" && (
            <ul className="space-y-2 text-sm">
              {e.rules.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary font-bold">{String(i + 1).padStart(2, "0")}.</span>
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
                    <Star key={i} className={`size-4 ${i < Math.round(e.rating) ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Based on past editions</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-1.5rem)] max-w-md">
        <Link
          to="/events/$eventId/register"
          params={{ eventId: e.id }}
          className="block w-full text-center py-4 rounded-3xl bg-gradient-primary text-primary-foreground font-bold shadow-glow"
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
      <span className="size-8 rounded-lg glass grid place-items-center mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-border pb-2 last:border-0 last:pb-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-right">{value}</span>
    </div>
  );
}
