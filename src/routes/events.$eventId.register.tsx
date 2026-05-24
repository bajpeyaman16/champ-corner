import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { toPng } from "html-to-image";
import { useRegistrations, useAllEvents } from "@/lib/app-store";
import { createOrder, verifyPayment, getRazorpayKey } from "@/lib/payment.functions";
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

// "₹500" / "Rs 1,200" / "Free" / "₹0" → rupees number
function parseFeeRupees(fee: string | undefined | null): number {
  if (!fee) return 0;
  if (/free/i.test(fee)) return 0;
  const n = Number(String(fee).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? Math.round(n) : 0;
}

declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => { open: () => void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function Register() {
  const { eventId } = Route.useParams();
  const { list: allEvents } = useAllEvents();
  const e = allEvents.find((t) => t.id === eventId);
  const [step, setStep] = useState<Step>("form");
  const [data, setData] = useState<FormData | null>(null);
  const [txn, setTxn] = useState<string>("");
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [paying, setPaying] = useState(false);
  const reg = useRegistrations();
  const navigate = useNavigate();
  const receiptRef = useRef<HTMLDivElement>(null);

  const createOrderFn = useServerFn(createOrder);
  const verifyPaymentFn = useServerFn(verifyPayment);
  const getKeyFn = useServerFn(getRazorpayKey);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { city: e?.city ?? "", state: "MP", members: 6 },
  });

  if (!e) return <div className="p-6 text-sm text-muted-foreground">Loading event…</div>;

  const feeRupees = parseFeeRupees(e.entryFee);
  const isFree = feeRupees === 0;

  const onSubmit = (values: FormData) => {
    setData(values);
    setStep("pay");
  };

  const completeRegistration = async (txnId: string, amountRupees: number) => {
    setTxn(txnId);
    setPaidAmount(amountRupees);
    await reg.add({
      eventId: e.id,
      teamName: data!.teamName,
      captain: data!.captain,
      paidAt: new Date().toISOString(),
      txnId,
    });
    setStep("done");
  };

  const pay = async () => {
    if (!data) return;
    setPaying(true);
    try {
      if (isFree) {
        await completeRegistration("FREE-" + Date.now().toString(36).toUpperCase(), 0);
        toast.success("Registration confirmed (free event)");
        return;
      }

      const ok = await loadRazorpayScript();
      if (!ok || !window.Razorpay) throw new Error("Razorpay SDK failed to load");

      const { keyId } = await getKeyFn();
      const { orderId, amount } = await createOrderFn({
        data: { amount: feeRupees * 100, eventId: e.id },
      });

      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency: "INR",
        order_id: orderId,
        name: "Eventra",
        description: e.name,
        prefill: { name: data.captain, email: data.email, contact: data.mobile },
        theme: { color: "#6366f1" },
        handler: async (resp: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            await verifyPaymentFn({
              data: {
                orderId: resp.razorpay_order_id,
                paymentId: resp.razorpay_payment_id,
                signature: resp.razorpay_signature,
              },
            });
            await completeRegistration(resp.razorpay_payment_id, feeRupees);
            toast.success("Payment successful");
          } catch (err) {
            console.error(err);
            toast.error("Payment verification failed");
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaying(false);
            toast.info("Payment cancelled");
          },
        },
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Payment failed");
      setPaying(false);
    }
  };

  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    try {
      const dataUrl = await toPng(receiptRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#0b0b14",
      });
      const link = document.createElement("a");
      link.download = `eventra-receipt-${txn}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Receipt downloaded");
    } catch {
      toast.error("Could not generate receipt");
    }
  };

  const stepLabel = step === "done" ? "All set" : step === "pay" ? "Step 2 of 2" : "Step 1 of 2";
  const stepTitle = step === "done" ? "Registration Complete" : step === "pay" ? "Payment" : "Team Registration";

  return (
    <div className="min-h-screen pb-12">
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
        {step === "form" && (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="glass-strong rounded-3xl p-4 sm:p-5">
              <h2 className="font-display font-bold text-sm sm:text-base">{e.name}</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {e.venue}, {e.city} · {e.date}
              </p>
            </div>

            <div className="glass-strong rounded-3xl p-4 sm:p-5 grid gap-4">
              <Field label="Team Name" error={form.formState.errors.teamName?.message}>
                <input {...form.register("teamName")} className={inputCls} placeholder="The Strikers" />
              </Field>
              <Field label="Captain Name" error={form.formState.errors.captain?.message}>
                <input {...form.register("captain")} className={inputCls} placeholder="Full name" />
              </Field>

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
              {isFree ? "Continue · Free" : `Continue to Payment · ₹${feeRupees}`}
            </button>
          </form>
        )}

        {step === "pay" && (
          <div className="space-y-4">
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
                  <span className="font-bold text-gradient-gold">{isFree ? "Free" : `₹${feeRupees}`}</span>
                </div>
              </div>
            </div>

            {!isFree && (
              <div className="glass-strong rounded-3xl p-4 sm:p-5">
                <h2 className="font-display font-bold">Pay with Razorpay</h2>
                <div className="mt-3 flex items-center gap-3 p-3 rounded-2xl glass">
                  <CreditCard className="size-4 text-primary shrink-0" />
                  <span className="text-sm font-medium">UPI · Cards · NetBanking · Wallets</span>
                </div>
                <p className="mt-3 text-[11px] text-muted-foreground">
                  Secure checkout. Test card: 4111 1111 1111 1111, any future date, any CVV.
                </p>
              </div>
            )}

            <button
              onClick={pay}
              disabled={paying}
              className="w-full py-4 rounded-3xl bg-gradient-primary text-primary-foreground font-bold shadow-glow disabled:opacity-60 text-sm sm:text-base"
            >
              {paying ? "Processing..." : isFree ? "Confirm Registration" : `Pay ₹${feeRupees}`}
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="space-y-4">
            <div ref={receiptRef} className="glass-strong rounded-3xl p-6 sm:p-8 text-center">
              <div className="size-16 rounded-full bg-gradient-primary mx-auto grid place-items-center shadow-glow">
                <CheckCircle2 className="size-8 text-primary-foreground" />
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold mt-4">Registration Successful</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Confirmation sent to {data?.email}
              </p>
              <div className="mt-5 grid gap-2 text-left">
                <Row label="Event" value={e.name} />
                <Row label="Team" value={data?.teamName ?? "—"} />
                <Row label="Captain" value={data?.captain ?? "—"} />
                <Row label="Members" value={String(data?.members ?? "—")} />
                <Row label="Venue" value={`${e.venue}, ${e.city}`} />
                <Row label="Date" value={e.date} />
                <Row label="Amount Paid" value={paidAmount > 0 ? `₹${paidAmount}` : "Free"} />
                <Row label="Transaction ID" value={txn} mono />
                <Row label="Issued" value={new Date().toLocaleString()} />
              </div>
            </div>

            <button
              onClick={downloadReceipt}
              className="w-full inline-flex justify-center items-center gap-2 py-3 rounded-2xl glass text-sm font-semibold"
            >
              <Download className="size-4" /> Download Receipt (PNG)
            </button>

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

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <span className="text-xs text-destructive mt-1 block">{error}</span>}
    </label>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between text-sm gap-3">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={`font-semibold text-right ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}
