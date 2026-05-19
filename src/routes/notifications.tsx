import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/app-store";
import { formatDistanceToNow } from "date-fns";

type Notif = { id: string; title: string; body: string | null; read: boolean; created_at: string };

export const Route = createFileRoute("/notifications")({
  component: Notifications,
  head: () => ({ meta: [{ title: "Notifications — Eventra" }] }),
});

function Notifications() {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });
      setItems(data ?? []);
      setLoading(false);
      // mark all as read
      const unread = (data ?? []).filter((n) => !n.read).map((n) => n.id);
      if (unread.length) await supabase.from("notifications").update({ read: true }).in("id", unread);
    })();
  }, [isAuthenticated]);

  return (
    <PageShell title="Notifications">
      <div className="space-y-2 sm:space-y-3 max-w-2xl mx-auto">
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-8">Loading…</p>
        ) : items.length === 0 ? (
          <div className="glass-strong rounded-3xl p-8 text-center text-sm text-muted-foreground">
            No notifications yet. Register for an event to see updates here.
          </div>
        ) : (
          items.map((n) => (
            <div
              key={n.id}
              className={`glass-strong rounded-2xl p-3 sm:p-4 flex gap-3 ${!n.read ? "ring-1 ring-primary/30" : ""}`}
            >
              <div className="size-9 sm:size-10 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shrink-0">
                <Bell className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-semibold text-xs sm:text-sm leading-snug">{n.title}</h3>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0 mt-0.5">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                  </span>
                </div>
                {n.body && <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </PageShell>
  );
}
