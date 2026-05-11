import { Link, useNavigate } from "@tanstack/react-router";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  User, ClipboardList, Calendar, PlusCircle, Bookmark, Bell, Share2, LogOut, ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/app-store";
import { toast } from "sonner";

const items = [
  { to: "/profile", label: "My Profile", icon: User },
  { to: "/my-events", label: "Registrations", icon: ClipboardList },
  { to: "/my-events", label: "My Events", icon: Calendar },
  { to: "/organize", label: "Organize Events", icon: PlusCircle },
  { to: "/saved", label: "Saved Events", icon: Bookmark },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/invite", label: "Invite Friends", icon: Share2 },
] as const;

export function AppDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[88%] max-w-sm border-r border-border bg-background/95 backdrop-blur-2xl p-0">
        <div className="p-6 bg-gradient-accent text-accent-foreground">
          <div className="flex items-center gap-3">
            <div className="size-14 rounded-2xl bg-white/20 backdrop-blur grid place-items-center text-xl font-bold">
              {(user?.name?.[0] ?? "J").toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-bold truncate">{user?.name ?? "Guest User"}</p>
              <p className="text-sm opacity-90 truncate">{user?.email ?? "guest@eventra.app"}</p>
              <p className="text-xs opacity-80 truncate">{user?.phone ?? "+91 ••••• •••••"}</p>
            </div>
          </div>
        </div>

        <div className="p-3">
          {items.map((it) => {
            const Icon = it.icon;
            return (
              <Link
                key={it.label}
                to={it.to}
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary transition group"
              >
                <span className="size-9 rounded-xl glass grid place-items-center text-primary">
                  <Icon className="size-4" />
                </span>
                <span className="flex-1 text-sm font-medium">{it.label}</span>
                <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition" />
              </Link>
            );
          })}

          <button
            onClick={() => {
              logout();
              onOpenChange(false);
              toast.success("Logged out");
              navigate({ to: "/login" });
            }}
            className="w-full mt-2 flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-destructive/10 text-destructive transition"
          >
            <span className="size-9 rounded-xl bg-destructive/10 grid place-items-center">
              <LogOut className="size-4" />
            </span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
