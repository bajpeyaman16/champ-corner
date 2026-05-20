import { Link } from "@tanstack/react-router";
import { Star, MapPin, Calendar, Trophy, Bookmark } from "lucide-react";
import type { DbEvent } from "@/lib/app-store";
import { useSavedEvents } from "@/lib/app-store";

export function EventCard({ e, compact = false }: { e: Tournament; compact?: boolean }) {
  const saved = useSavedEvents();
  const isSaved = saved.has(e.id);
  return (
    <Link
      to="/events/$eventId"
      params={{ eventId: e.id }}
      className="block group glass-strong rounded-3xl overflow-hidden shadow-card hover:shadow-glow transition"
    >
      <div className="relative h-40 overflow-hidden">
        <img src={e.banner} alt={e.name} className="size-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
        {e.isLive && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold tracking-wider">
            ● LIVE
          </span>
        )}
        <button
          onClick={(ev) => {
            ev.preventDefault();
            saved.toggle(e.id);
          }}
          className="absolute top-3 right-3 size-9 rounded-full glass grid place-items-center"
        >
          <Bookmark className={`size-4 ${isSaved ? "fill-primary text-primary" : ""}`} />
        </button>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-primary font-semibold">{e.sport}</p>
            <h3 className="font-display font-bold text-lg leading-tight text-foreground">{e.name}</h3>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full glass text-xs">
            <Star className="size-3 fill-primary text-primary" />
            {e.rating}
          </div>
        </div>
      </div>
      {!compact && (
        <div className="p-4 grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="size-3.5 text-primary" /> {e.date.split(" · ")[0]}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="size-3.5 text-accent" /> {e.city}
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Trophy className="size-3.5 text-orange" /> {e.prizePool}
          </div>
          <div className="text-right font-semibold text-foreground">{e.entryFee}</div>
        </div>
      )}
    </Link>
  );
}
