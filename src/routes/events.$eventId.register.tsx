import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { TOURNAMENTS } from "@/lib/mock-data";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useRegistrations } from "@/lib/app-store";
import { ArrowLeft, CheckCircle2, CreditCard, Download } from "lucide-react";

export const Route = createFileRoute("/events/$eventId/register")({
  component: Register,
  loader: ({ params }) => {
    const e = TOURNAMENTS.find((t) => t.id === params.eventId);
    if (!e) throw notFound();
    return { event: e };
  },
  head: ({ params }) => ({ meta: [{ title: `Register — ${params.eventId}` }] }),
});

const schema = z.object({
  teamName: z.string().trim().min(2, "Team name required").max(60),
  captain: z.string().trim().min(2, "Captain name required").max(60),
  mobile: z.string().trim().regex(/^\+?\d[\d\s-]{7,14}$/, "Enter a valid mobile number"),
  email: z.string().trim().email("Invalid email").max(120),
  address: z.string().trim().min(3).max(200),
  city: z.string().trim().min(2).max(60),
  state: z.string().trim().min(2).max(60),
  members: z.number({ error: "Required" }).min(1).max(20),
});
type FormData = z.infer<typeof schema>;

type Step = "form" | "pay" | "done";

function Register() {
  const { event: e } = Route.useLoaderData();
  const [step, setStep] = useState<Step>("form");
  const [data, setData] = useState<FormData | null>(null);
  const [txn, setTxn] = useState<string>("");
  const [paying, setPaying] = useState(false);
  const reg = useRegistrations();
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { city: e.city, state: "MP", members: 6 },
  });

  const onSubmit = (values: FormData) => {
    setData(values);
    setStep("pay");
  };

  const pay = () => {
    setPaying(true);
    setTimeout(() => {
      const id = "TXN" + Math.random().toString(36).slice(2, 10).toUpperCase();
      setTxn(id);
      reg.add({
        eventId: e.id,
        teamName: data!.teamName,
        captain: data!.captain,
        paidAt: new Date().toISOString(),
        txnId: id,
      });
      setStep("done");
      setPaying(false);
      toast.success("Payment successful");
    }, 1400);
  };

  return (
    <div className="min-h-screen pb-12">
      <header className="sticky top-0 z-20 px-4 pt-4 pb-3 bg-background/70 backdrop-blur-xl border-b border-border">
        <div className="mx-auto max-w-2xl flex items-center gap-3">
          <Link to="/events/$eventId" params={{ eventId: e.id }} className="size-10 rounded-full glass grid place-items-center">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <p className="text-xs text-muted-foreground">{step === "done" ? "All set" : step === "pay" ? "Step 2 of 2" : "Step 1 of 2"}</p>
            <h1 className="font-display font-bold">
              {step === "done" ? "Registration Complete" : step === "pay" ? "Payment" : "Team Registration"}
            </h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {step === "form" && (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="glass-strong rounded-3xl p-5 space-y-4">
              <h2 className="font-display font-bold">{e.name}</h2>
              <p className="text-sm text-muted-foreground">{e.venue}, {e.city} · {e.date}</p>
            </div>
            <div className="glass-strong rounded-3xl p-5 grid gap-4">
              <Field label="Team Name" error={form.formState.errors.teamName?.message}>
                <input {...form.register("teamName")} className={inputCls} placeholder="The Strikers" />
              </Field>
              <Field label="Captain Name" error={form.formState.errors.captain?.message}>
                <input {...form.register("captain")} className={inputCls} placeholder="Full name" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Mobile" error={form.formState.errors.mobile?.message}>
                  <input {...form.register("mobile")} className={inputCls} placeholder="+91 ..." />
                </Field>
                <Field label="Email" error={form.formState.errors.email?.message}>
                  <input {...form.register("email")} className={inputCls} placeholder="you@team.in" />
                </Field>
              </div>
              <Field label="Address" error={form.formState.errors.address?.message}>
                <input {...form.register("address")} className={inputCls} placeholder="Street, area" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="City" error={form.formState.errors.city?.message}>
                  <input {...form.register("city")} className={inputCls} />
                </Field>
                <Field label="State" error={form.formState.errors.state?.message}>
                  <input {...form.register("state")} className={inputCls} />
                </Field>
              </div>
              <Field label="Team Members" error={form.formState.errors.members?.message}>
                <input type="number" {...form.register("members", { valueAsNumber: true })} className={inputCls} />
              </Field>
            </div>
            <button type="submit" className="w-full py-4 rounded-3xl bg-gradient-primary text-primary-foreground font-bold shadow-glow">
              Continue to Payment · {e.entryFee}
            </button>
          </form>
        )}

        {step === "pay" && (
          <div className="space-y-4">
            <div className="glass-strong rounded-3xl p-5">
              <h2 className="font-display font-bold">Order Summary</h2>
              <div className="mt-3 text-sm grid gap-2">
                <div className="flex justify-between"><span className="text-muted-foreground">Event</span><span className="font-semibold">{e.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Team</span><span className="font-semibold">{data?.teamName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Members</span><span className="font-semibold">{data?.members}</span></div>
                <div className="flex justify-between border-t border-border pt-2 mt-2"><span>Total</span><span className="font-bold text-gradient-gold">{e.entryFee}</span></div>
              </div>
            </div>
            <div className="glass-strong rounded-3xl p-5">
              <h2 className="font-display font-bold">Pay with</h2>
              <div className="mt-3 grid gap-2">
                {["UPI", "Card", "Net Banking", "Wallet"].map((m, i) => (
                  <label key={m} className="flex items-center gap-3 p-3 rounded-2xl glass cursor-pointer">
                    <input type="radio" name="method" defaultChecked={i === 0} className="accent-[var(--primary)]" />
                    <CreditCard className="size-4 text-primary" />
                    <span className="text-sm font-medium">{m}</span>
                  </label>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">Demo flow — no real money is charged.</p>
            </div>
            <button onClick={pay} disabled={paying} className="w-full py-4 rounded-3xl bg-gradient-primary text-primary-foreground font-bold shadow-glow disabled:opacity-60">
              {paying ? "Processing..." : `Pay ${e.entryFee}`}
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="space-y-4 text-center">
            <div className="glass-strong rounded-3xl p-8">
              <div className="size-16 rounded-full bg-gradient-primary mx-auto grid place-items-center shadow-glow">
                <CheckCircle2 className="size-8 text-primary-foreground" />
              </div>
              <h2 className="font-display text-2xl font-bold mt-4">Registration Successful</h2>
              <p className="text-sm text-muted-foreground mt-2">A confirmation has been sent to {data?.email}.</p>
              <div className="mt-5 grid gap-2 text-left">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Event</span><span className="font-semibold">{e.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Team</span><span className="font-semibold">{data?.teamName}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Transaction ID</span><span className="font-mono text-xs">{txn}</span></div>
              </div>
              <button
                onClick={() => toast.success("Receipt downloaded")}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm font-semibold"
              >
                <Download className="size-4" /> Download Receipt
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate({ to: "/" })}
                className="py-4 rounded-3xl glass font-bold"
              >
                Back to Home
              </button>
              <button
                onClick={() => navigate({ to: "/my-events" })}
                className="py-4 rounded-3xl bg-gradient-primary text-primary-foreground font-bold shadow-glow"
              >
                Go to My Events
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const inputCls =
  "w-full h-11 px-3 rounded-xl glass text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <span className="text-xs text-destructive mt-1 block">{error}</span>}
    </label>
  );
}
