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
      <div className="glass-strong rounded-3xl p-6 text-center">
        <div className="size-20 mx-auto rounded-3xl bg-gradient-primary grid place-items-center text-3xl font-bold text-primary-foreground shadow-glow">
          {(user?.name?.[0] ?? "J").toUpperCase()}
        </div>
        {editing ? (
          <div className="mt-4 grid gap-2 text-left">
            <input className="h-11 px-3 rounded-xl glass text-sm" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
            <input className="h-11 px-3 rounded-xl glass text-sm" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
            <div className="flex gap-2 justify-center mt-2">
              <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-xl glass text-sm">Cancel</button>
              <button
                onClick={() => { update({ name, phone }); setEditing(false); toast.success("Profile updated"); }}
                className="px-4 py-2 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm"
              >Save</button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="font-display font-bold text-xl mt-3">{user?.name ?? "Guest"}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <p className="text-xs text-muted-foreground">{user?.phone}</p>
            <button onClick={() => setEditing(true)} className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl glass text-sm font-semibold">
              <Pencil className="size-4" /> Edit Profile
            </button>
          </>
        )}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Stat label="Joined" value={reg.list.length} />
        <Stat label="Organized" value={org.list.length} />
        <Stat label="Saved" value={saved.ids.length} />
      </div>

      <div className="mt-5 glass-strong rounded-3xl divide-y divide-border">
        <Link to="/my-events" className="flex items-center justify-between p-4 text-sm">My Events <span className="text-muted-foreground">›</span></Link>
        <Link to="/organize" className="flex items-center justify-between p-4 text-sm">Organize Event <span className="text-muted-foreground">›</span></Link>
        <Link to="/saved" className="flex items-center justify-between p-4 text-sm">Saved Events <span className="text-muted-foreground">›</span></Link>
        <Link to="/invite" className="flex items-center justify-between p-4 text-sm">Invite Friends <span className="text-muted-foreground">›</span></Link>
        <button onClick={() => toast.message("Coming soon")} className="w-full flex items-center justify-between p-4 text-sm text-left">
          <span className="inline-flex items-center gap-2"><Lock className="size-4" /> Change Password</span>
          <span className="text-muted-foreground">›</span>
        </button>
      </div>

      <button
        onClick={() => { logout(); toast.success("Logged out"); navigate({ to: "/login" }); }}
        className="mt-5 w-full py-3 rounded-2xl bg-destructive/10 text-destructive font-semibold inline-flex items-center justify-center gap-2"
      >
        <LogOut className="size-4" /> Logout
      </button>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="glass-strong rounded-2xl p-4 text-center">
      <p className="text-2xl font-bold text-gradient-gold">{value}</p>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wider">{label}</p>
    </div>
  );
}
