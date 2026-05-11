import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { EventCard } from "@/components/EventCard";
import { TOURNAMENTS } from "@/lib/mock-data";

export const Route = createFileRoute("/explore")({
  component: Explore,
  head: () => ({
    meta: [
      { title: "Explore Events — Eventra" },
      { name: "description", content: "Browse all live and upcoming sports tournaments on Eventra." },
    ],
  }),
});

function Explore() {
  return (
    <PageShell title="Explore">
      <div className="space-y-4">
        {TOURNAMENTS.map((e) => <EventCard key={e.id} e={e} />)}
      </div>
    </PageShell>
  );
}
