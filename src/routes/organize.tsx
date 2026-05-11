import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { useOrganized, type OrganizedEvent } from "@/lib/app-store";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/organize")({
  component: Organize,
  head: () => ({ meta: [{ title: "Organize Event — Eventra" }] }),
});

const blank: Omit<OrganizedEvent, "id" | "status" | "createdAt"> = {
  title: "",
  description: "",
  category: "Cricket",
  type: "Outdoor",
  prizePool: "",
  venue: "",
  date: "",
  entryFee: "",
  teamLimit: 8,
  rules: "",
};

function Organize() {
  const { list, add, remove } = useOrganized();
  const [form, setForm] = useState(blank);

  const submit = (status: "draft" | "published") => {
    if (!form.title || !form.venue || !form.date) {
      toast.error("Title, venue and date are required");
      return;
    }
    const ev: OrganizedEvent = {
      ...form,
      id: "org_" + Date.now(),
      status,
      createdAt: new Date().toISOString(),
    };
    add(ev);
    setForm(blank);
    toast.success(status === "published" ? "Event published" : "Saved as draft");
  };

  return (
    <PageShell title="Organize Events">
      <div className="glass-strong rounded-3xl p-5 grid gap-3">
        <h2 className="font-display font-bold">Create Event</h2>
        <Field label="Event title">
          <input className={ic} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Indoor Premier League" />
        </Field>
        <Field label="Description">
          <textarea className={`${ic} min-h-24 py-2`} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <input className={ic} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </Field>
          <Field label="Type">
            <select className={ic} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "Indoor" | "Outdoor" })}>
              <option className="bg-background">Outdoor</option>
              <option className="bg-background">Indoor</option>
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Prize pool"><input className={ic} value={form.prizePool} onChange={(e) => setForm({ ...form, prizePool: e.target.value })} placeholder="₹ 1,00,000" /></Field>
          <Field label="Entry fee"><input className={ic} value={form.entryFee} onChange={(e) => setForm({ ...form, entryFee: e.target.value })} placeholder="₹ 500" /></Field>
        </div>
        <Field label="Venue"><input className={ic} value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date"><input type="date" className={ic} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
          <Field label="Team limit"><input type="number" className={ic} value={form.teamLimit} onChange={(e) => setForm({ ...form, teamLimit: Number(e.target.value) })} /></Field>
        </div>
        <Field label="Rules">
          <textarea className={`${ic} min-h-20 py-2`} value={form.rules} onChange={(e) => setForm({ ...form, rules: e.target.value })} />
        </Field>
        <div className="flex gap-2">
          <button onClick={() => submit("draft")} className="flex-1 py-3 rounded-2xl glass text-sm font-semibold">Save Draft</button>
          <button onClick={() => submit("published")} className="flex-1 py-3 rounded-2xl bg-gradient-primary text-primary-foreground font-bold shadow-glow">Publish</button>
        </div>
      </div>

      <h2 className="font-display font-bold mt-6 mb-3">Your Events ({list.length})</h2>
      <div className="space-y-2">
        {list.map((e) => (
          <div key={e.id} className="glass-strong rounded-2xl p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{e.title}</p>
              <p className="text-xs text-muted-foreground">{e.venue} · {e.date}</p>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
              e.status === "published" ? "bg-gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>{e.status}</span>
            <button onClick={() => remove(e.id)} className="size-9 rounded-xl glass grid place-items-center text-destructive">
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        {list.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">No events organized yet.</p>}
      </div>
    </PageShell>
  );
}

const ic = "w-full h-11 px-3 rounded-xl glass text-sm outline-none focus:ring-2 focus:ring-primary/50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
