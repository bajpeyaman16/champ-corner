import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { EventCard } from "@/components/EventCard";
import { CATEGORIES } from "@/lib/mock-data";
import { useAuth, useAllEvents } from "@/lib/app-store";
import { useEffect } from "react";
import { ChevronRight, MapPin, TrendingUp, Trophy, Users, Zap } from "lucide-react";
 
export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Eventra — Discover sports events near you" },
      { name: "description", content: "Browse, join and organize sports tournaments. Cricket, Football, Badminton and more." },
      { property: "og:title", content: "Eventra — Discover sports events" },
      { property: "og:description", content: "Browse, join and organize sports tournaments." },
    ],
  }),
});
 
function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const { list: allEvents } = useAllEvents();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate({ to: "/login" });
  }, [loading, isAuthenticated, navigate]);

  const greeting = (user?.name ?? "Player").split(" ")[0];
  const featured = allEvents.slice(0, 4);
 
  return (
    <PageShell greeting={greeting}>
 
      {/* ── Hero banner ─────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden mb-8 bg-gradient-to-br from-zinc-900 via-zinc-900 to-orange-950/40 border border-zinc-800/60">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-80 h-40 rounded-full bg-amber-400/5 blur-2xl" />
        </div>
        <div className="relative px-8 py-10 lg:py-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={13} className="text-cyan-400" />
              <span className="text-xs text-zinc-400">Bhopal, Madhya Pradesh</span>
            </div>
            <h2 className="text-3xl xl:text-4xl font-black text-white leading-tight mb-3">
              Discover & Join<br />
              <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                Sports Tournaments
              </span>
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6 max-w-md">
              Cricket, Football, Badminton aur 20+ sports mein participate karo. Madhya Pradesh ke best tournaments ek hi jagah pe.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => navigate({ to: "/explore" })}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
              >
                <Zap size={15} /> Explore Events
              </button>
              <button
                onClick={() => navigate({ to: "/organize" })}
                className="px-5 py-2.5 rounded-xl bg-white/5 border border-zinc-700 text-white font-semibold text-sm hover:bg-white/10 active:scale-95 transition-all"
              >
                + Organize Event
              </button>
            </div>
          </div>
 
          {/* Stats — visible on large screens */}
          <div className="hidden lg:grid grid-cols-2 gap-3 shrink-0">
            {[
              { icon: Zap,        label: "Live Events",  val: "48",    color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
              { icon: Trophy,     label: "Prize Pool",   val: "₹12L+", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
              { icon: Users,      label: "Players",      val: "2,400+",color: "text-cyan-400",   bg: "bg-cyan-500/10   border-cyan-500/20"   },
              { icon: TrendingUp, label: "Sports",       val: "20+",   color: "text-green-400",  bg: "bg-green-500/10  border-green-500/20"  },
            ].map(({ icon: Icon, label, val, color, bg }) => (
              <div key={label} className={`${bg} border rounded-2xl p-4 w-36`}>
                <Icon size={18} className={`${color} mb-2`} />
                <p className={`text-2xl font-black ${color}`}>{val}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
 
      {/* ── Categories ──────────────────────────────────────── */}
      <section className="mb-8">
        <SectionHeader title="Explore by Event Type" />
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() =>
                c.slug === "sports"
                  ? navigate({ to: "/sports" })
                  : navigate({ to: "/explore", search: { category: c.slug, q: undefined, city: undefined } })
              }
              className="bg-zinc-900 border border-zinc-800 hover:border-orange-500/40 rounded-2xl p-4 flex flex-col items-center gap-2 hover:-translate-y-0.5 active:scale-95 transition-all duration-150 group"
            >
              <span className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} grid place-items-center text-2xl`}>
                {c.icon}
              </span>
              <span className="text-xs font-medium text-zinc-400 group-hover:text-white transition text-center leading-tight">{c.name}</span>
            </button>
          ))}
        </div>
      </section>
 
      {/* ── Featured Events ─────────────────────────────────── */}
      <section>
        <SectionHeader title="Featured Events" actionTo="/explore" />
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {featured.length === 0 ? (
            <p className="text-sm text-zinc-500 col-span-full">No events yet — be the first to organize one!</p>
          ) : (
            featured.map((e) => <EventCard key={e.id} e={e} />)
          )}
        </div>
      </section>
 
    </PageShell>
  );
}
 
export function SectionHeader({ title, actionTo }: { title: string; actionTo?: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-base font-bold text-white">{title}</h2>
      {actionTo && (
        <Link
          to={actionTo as "/"}
          className="text-xs text-orange-400 hover:text-orange-300 transition inline-flex items-center gap-0.5 font-medium"
        >
          See all <ChevronRight size={13} />
        </Link>
      )}
    </div>
  );
}