import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { NOTIFICATIONS } from "@/lib/mock-data";
import { Bell } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  component: Notifications,
  head: () => ({ meta: [{ title: "Notifications — Eventra" }] }),
});

function Notifications() {
  return (
    <PageShell title="Notifications">
      <div className="space-y-3">
        {NOTIFICATIONS.map((n) => (
          <div key={n.id} className={`glass-strong rounded-2xl p-4 flex gap-3 ${n.unread ? "ring-1 ring-primary/30" : ""}`}>
            <div className="size-10 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shrink-0">
              <Bell className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between gap-2">
                <h3 className="font-semibold text-sm">{n.title}</h3>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{n.time}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
