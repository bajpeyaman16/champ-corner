import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { NOTIFICATIONS } from "@/lib/mock-data";
import { Bell } from "lucide-react";
 
export const Route = createFileRoute("/organize")({
  component: Notifications,
  head: () => ({ meta: [{ title: "Notifications — Eventra" }] }),
});
 
function Notifications() {
  return (
    <PageShell title="Notifications">
      {/* Mobile: 1-col stacked | Tablet: still 1-col (notifications read better stacked) */}
      <div className="space-y-2 sm:space-y-3 max-w-2xl mx-auto">
        {NOTIFICATIONS.map((n) => (
          <div
            key={n.id}
            className={`glass-strong rounded-2xl p-3 sm:p-4 flex gap-3 ${
              n.unread ? "ring-1 ring-primary/30" : ""
            }`}
          >
            {/* Icon */}
            <div className="size-9 sm:size-10 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shrink-0">
              <Bell className="size-4" />
            </div>
 
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-semibold text-xs sm:text-sm leading-snug">{n.title}</h3>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">{n.time}</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>
            </div>
 
            {/* Unread dot */}
            {n.unread && (
              <div className="size-2 rounded-full bg-primary shrink-0 mt-2" />
            )}
          </div>
        ))}
      </div>
    </PageShell>
  );
}