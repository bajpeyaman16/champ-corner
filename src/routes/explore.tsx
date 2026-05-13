import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { EventCard } from "@/components/EventCard";
import { TOURNAMENTS, CATEGORIES, type Category } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
 
type Search = { q?: string; category?: Category; city?: string };
 
export const Route = createFileRoute("/explore")({
  component: Explore,
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" && s.q ? s.q : undefined,
    category: ["sports", "technical", "academics", "more"].includes(s.category as string)
      ? (s.category as Category)
      : undefined,
    city: typeof s.city === "string" && s.city ? s.city : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Explore Events — Eventra" },
      { name: "description", content: "Browse all live and upcoming sports tournaments on Eventra." },
    ],
  }),
});
 
function Explore() {
  const { q, category, city } = Route.useSearch();
  const navigate = useNavigate({ from: "/explore" });
  const [showFilter, setShowFilter] = useState(false);
 
  const cities = useMemo(() => Array.from(new Set(TOURNAMENTS.map((t) => t.city))).sort(), []);
 
  const results = useMemo(() => {
    const term = q?.toLowerCase().trim();
    return TOURNAMENTS.filter((t) => {
      if (category && t.category !== category) return false;
      if (city && t.city !== city) return false;
      if (term) {
        const hay = `${t.name} ${t.sport} ${t.city} ${t.organizer} ${t.venue}`.toLowerCase();
        if (!hay.includes(term)) return false;
      }
      return true;
    });
  }, [q, category, city]);
 
  const updateSearch = (patch: Partial<Search>) =>
    navigate({ search: (prev: Search) => ({ ...prev, ...patch }) });
 
  const activeChips: { label: string; onClear: () => void }[] = [];
  if (q) activeChips.push({ label: `"${q}"`, onClear: () => updateSearch({ q: undefined }) });
  if (category) {
    const cat = CATEGORIES.find((c) => c.slug === category);
    if (cat) activeChips.push({ label: cat.name, onClear: () => updateSearch({ category: undefined }) });
  }
  if (city) activeChips.push({ label: city, onClear: () => updateSearch({ city: undefined }) });
 
  return (
    <PageShell title="Explore">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <p className="text-xs sm:text-sm text-muted-foreground">
          {results.length} event{results.length === 1 ? "" : "s"} found
        </p>
        <button
          onClick={() => setShowFilter((v) => !v)}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-xl glass text-xs sm:text-sm font-semibold"
        >
          <SlidersHorizontal className="size-3.5" />
          <span>Filters</span>
          {(category || city) && (
            <span className="size-4 rounded-full bg-primary text-primary-foreground text-[9px] grid place-items-center font-bold">
              {[category, city].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>
 
      {/* Filter panel */}
      {showFilter && (
        <div className="glass-strong rounded-3xl p-4 mb-4 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => updateSearch({ category: category === c.slug ? undefined : c.slug })}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    category === c.slug ? "bg-gradient-primary text-primary-foreground" : "glass text-muted-foreground"
                  }`}
                >
                  {c.icon} {c.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">City</p>
            <div className="flex flex-wrap gap-2">
              {cities.map((c) => (
                <button
                  key={c}
                  onClick={() => updateSearch({ city: city === c ? undefined : c })}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                    city === c ? "bg-gradient-primary text-primary-foreground" : "glass text-muted-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
 
      {/* Active filter chips */}
      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {activeChips.map((c) => (
            <span key={c.label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass text-xs">
              {c.label}
              <button onClick={c.onClear} aria-label="Clear"><X className="size-3" /></button>
            </span>
          ))}
          <button
            onClick={() => navigate({ search: {} })}
            className="px-3 py-1 rounded-full text-xs text-destructive glass"
          >
            Clear all
          </button>
        </div>
      )}
 
      {/* Results */}
      {results.length === 0 ? (
        <div className="glass-strong rounded-3xl p-10 text-center">
          <p className="text-muted-foreground text-sm">No events match your filters.</p>
          <button
            onClick={() => navigate({ search: {} })}
            className="mt-4 px-4 py-2 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold"
          >
            Clear all
          </button>
        </div>
      ) : (
        /* Mobile: 1-col | Tablet: 2-col | Desktop: 2-col */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.map((e) => <EventCard key={e.id} e={e} />)}
        </div>
      )}
    </PageShell>
  );
}