import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { useAuth, useOrganized } from "@/lib/app-store";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Calendar, MapPin, Trophy, Trash2, ImagePlus, X } from "lucide-react";

export const Route = createFileRoute("/organize")({
  component: Organize,
  head: () => ({ meta: [{ title: "Organize Event — Eventra" }] }),
});

function Organize() {
  const { isAuthenticated, loading } = useAuth();
  const org = useOrganized();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate({ to: "/login" });
  }, [loading, isAuthenticated, navigate]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Cricket");
  const [type, setType] = useState<"Indoor" | "Outdoor">("Outdoor");
  const [prizePool, setPrizePool] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [teamLimit, setTeamLimit] = useState(8);
  const [rules, setRules] = useState("");
  const [busy, setBusy] = useState(false);
  const [bannerUrl, setBannerUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadBanner = async (file: File) => {
    const { data: sess } = await supabase.auth.getSession();
    const uid = sess.session?.user.id;
    if (!uid) return toast.error("Please sign in again");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5MB");
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${uid}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("event-banners").upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("event-banners").getPublicUrl(path);
      setBannerUrl(data.publicUrl);
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !venue || !date) return toast.error("Title, venue and date required");
    setBusy(true);
    try {
      await org.add({
        id: crypto.randomUUID(),
        title,
        description,
        category,
        type,
        prizePool,
        venue,
        date,
        entryFee,
        teamLimit,
        rules,
        status: "published",
        createdAt: new Date().toISOString(),
        banner: bannerUrl || undefined,
      });
      toast.success("Event published — all users can now see it");
      setTitle(""); setDescription(""); setPrizePool(""); setVenue(""); setDate(""); setEntryFee(""); setRules(""); setBannerUrl("");
    } catch (err: any) {
      toast.error(err.message ?? "Failed to publish");
    } finally {
      setBusy(false);
    }
  };

  return (
    <PageShell title="Organize Event">
      <form onSubmit={submit} className="glass-strong rounded-3xl p-4 sm:p-6 grid gap-3 max-w-2xl mx-auto">
        <input className={ic} placeholder="Event title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea className={ic + " h-24 py-2"} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <select className={ic} value={category} onChange={(e) => setCategory(e.target.value)}>
            {["Cricket","Football","Hockey","Athletics","Badminton","Chess","Snooker","Table Tennis","Kabaddi","Boxing"].map(c => <option key={c}>{c}</option>)}
          </select>
          <select className={ic} value={type} onChange={(e) => setType(e.target.value as "Indoor" | "Outdoor")}>
            <option>Outdoor</option>
            <option>Indoor</option>
          </select>
        </div>
        <input className={ic} placeholder="Venue" value={venue} onChange={(e) => setVenue(e.target.value)} />
        <input className={ic} placeholder="Date (e.g. 20 Aug 2025 · 10:00 AM)" value={date} onChange={(e) => setDate(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <input className={ic} placeholder="Prize pool (₹)" value={prizePool} onChange={(e) => setPrizePool(e.target.value)} />
          <input className={ic} placeholder="Entry fee (₹)" value={entryFee} onChange={(e) => setEntryFee(e.target.value)} />
        </div>
        <input className={ic} type="number" min={2} max={64} placeholder="Team limit" value={teamLimit} onChange={(e) => setTeamLimit(+e.target.value)} />
        <textarea className={ic + " h-24 py-2"} placeholder="Rules (one per line)" value={rules} onChange={(e) => setRules(e.target.value)} />
        <button disabled={busy} className="py-3 rounded-2xl bg-gradient-primary text-primary-foreground font-bold shadow-glow disabled:opacity-60">
          {busy ? "Publishing…" : "Publish Event"}
        </button>
      </form>

      <h2 className="font-display font-bold mt-8 mb-3">Your Events ({org.list.length})</h2>
      {org.list.length === 0 ? (
        <p className="text-sm text-muted-foreground">You haven't organized any events yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {org.list.map((e) => (
            <div key={e.id} className="glass-strong rounded-2xl p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display font-bold text-sm">{e.title}</h3>
                <button onClick={() => org.remove(e.id)} className="text-destructive">
                  <Trash2 className="size-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{e.description}</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Calendar className="size-3" />{e.date}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{e.venue}</span>
                <span className="inline-flex items-center gap-1"><Trophy className="size-3" />{e.prizePool}</span>
                <span className="text-right">{e.entryFee}</span>
              </div>
              <Link to="/events/$eventId" params={{ eventId: e.id }} className="mt-3 inline-block text-xs text-primary font-semibold">View →</Link>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}

const ic =
  "w-full h-11 px-3 rounded-xl glass text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground";
