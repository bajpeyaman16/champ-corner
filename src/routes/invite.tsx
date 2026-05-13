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
      {/* Hero banner */}
      <div className="glass-strong rounded-3xl p-5 sm:p-8 text-center bg-gradient-accent/30">
        <div className="size-14 sm:size-16 mx-auto rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
          <Gift className="size-7 sm:size-8 text-primary-foreground" />
        </div>
        <h2 className="font-display text-lg sm:text-xl font-bold mt-3">Earn rewards by inviting</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
          Get ₹100 credits for every friend who joins their first tournament.
        </p>
      </div>
 
      {/* Invite code */}
      <div className="mt-4 sm:mt-5 glass-strong rounded-3xl p-4">
        <p className="text-xs text-muted-foreground">Your invite code</p>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-12 px-4 rounded-xl glass grid place-items-center font-mono font-bold tracking-wider text-sm sm:text-base overflow-hidden">
            <span className="truncate">{code}</span>
          </div>
          <button
            onClick={() => copy(code)}
            className="size-12 rounded-xl bg-gradient-primary grid place-items-center text-primary-foreground shrink-0"
            aria-label="Copy code"
          >
            <Copy className="size-4" />
          </button>
        </div>
      </div>
 
      {/* Invite link */}
      <div className="mt-3 glass-strong rounded-3xl p-4">
        <p className="text-xs text-muted-foreground">Invite link</p>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-12 px-4 rounded-xl glass grid place-items-center text-xs overflow-hidden">
            <span className="truncate w-full">{link}</span>
          </div>
          <button
            onClick={() => copy(link)}
            className="size-12 rounded-xl glass grid place-items-center shrink-0"
            aria-label="Copy link"
          >
            <Copy className="size-4" />
          </button>
        </div>
      </div>
 
      {/* Share buttons — stacked on mobile, side-by-side on sm+ */}
      <div className="mt-4 sm:mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href={`https://wa.me/?text=${encodeURIComponent(`Join me on Eventra! ${link}`)}`}
          target="_blank"
          rel="noreferrer"
          className="py-3.5 sm:py-4 rounded-2xl bg-emerald-500 text-white font-semibold inline-flex items-center justify-center gap-2 text-sm"
        >
          <MessageCircle className="size-4" /> Share on WhatsApp
        </a>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: "Eventra", text: "Join me on Eventra!", url: link }).catch(() => {});
            } else {
              copy(link);
            }
          }}
          className="py-3.5 sm:py-4 rounded-2xl bg-gradient-primary text-primary-foreground font-semibold inline-flex items-center justify-center gap-2 text-sm"
        >
          <Share2 className="size-4" /> Share Link
        </button>
      </div>
 
      {/* Rewards table */}
      <div className="mt-5 sm:mt-6 glass-strong rounded-3xl p-4 sm:p-5">
        <h3 className="font-display font-bold text-sm sm:text-base">Referral Rewards</h3>
        <div className="mt-3 space-y-2">
          {[
            { friends: "1 friend joins", reward: "₹100 credit" },
            { friends: "5 friends join", reward: "₹600 credit + Pro badge" },
            { friends: "10 friends join", reward: "₹1500 credit + free entry" },
          ].map(({ friends, reward }) => (
            <div key={friends} className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0">
              <span className="text-xs sm:text-sm text-muted-foreground">{friends}</span>
              <span className="text-xs sm:text-sm font-semibold text-gradient-gold">{reward}</span>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}