// Supabase-backed app store. Preserves the legacy hook surface used by all pages.
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Profile = { name: string; email: string; phone?: string; dob?: string; avatar?: string } | null;

export type Registration = {
  eventId: string;
  teamName: string;
  captain: string;
  paidAt: string;
  txnId: string;
};

export type OrganizedEvent = {
  id: string;
  title: string;
  description: string;
  category: string;
  type: "Indoor" | "Outdoor";
  prizePool: string;
  venue: string;
  date: string;
  entryFee: string;
  teamLimit: number;
  rules: string;
  status: "draft" | "published";
  createdAt: string;
};

export type DbEvent = {
  id: string;
  name: string;
  sport: string;
  category: string;
  organizer: string;
  venue: string;
  city: string;
  date: string;
  prizePool: string;
  entryFee: string;
  slots: string;
  format: string;
  teamSize: string;
  rating: number;
  banner: string;
  rules: string[];
  type: "Indoor" | "Outdoor";
  isLive?: boolean;
};

type Ctx = {
  authUser: User | null;
  profile: Profile;
  isAuthenticated: boolean;
  loading: boolean;
  savedIds: string[];
  registrations: Registration[];
  organized: OrganizedEvent[];
  allEvents: DbEvent[];
  refresh: () => Promise<void>;
  refreshAllEvents: () => Promise<void>;
};

const FALLBACK_BANNER =
  "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80";

function mapDbEvent(e: any): DbEvent {
  return {
    id: e.id,
    name: e.name,
    sport: e.sport ?? e.category ?? "Sports",
    category: e.category ?? "sports",
    organizer: e.organizer ?? "Organizer",
    venue: e.venue ?? "",
    city: e.city ?? e.venue ?? "",
    date: e.date ?? "",
    prizePool: e.prize_pool ?? "",
    entryFee: e.entry_fee ?? "Free",
    slots: e.slots ?? "",
    format: e.format ?? "—",
    teamSize: e.team_size ?? "—",
    rating: Number(e.rating ?? 4.0),
    banner: e.banner || FALLBACK_BANNER,
    rules: Array.isArray(e.rules) ? e.rules : [],
    type: (e.type as "Indoor" | "Outdoor") ?? "Outdoor",
  };
}

const AppCtx = createContext<Ctx | null>(null);

export function AppStoreProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [organized, setOrganized] = useState<OrganizedEvent[]>([]);
  const [allEvents, setAllEvents] = useState<DbEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshAllEvents = useCallback(async () => {
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false });
    setAllEvents((data ?? []).map(mapDbEvent));
  }, []);

  const refresh = useCallback(async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const u = sessionData.session?.user ?? null;
    setAuthUser(u);
    if (!u) {
      setProfile(null);
      setSavedIds([]);
      setRegistrations([]);
      setOrganized([]);
      setLoading(false);
      return;
    }
    const [{ data: prof }, { data: saved }, { data: regs }, { data: orgs }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", u.id).maybeSingle(),
      supabase.from("saved_events").select("event_id").eq("user_id", u.id),
      supabase.from("registrations").select("*").eq("user_id", u.id).order("paid_at", { ascending: false }),
      supabase.from("events").select("*").eq("created_by", u.id).order("created_at", { ascending: false }),
    ]);
    setProfile(
      prof
        ? {
            name: prof.full_name ?? u.email?.split("@")[0] ?? "User",
            email: prof.email ?? u.email ?? "",
            phone: prof.phone ?? undefined,
            dob: prof.dob ?? undefined,
            avatar: prof.avatar_url ?? undefined,
          }
        : { name: u.email?.split("@")[0] ?? "User", email: u.email ?? "" }
    );
    setSavedIds((saved ?? []).map((s: any) => s.event_id));
    setRegistrations(
      (regs ?? []).map((r: any) => ({
        eventId: r.event_id,
        teamName: r.team_name ?? "",
        captain: r.captain ?? "",
        paidAt: r.paid_at,
        txnId: r.txn_id ?? "",
      }))
    );
    setOrganized(
      (orgs ?? []).map((e: any) => ({
        id: e.id,
        title: e.name,
        description: e.description ?? "",
        category: e.category ?? "sports",
        type: (e.type as "Indoor" | "Outdoor") ?? "Outdoor",
        prizePool: e.prize_pool ?? "",
        venue: e.venue ?? "",
        date: e.date ?? "",
        entryFee: e.entry_fee ?? "",
        teamLimit: 0,
        rules: Array.isArray(e.rules) ? e.rules.join("\n") : "",
        status: (e.status as "draft" | "published") ?? "published",
        createdAt: e.created_at,
      }))
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      void refresh();
    });
    void refresh();
    void refreshAllEvents();
    const channel = supabase
      .channel("public:events")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => {
          void refreshAllEvents();
        }
      )
      .subscribe();
    return () => {
      sub.subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [refresh, refreshAllEvents]);

  return (
    <AppCtx.Provider
      value={{
        authUser,
        profile,
        isAuthenticated: !!authUser,
        loading,
        savedIds,
        registrations,
        organized,
        allEvents,
        refresh,
        refreshAllEvents,
      }}
    >
      {children}
    </AppCtx.Provider>
  );
}

