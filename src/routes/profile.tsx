import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { useAuth, useOrganized, useRegistrations, useSavedEvents } from "@/lib/app-store";
import { LogOut, Pencil, Lock } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
 
export const Route = createFileRoute("/profile")({
  component: Profile,
  head: () => ({ meta: [{ title: "My Profile — Eventra" }] }),
});
 
function Profile() {
  const { user, update, logout } = useAuth();
  const reg = useRegistrations();
  const org = useOrganized();
  const saved = useSavedEvents();
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
 
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
 
  return (
    <PageShell title="My Profile">
      {/* Profile card */}
      <div className="glass-strong rounded-3xl p-5 sm:p-8 text-center">
        {/* Avatar */}
        <div className="size-16 sm:size-20 mx-auto rounded-3xl bg-gradient-primary grid place-items-center text-2xl sm:text-3xl font-bold text-primary-foreground shadow-glow">
          {(user?.name?.[0] ?? "J").toUpperCase()}
        </div>
 
        {editing ? (
          /* Edit mode */
          <div className="mt-4 grid gap-2 text-left max-w-xs mx-auto">
            <input
              className="h-11 px-3 rounded-xl glass text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
            />
            <input
              className="h-11 px-3 rounded-xl glass text-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
            />
            <div className="flex gap-2 justify-center mt-2">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 px-4 py-2.5 rounded-xl glass text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  update({ name, phone });
                  setEditing(false);
                  toast.success("Profile updated");
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          /* View mode */
          <>
            <h2 className="font-display font-bold text-lg sm:text-xl mt-3">{user?.name ?? "Guest"}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            {user?.phone && <p className="text-xs text-muted-foreground mt-0.5">{user.phone}</p>}
            <button
              onClick={() => setEditing(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl glass text-sm font-semibold"
            >
              <Pencil className="size-4" /> Edit Profile
            </button>
          </>
        )}
      </div>
 
      {/* Stats — always 3-col */}
      <div className="mt-4 sm:mt-5 grid grid-cols-3 gap-2 sm:gap-3">
        <Stat label="Joined" value={reg.list.length} />
        <Stat label="Organized" value={org.list.length} />
        <Stat label="Saved" value={saved.ids.length} />
      </div>
 
      {/* Navigation links */}
      <div className="mt-4 sm:mt-5 glass-strong rounded-3xl divide-y divide-border overflow-hidden">
        {[
          { to: "/my-events", label: "My Events" },
          { to: "/organize", label: "Organize Event" },
          { to: "/saved", label: "Saved Events" },
          { to: "/invite", label: "Invite Friends" },
        ].map(({ to, label }) => (
          <Link
            key={to}
            to={to as "/"}
            className="flex items-center justify-between px-4 py-3.5 sm:py-4 text-sm hover:bg-white/5 transition"
          >
            <span>{label}</span>
            <span className="text-muted-foreground">›</span>
          </Link>
        ))}
        <button
          onClick={() => toast.message("Coming soon")}
          className="w-full flex items-center justify-between px-4 py-3.5 sm:py-4 text-sm text-left hover:bg-white/5 transition"
        >
          <span className="inline-flex items-center gap-2">
            <Lock className="size-4" /> Change Password
          </span>
          <span className="text-muted-foreground">›</span>
        </button>
      </div>
 
      {/* Logout */}
      <button
        onClick={() => {
          logout();
          toast.success("Logged out");
          navigate({ to: "/login" });
        }}
        className="mt-4 sm:mt-5 w-full py-3 sm:py-3.5 rounded-2xl bg-destructive/10 text-destructive font-semibold inline-flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <LogOut className="size-4" /> Logout
      </button>
    </PageShell>
  );
}
 
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass-strong rounded-2xl p-3 sm:p-4 text-center">
      <p className="text-xl sm:text-2xl font-bold text-gradient-gold">{value}</p>
      <p className="text-[10px] sm:text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}