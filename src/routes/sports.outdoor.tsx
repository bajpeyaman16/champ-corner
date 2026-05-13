import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { OUTDOOR_SPORTS } from "@/lib/mock-data";
import { ChevronRight, Search, X, MapPin, Trophy, Users, Calendar, ArrowRight } from "lucide-react";
import { useState } from "react";
 
export const Route = createFileRoute("/sports/outdoor")({
  component: Outdoor,
  head: () => ({ meta: [{ title: "Outdoor Sports — Eventra" }] }),
});
 
const SPORT_DETAILS: Record<string, {
  description: string;
  prize: string;
  teamSize: string;
  nextEvent: string;
  venue: string;
  eventId: string;
  banner: string;
}> = {
  cricket: {
    description: "India ka sabse popular outdoor sport. Bat aur ball se khela jaane wala tournament format.",
    prize: "₹1,00,000",
    teamSize: "11 players",
    nextEvent: "15 Jun 2025",
    venue: "TT Nagar Stadium, Bhopal",
    eventId: "t1",
    banner: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
  },
  football: {
    description: "Team spirit aur speed ka khel. Leagues aur knockout tournaments available hain.",
    prize: "₹75,000",
    teamSize: "11 players",
    nextEvent: "20 Jun 2025",
    venue: "Nehru Stadium, Indore",
    eventId: "t2",
    banner: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
  },
  athletics: {
    description: "Running, jumping, throwing — individual aur relay events sabke liye.",
    prize: "₹50,000",
    teamSize: "Individual",
    nextEvent: "25 Jun 2025",
    venue: "Sports Complex, Gwalior",
    eventId: "t1",
    banner: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
  },
  hockey: {
    description: "Stick aur ball ka tez-tarraar khel. State level tournaments Bhopal mein hote hain.",
    prize: "₹60,000",
    teamSize: "11 players",
    nextEvent: "1 Jul 2025",
    venue: "Hockey Stadium, Bhopal",
    eventId: "t1",
    banner: "https://images.unsplash.com/photo-1617711773026-ea4b9eb41f86?auto=format&fit=crop&w=1200&q=80",
  },
};
 
function Outdoor() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<(typeof OUTDOOR_SPORTS)[0] | null>(null);
 
  const filtered = OUTDOOR_SPORTS.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );
 
  const details = selected ? SPORT_DETAILS[selected.slug] : null;
 
  return (
    <PageShell title="Outdoor Sports">
 
      {/* ── DETAIL VIEW ── */}
      {selected && details ? (
        <div>
          {/* Back */}
          <button
            onClick={() => setSelected(null)}
            className="mb-4 inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition glass px-3 py-2 rounded-xl"
          >
            ← Back to Sports
          </button>
 
          {/* Banner — taller on larger screens */}
          <div className="relative h-48 sm:h-64 md:h-72 rounded-3xl overflow-hidden mb-5">
            <img
              src={details.banner}
              alt={selected.name}
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
              <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold uppercase">
                Outdoor
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
 
          {/* Tournaments info */}
          <div className="glass-strong rounded-2xl p-3 sm:p-4 mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Available</p>
              <p className="font-display font-bold text-base sm:text-lg mt-0.5">
                {selected.tournaments} Tournaments · {selected.events} Events
              </p>
            </div>
            <Trophy className="size-7 sm:size-8 text-orange-400 opacity-50" />
          </div>
 
          {/* CTA — stacked on mobile, side-by-side on md+ */}
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
              className="block text-center py-3.5 sm:py-4 rounded-3xl glass font-bold border border-orange-400/40 text-orange-400 hover:bg-orange-400/10 transition text-sm sm:text-base"
            >
              Register Now · {details.prize}
            </Link>
          </div>
        </div>
 
      ) : (
        /* ── SPORTS LIST ── */
        <div className="space-y-4">
          {/* Search */}
          <div className="glass rounded-xl px-3 py-2.5 flex items-center gap-2">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search outdoor sports..."
              className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground"
            />
            {query && (
              <button onClick={() => setQuery("")} aria-label="Clear">
                <X className="size-4 text-muted-foreground" />
              </button>
            )}
          </div>
 
          <p className="text-xs text-muted-foreground">
            {filtered.length} sport{filtered.length !== 1 ? "s" : ""} available
          </p>
 
          {/* Sports cards — 1-col mobile, 2-col tablet+ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {filtered.map((s) => (
              <button
                key={s.name}
                onClick={() => setSelected(s)}
                className="group flex items-center gap-3 sm:gap-4 glass-strong rounded-2xl p-3 sm:p-4 border border-zinc-800 hover:border-orange-400 transition-all text-left w-full"
              >
                {/* Image */}
                <div className="relative shrink-0 w-24 sm:w-28 h-20 sm:h-24 rounded-xl overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.name}
                    className="absolute inset-0 size-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                </div>
 
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-bold text-white text-sm sm:text-base">{s.name}</h3>
                    <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full shrink-0">
                      Outdoor
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{s.tournaments} tournaments</p>
                  <p className="text-xs sm:text-sm mt-1 text-orange-400 font-semibold">{s.events} Events</p>
                  <span className="inline-flex items-center gap-1 mt-1.5 text-xs text-primary font-semibold">
                    View Details <ArrowRight className="size-3" />
                  </span>
                </div>
 
                <ChevronRight className="size-4 sm:size-5 text-zinc-500 group-hover:text-orange-400 transition shrink-0" />
              </button>
            ))}
          </div>
 
          {filtered.length === 0 && (
            <div className="glass-strong rounded-3xl p-8 text-center text-muted-foreground">
              No sports found for "{query}"
            </div>
          )}
        </div>
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