function useCtx() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("AppStoreProvider missing");
  return c;
}

export function useAuth() {
  const c = useCtx();
  return {
    user: c.profile,
    isAuthenticated: c.isAuthenticated,
    loading: c.loading,
    /** @deprecated use supabase.auth directly in the login page */
    login: (_u: any) => {},
    logout: async () => {
      await supabase.auth.signOut();
    },
    update: async (patch: { name?: string; phone?: string; avatar?: string }) => {
      if (!c.authUser) return;
      await supabase
        .from("profiles")
        .update({
          full_name: patch.name,
          phone: patch.phone,
          avatar_url: patch.avatar,
        })
        .eq("id", c.authUser.id);
      await c.refresh();
    },
  };
}

export function useSavedEvents() {
  const c = useCtx();
  return {
    ids: c.savedIds,
    has: (id: string) => c.savedIds.includes(id),
    toggle: async (id: string) => {
      if (!c.authUser) return;
      if (c.savedIds.includes(id)) {
        await supabase.from("saved_events").delete().eq("user_id", c.authUser.id).eq("event_id", id);
      } else {
        await supabase.from("saved_events").insert({ user_id: c.authUser.id, event_id: id });
      }
      await c.refresh();
    },
    remove: async (id: string) => {
      if (!c.authUser) return;
      await supabase.from("saved_events").delete().eq("user_id", c.authUser.id).eq("event_id", id);
      await c.refresh();
    },
  };
}

export function useRegistrations() {
  const c = useCtx();
  return {
    list: c.registrations,
    add: async (r: Registration) => {
      if (!c.authUser) return;
      await supabase.from("registrations").insert({
        user_id: c.authUser.id,
        event_id: r.eventId,
        team_name: r.teamName,
        captain: r.captain,
        txn_id: r.txnId,
      });
      await supabase.from("notifications").insert({
        user_id: c.authUser.id,
        title: "Registration Confirmed",
        body: `Your registration for event is confirmed. Txn: ${r.txnId}`,
      });
      await c.refresh();
    },
  };
}

export function useOrganized() {
  const c = useCtx();
  return {
    list: c.organized,
    add: async (e: OrganizedEvent) => {
      if (!c.authUser) return;
      await supabase.from("events").insert({
        id: e.id,
        name: e.title,
        description: e.description,
        category: e.category,
        type: e.type,
        sport: e.category,
        organizer: c.profile?.name ?? "Organizer",
        prize_pool: e.prizePool,
        venue: e.venue,
        city: e.venue,
        date: e.date,
        entry_fee: e.entryFee,
        slots: `${e.teamLimit} teams`,
        rules: e.rules.split("\n").map((s) => s.trim()).filter(Boolean),
        status: e.status,
        created_by: c.authUser.id,
      });
      await c.refresh();
    },
    update: async (id: string, patch: Partial<OrganizedEvent>) => {
      await supabase
        .from("events")
        .update({
          name: patch.title,
          description: patch.description,
          status: patch.status,
          venue: patch.venue,
          date: patch.date,
          entry_fee: patch.entryFee,
          prize_pool: patch.prizePool,
        })
        .eq("id", id);
      await c.refresh();
    },
    remove: async (id: string) => {
      await supabase.from("events").delete().eq("id", id);
      await c.refresh();
    },
  };
}
