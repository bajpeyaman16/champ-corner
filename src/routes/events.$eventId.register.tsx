import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { useRegistrations, useAllEvents } from "@/lib/app-store";
import { ArrowLeft, CheckCircle2, CreditCard, Download } from "lucide-react";
 
export const Route = createFileRoute("/events/$eventId/register")({
  component: Register,
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
  const { eventId } = Route.useParams();
  const { list: allEvents } = useAllEvents();
  const e = allEvents.find((t) => t.id === eventId);
  const [step, setStep] = useState<Step>("form");
  const [data, setData] = useState<FormData | null>(null);
  const [txn, setTxn] = useState<string>("");
  const [paying, setPaying] = useState(false);
  const reg = useRegistrations();
  const navigate = useNavigate();
 
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { city: e?.city ?? "", state: "MP", members: 6 },
  });

  if (!e) {
    return <div className="p-6 text-sm text-muted-foreground">Loading event…</div>;
  }
 
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
 
  const stepLabel = step === "done" ? "All set" : step === "pay" ? "Step 2 of 2" : "Step 1 of 2";
  const stepTitle = step === "done" ? "Registration Complete" : step === "pay" ? "Payment" : "Team Registration";
 
  return (
    <div className="min-h-screen pb-12">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 px-4 pt-4 pb-3 bg-background/70 backdrop-blur-xl border-b border-border">
        <div className="mx-auto max-w-2xl flex items-center gap-3">
          <Link
            to="/events/$eventId"
            params={{ eventId: e.id }}
            className="size-9 sm:size-10 rounded-full glass grid place-items-center shrink-0"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs text-muted-foreground">{stepLabel}</p>
            <h1 className="font-display font-bold text-sm sm:text-base truncate">{stepTitle}</h1>
          </div>
        </div>
      </header>
 
      <main className="mx-auto max-w-2xl px-4 py-4 sm:py-6">
 
        {/* ── STEP 1: FORM ── */}
        {step === "form" && (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Event summary */}
            <div className="glass-strong rounded-3xl p-4 sm:p-5">
              <h2 className="font-display font-bold text-sm sm:text-base">{e.name}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {e.venue}, {e.city} · {e.date}
              </p>
            </div>
 
            {/* Form fields */}
            <div className="glass-strong rounded-3xl p-4 sm:p-5 grid gap-4">
              <Field label="Team Name" error={form.formState.errors.teamName?.message}>
                <input {...form.register("teamName")} className={inputCls} placeholder="The Strikers" />
              </Field>
              <Field label="Captain Name" error={form.formState.errors.captain?.message}>
                <input {...form.register("captain")} className={inputCls} placeholder="Full name" />
              </Field>
 
              {/* Mobile / Email — stacked on mobile, side-by-side on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
 
              {/* City / State — side-by-side always (short fields) */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="City" error={form.formState.errors.city?.message}>
                  <input {...form.register("city")} className={inputCls} />
                </Field>
                <Field label="State" error={form.formState.errors.state?.message}>
                  <input {...form.register("state")} className={inputCls} />
                </Field>
              </div>
 
              <Field label="Team Members" error={form.formState.errors.members?.message}>
                <input
                  type="number"
                  {...form.register("members", { valueAsNumber: true })}
                  className={inputCls}
                  min={1}
                  max={20}
                />
              </Field>
            </div>
 
            <button
              type="submit"
              className="w-full py-4 rounded-3xl bg-gradient-primary text-primary-foreground font-bold shadow-glow text-sm sm:text-base"
            >
              Continue to Payment · {e.entryFee}
            </button>
          </form>
        )}
 
        {/* ── STEP 2: PAYMENT ── */}
        {step === "pay" && (
          <div className="space-y-4">
            {/* Order summary */}
            <div className="glass-strong rounded-3xl p-4 sm:p-5">
              <h2 className="font-display font-bold">Order Summary</h2>
              <div className="mt-3 text-sm grid gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Event</span>
                  <span className="font-semibold text-right ml-4 truncate max-w-[60%]">{e.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Team</span>
                  <span className="font-semibold text-right ml-4 truncate max-w-[60%]">{data?.teamName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Members</span>
                  <span className="font-semibold">{data?.members}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 mt-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-gradient-gold">{e.entryFee}</span>
                </div>
              </div>
            </div>
 
            {/* Payment methods */}
            <div className="glass-strong rounded-3xl p-4 sm:p-5">
              <h2 className="font-display font-bold">Pay with</h2>
              {/* 1-col on mobile, 2-col on sm+ */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {["UPI", "Card", "Net Banking", "Wallet"].map((m, i) => (
                  <label key={m} className="flex items-center gap-3 p-3 rounded-2xl glass cursor-pointer">
                    <input type="radio" name="method" defaultChecked={i === 0} className="accent-[var(--primary)]" />
                    <CreditCard className="size-4 text-primary shrink-0" />
                    <span className="text-sm font-medium">{m}</span>
                  </label>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-muted-foreground">Demo flow — no real money is charged.</p>
            </div>
 
            <button
              onClick={pay}
              disabled={paying}
              className="w-full py-4 rounded-3xl bg-gradient-primary text-primary-foreground font-bold shadow-glow disabled:opacity-60 text-sm sm:text-base"
            >
              {paying ? "Processing..." : `Pay ${e.entryFee}`}
            </button>
          </div>
        )}
 
        {/* ── STEP 3: SUCCESS ── */}
        {step === "done" && (
          <div className="space-y-4 text-center">
            <div className="glass-strong rounded-3xl p-6 sm:p-8">
              <div className="size-16 rounded-full bg-gradient-primary mx-auto grid place-items-center shadow-glow">
                <CheckCircle2 className="size-8 text-primary-foreground" />
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold mt-4">Registration Successful</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                A confirmation has been sent to {data?.email}.
              </p>
              <div className="mt-5 grid gap-2 text-left">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Event</span>
                  <span className="font-semibold text-right ml-4 max-w-[60%] truncate">{e.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Team</span>
                  <span className="font-semibold">{data?.teamName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono text-xs">{txn}</span>
                </div>
              </div>
              <button
                onClick={() => toast.success("Receipt downloaded")}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-sm font-semibold"
              >
                <Download className="size-4" /> Download Receipt
              </button>
            </div>
 
            {/* Action buttons — 2-col on sm+, stacked on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => navigate({ to: "/" })}
                className="py-4 rounded-3xl glass font-bold text-sm sm:text-base"
              >
                Back to Home
              </button>
              <button
                onClick={() => navigate({ to: "/my-events" })}
                className="py-4 rounded-3xl bg-gradient-primary text-primary-foreground font-bold shadow-glow text-sm sm:text-base"
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
 
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <span className="text-xs text-destructive mt-1 block">{error}</span>}
    </label>
  );
}