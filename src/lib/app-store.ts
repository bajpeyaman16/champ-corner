// Tiny client-side store using localStorage + custom events.
// Frontend-only mock for auth, saved events, registrations, organized events.

import { useEffect, useState } from "react";

type User = { name: string; email: string; phone?: string; avatar?: string } | null;

const KEYS = {
  user: "eventra:user",
  saved: "eventra:saved",
  registered: "eventra:registered",
  organized: "eventra:organized",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("eventra:store", { detail: { key } }));
}

function useStore<T>(key: string, fallback: T): [T, (v: T) => void] {
  const [val, setVal] = useState<T>(fallback);
  useEffect(() => {
    setVal(read<T>(key, fallback));
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail || detail.key === key) setVal(read<T>(key, fallback));
    };
    window.addEventListener("eventra:store", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("eventra:store", handler);
      window.removeEventListener("storage", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return [val, (v: T) => write(key, v)];
}

export function useAuth() {
  const [user, setUser] = useStore<User>(KEYS.user, null);
  return {
    user,
    isAuthenticated: !!user,
    login: (u: NonNullable<User>) => setUser(u),
    logout: () => setUser(null),
    update: (patch: Partial<NonNullable<User>>) =>
      setUser({ ...(user ?? { name: "", email: "" }), ...patch } as NonNullable<User>),
  };
}

export function useSavedEvents() {
  const [ids, setIds] = useStore<string[]>(KEYS.saved, []);
  return {
    ids,
    has: (id: string) => ids.includes(id),
    toggle: (id: string) =>
      setIds(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]),
    remove: (id: string) => setIds(ids.filter((x) => x !== id)),
  };
}

export type Registration = {
  eventId: string;
  teamName: string;
  captain: string;
  paidAt: string;
  txnId: string;
};

export function useRegistrations() {
  const [list, setList] = useStore<Registration[]>(KEYS.registered, []);
  return {
    list,
    add: (r: Registration) => setList([r, ...list]),
  };
}

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

export function useOrganized() {
  const [list, setList] = useStore<OrganizedEvent[]>(KEYS.organized, []);
  return {
    list,
    add: (e: OrganizedEvent) => setList([e, ...list]),
    update: (id: string, patch: Partial<OrganizedEvent>) =>
      setList(list.map((x) => (x.id === id ? { ...x, ...patch } : x))),
    remove: (id: string) => setList(list.filter((x) => x.id !== id)),
  };
}
