import { Link, useRouterState } from "@tanstack/react-router";
import { useAuth, useRegistrations, useSavedEvents } from "@/lib/app-store";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Home,
  Compass,
  Dumbbell,
  CalendarCheck,
  Bookmark,
  PlusCircle,
  Bell,
  Gift,
  User,
  LogOut,
  MapPin,
  Search,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { useState, ReactNode } from "react";
 
// ─── Nav items ───────────────────────────────────────────────────────────────
const NAV = [
  { label: "Home",          to: "/",              icon: Home },
  { label: "Explore",       to: "/explore",       icon: Compass },
  { label: "Sports",        to: "/sports",        icon: Dumbbell },
  { label: "My Events",     to: "/my-events",     icon: CalendarCheck },
  { label: "Saved",         to: "/saved",         icon: Bookmark },
];
 
const NAV2 = [
  { label: "Organize",      to: "/organize",      icon: PlusCircle },
  { label: "Notifications", to: "/notifications", icon: Bell },
  { label: "Invite",        to: "/invite",        icon: Gift },
  { label: "Profile",       to: "/profile",       icon: User },
];
 
// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
 
  const isActive = (to: string) =>
    to === "/" ? currentPath === "/" : currentPath.startsWith(to);
 
  const NavLink = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <Link
      to={to as "/"}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative
        ${isActive(to)
          ? "bg-gradient-to-r from-orange-500/20 to-amber-500/10 text-orange-400 border border-orange-500/20"
          : "text-zinc-400 hover:bg-white/5 hover:text-white"}
        ${collapsed ? "justify-center px-2" : ""}
      `}
      title={collapsed ? label : undefined}
    >
      <Icon className={`shrink-0 ${isActive(to) ? "text-orange-400" : "text-zinc-500 group-hover:text-white"} transition-colors`} size={18} />
      {!collapsed && <span className="text-sm font-medium truncate">{label}</span>}
      {!collapsed && isActive(to) && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400" />
      )}
    </Link>
  );
 
  return (
    <aside
      className={`
        flex flex-col h-screen border-r border-zinc-800/60 bg-zinc-950
        transition-all duration-200 shrink-0
        ${collapsed ? "w-[60px]" : "w-[220px]"}
      `}
    >
      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-4 h-16 border-b border-zinc-800/60 shrink-0 ${collapsed ? "justify-center px-2" : ""}`}>
        {!collapsed && (
          <span className="font-black text-xl tracking-tight bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent select-none">
            EVENTRA
          </span>
        )}
        {collapsed && (
          <span className="font-black text-lg bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">E</span>
        )}
        <button
          onClick={onToggle}
          className={`ml-auto p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition ${collapsed ? "ml-0" : ""}`}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={15} /> : <Menu size={15} />}
        </button>
      </div>
 
      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-0.5">
        {!collapsed && (
          <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold px-2 mb-2">
            Discover
          </p>
        )}
        {NAV.map((n) => <NavLink key={n.to} {...n} />)}
 
        <div className={`my-3 border-t border-zinc-800/60 ${collapsed ? "mx-1" : "mx-0"}`} />
 
        {!collapsed && (
          <p className="text-[10px] uppercase tracking-widest text-zinc-600 font-semibold px-2 mb-2">
            Manage
          </p>
        )}
        {NAV2.map((n) => <NavLink key={n.to} {...n} />)}
      </nav>
 
      {/* User footer */}
      <div className={`border-t border-zinc-800/60 p-3 shrink-0 ${collapsed ? "px-1.5" : ""}`}>
        {collapsed ? (
          <button
            onClick={() => { logout(); toast.success("Logged out"); navigate({ to: "/login" }); }}
            className="w-full flex justify-center p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-black font-bold text-sm shrink-0">
              {(user?.name?.[0] ?? "J").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name ?? "Guest"}</p>
              <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => { logout(); toast.success("Logged out"); navigate({ to: "/login" }); }}
              className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition shrink-0"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
 
// ─── Topbar ──────────────────────────────────────────────────────────────────
function Topbar({ title, greeting }: { title?: string; greeting?: string }) {
  const { list: regList } = useRegistrations();
  const { ids: savedIds } = useSavedEvents();
  const navigate = useNavigate();
 
  return (
    <header className="h-16 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl flex items-center gap-4 px-6 shrink-0 sticky top-0 z-10">
      <div className="flex-1">
        {greeting ? (
          <div>
            <p className="text-xs text-zinc-500">Welcome back</p>
            <h1 className="text-lg font-bold text-white leading-tight">Hey, {greeting} 👋</h1>
          </div>
        ) : (
          <h1 className="text-lg font-bold text-white">{title}</h1>
        )}
      </div>
 
      {/* Search */}
      <div className="relative hidden md:block w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={15} />
        <input
          placeholder="Search events, sports..."
          className="w-full h-9 pl-9 pr-4 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-orange-500/50 transition"
        />
      </div>
 
      {/* Location */}
      <div className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl">
        <MapPin size={13} className="text-cyan-400" />
        <span>Bhopal, MP</span>
      </div>
 
      {/* Notification bell */}
      <Link to="/notifications" className="relative p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition">
        <Bell size={16} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 border-2 border-zinc-950" />
      </Link>
 
      {/* Profile */}
      <Link to="/profile" className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-black font-bold text-sm">
        J
      </Link>
    </header>
  );
}
 
// ─── PageShell (main export used by all route components) ─────────────────────
export function PageShell({
  children,
  title,
  greeting,
}: {
  children: ReactNode;
  title?: string;
  greeting?: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
 
  return (
    <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
 
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar title={title} greeting={greeting} />
 
        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
 