import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/AppShell";
import { Copy, Gift, MessageCircle, Share2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/invite")({
  component: Invite,
  head: () => ({ meta: [{ title: "Invite Friends — Eventra" }] }),
});

const code = "EVENTRA-JON25";
const link = "https://eventra.app/r/" + code;

function Invite() {
  const copy = (s: string) => {
    navigator.clipboard?.writeText(s);
    toast.success("Copied to clipboard");
  };
  return (
    <PageShell title="Invite Friends">
      <div className="glass-strong rounded-3xl p-6 text-center bg-gradient-accent/30">
        <div className="size-16 mx-auto rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
          <Gift className="size-8 text-primary-foreground" />
        </div>
        <h2 className="font-display text-xl font-bold mt-3">Earn rewards by inviting</h2>
        <p className="text-sm text-muted-foreground mt-1">Get ₹100 credits for every friend who joins their first tournament.</p>
      </div>

      <div className="mt-5 glass-strong rounded-3xl p-4">
        <p className="text-xs text-muted-foreground">Your invite code</p>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-12 px-4 rounded-xl glass grid place-items-center font-mono font-bold tracking-wider">{code}</div>
          <button onClick={() => copy(code)} className="size-12 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground"><Copy className="size-4" /></button>
        </div>
      </div>

      <div className="mt-3 glass-strong rounded-3xl p-4">
        <p className="text-xs text-muted-foreground">Invite link</p>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-12 px-4 rounded-xl glass grid place-items-center text-xs truncate">{link}</div>
          <button onClick={() => copy(link)} className="size-12 rounded-xl glass grid place-items-center"><Copy className="size-4" /></button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`Join me on Eventra! ${link}`)}`}
          target="_blank" rel="noreferrer"
          className="py-4 rounded-2xl bg-emerald-500 text-white font-semibold inline-flex items-center justify-center gap-2"
        >
          <MessageCircle className="size-4" /> WhatsApp
        </a>
        <button
          onClick={() => {
            if (navigator.share) navigator.share({ title: "Eventra", text: "Join me on Eventra!", url: link }).catch(() => {});
            else copy(link);
          }}
          className="py-4 rounded-2xl bg-gradient-primary text-primary-foreground font-semibold inline-flex items-center justify-center gap-2"
        >
          <Share2 className="size-4" /> Share
        </button>
      </div>

      <div className="mt-6 glass-strong rounded-3xl p-5">
        <h3 className="font-display font-bold">Referral Rewards</h3>
        <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
          <li>• 1 friend joins → ₹100 credit</li>
          <li>• 5 friends join → ₹600 credit + Pro badge</li>
          <li>• 10 friends join → ₹1500 credit + free tournament entry</li>
        </ul>
      </div>
    </PageShell>
  );
}
