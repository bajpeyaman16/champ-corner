import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { INDOOR_SPORTS } from "@/lib/mock-data";
import { Trophy, Users, Calendar, MapPin } from "lucide-react";
import { useState } from "react";
 
export const Route = createFileRoute("/sports/indoor")({
  component: Indoor,
  head: () => ({ meta: [{ title: "Indoor Sports — Eventra" }] }),
});
 
const SPORT_DETAILS: Record<string, {
  description: string;
  prize: string;
  teamSize: string;
  nextEvent: string;
  venue: string;
  eventId: string;
}> = {
  badminton: {
    description: "Racket aur shuttlecock ka tez khel. Singles aur doubles dono formats available hain.",
    prize: "₹50,000",
    teamSize: "Individual / Pairs",
    nextEvent: "25 Jun 2025",
    venue: "Motilal Nehru Hall, Bhopal",
    eventId: "t3",
  },
  chess: {
    description: "Dimag ka khel. Swiss system format mein state level championship.",
    prize: "₹25,000",
    teamSize: "Individual",
    nextEvent: "1 Jul 2025",
    venue: "BHEL Club, Bhopal",
    eventId: "t4",
  },
  snooker: {
    description: "Cue sports ka premium tournament. City level league format.",
    prize: "₹20,000",
    teamSize: "Individual",
    nextEvent: "10 Jul 2025",
    venue: "Sports Club, Indore",
    eventId: "t3",
  },
  "table tennis": {
    description: "Indoor ping pong — reflex aur precision ka khel.",
    prize: "₹30,000",
    teamSize: "Individual / Pairs",
    nextEvent: "15 Jul 2025",
    venue: "Indoor Stadium, Bhopal",
    eventId: "t3",
  },
  kabaddi: {
    description: "Strength aur strategy — MP ka popular contact sport.",
    prize: "₹40,000",
    teamSize: "7 players",
    nextEvent: "20 Jul 2025",
    venue: "Gandhi Maidan, Bhopal",
    eventId: "t1",
  },
  boxing: {
    description: "State boxing championship — different weight categories mein.",
    prize: "₹35,000",
    teamSize: "Individual",
    nextEvent: "25 Jul 2025",
    venue: "Sports Authority, Bhopal",
    eventId: "t1",
  },
};
 
function Indoor() {
  const [selected, setSelected] = useState<(typeof INDOOR_SPORTS)[0] | null>(null);
  const details = selected ? SPORT_DETAILS[selected.name.toLowerCase()] : null;
 
  return (
    <PageShell title="Indoor Sports">
 
      {/* ── DETAIL VIEW ── */}
      {selected && details ? (
        <div>
          {/* Back */}
          <button
            onClick={() => setSelected(null)}
            className="mb-4 inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition glass px-3 py-2 rounded-xl"
          >
            ← Back to Indoor Sports
          </button>
 
          {/* Banner */}
          <div className="relative h-48 sm:h-56 md:h-64 rounded-3xl overflow-hidden mb-5">
            <img
              src={selected.image}
              alt={selected.name}
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
              <span className="text-[10px] bg-accent/80 text-accent-foreground px-2 py-0.5 rounded-full font-bold uppercase">
                Indoor
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold mt-2">{selected.name}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">{details.description}</p>
            </div>
          </div>
 
          {/* Stats — 2-col mobile, 4-col tablet+ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-5">
            <StatCard icon={<Trophy className="size-4 text-orange-400" />} label="Prize Pool" value={details.prize} />
            <StatCard icon={<Users className="size-4 text-primary" />} label="Team Size" value={details.teamSize} />
            <StatCard icon={<Calendar className="size-4 text-accent" />} label="Next Event" value={details.nextEvent} />
            <StatCard icon={<MapPin className="size-4 text-pink-400" />} label="Venue" value={details.venue} />
          </div>
 
          {/* Availability */}
          <div className="glass-strong rounded-2xl p-3 sm:p-4 mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Available</p>
              <p className="font-display font-bold text-base sm:text-lg mt-0.5">
                {selected.tournaments} Tournaments · {selected.events} Events
              </p>
            </div>
            <Trophy className="size-7 sm:size-8 text-primary opacity-50" />
          </div>
 
          {/* CTA — stacked on mobile, 2-col on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Link
              to="/events/$eventId"
              params={{ eventId: details.eventId }}
              className="block text-center py-3.5 sm:py-4 rounded-3xl bg-gradient-primary text-primary-foreground font-bold shadow-glow hover:opacity-90 transition text-sm sm:text-base"
            >
              View Full Event Details
            </Link>
            <Link
              to="/events/$eventId/register"
              params={{ eventId: details.eventId }}
              className="block text-center py-3.5 sm:py-4 rounded-3xl glass font-bold border border-primary/30 text-primary hover:bg-primary/10 transition text-sm sm:text-base"
            >
              Register Now · {details.prize}
            </Link>
          </div>
        </div>
 
      ) : (
        /* ── GRID VIEW ── */
        <>
          <p className="text-xs text-muted-foreground mb-4">
            {INDOOR_SPORTS.length} sports available — tap to explore
          </p>
 
          {/* 2-col mobile, 3-col tablet+ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {INDOOR_SPORTS.map((s) => (
              <button
                key={s.name}
                onClick={() => setSelected(s)}
                className="group relative h-36 sm:h-44 md:h-52 rounded-2xl overflow-hidden glass-strong text-left"
              >
                <img
                  src={s.image}
                  alt={s.name}
                  className="absolute inset-0 size-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <span className="absolute top-2 right-2 px-1.5 sm:px-2 py-0.5 rounded-full bg-accent/80 text-accent-foreground text-[9px] sm:text-[10px] font-bold uppercase">
                  Indoor
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                  <h3 className="font-display font-bold leading-tight text-xs sm:text-sm">{s.name}</h3>
                  <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">
                    {s.tournaments}T · {s.events}E
                  </p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </PageShell>
  );
}
 
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass-strong rounded-2xl p-2.5 sm:p-3 flex items-start gap-2">
      <span className="size-7 sm:size-8 rounded-lg glass grid place-items-center mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[9px] sm:text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-xs sm:text-sm font-semibold truncate">{value}</p>
      </div>
    </div>
  );
}