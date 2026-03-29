import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Map, 
  Target, 
  CheckSquare, 
  MessageCircle, 
  Heart, 
  Briefcase, 
  Brain,
  Timer,
  Lightbulb,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { useGetProfile } from "@workspace/api-client-react";
import { getAuthOptions } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export { cn };

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/career", label: "Career Paths", icon: Map },
  { href: "/skills", label: "Skill GPS", icon: Target },
  { href: "/weekly-plan", label: "Weekly Plan", icon: CheckSquare },
  { href: "/chat", label: "AI Mentor", icon: MessageCircle },
  { href: "/wellness", label: "Wellness", icon: Heart },
  { href: "/jobs", label: "Job Market", icon: Briefcase },
  { href: "/focus", label: "Focus Coach", icon: Timer },
  { href: "/procrastination", label: "Anti-Procrastination", icon: Brain },
  { href: "/myths", label: "Reality Check", icon: Lightbulb },
  { href: "/mental-health", label: "Mental Health", icon: Sparkles },
];

function SidebarContent({ onClose, location, profile }: {
  onClose?: () => void;
  location: string;
  profile: any;
}) {
  const getWellnessEmoji = (score: number = 5) => {
    if (score >= 8) return "🌟";
    if (score >= 5) return "🌱";
    return "🔋";
  };

  return (
    <>
      <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white font-bold font-display shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            S
          </div>
          <span className="font-display font-bold text-xl text-slate-800 tracking-tight">Sahara</span>
        </Link>
        {onClose && (
          <button className="text-slate-500 p-1" onClick={onClose}>
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href || location.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group",
              isActive 
                ? "bg-primary/10 text-primary font-semibold shadow-sm" 
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium"
            )}>
              <item.icon size={20} className={cn(
                "transition-colors duration-200 shrink-0",
                isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
              )} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 m-4 mt-0 border border-slate-100 rounded-2xl bg-slate-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-lg shadow-inner shrink-0">
            {getWellnessEmoji(profile?.energyLevel)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {profile?.name || "Explorer"}
            </p>
            <p className="text-xs text-slate-500 truncate">{profile?.targetCareer || "Finding clarity..."}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  const { data: profile } = useGetProfile(getAuthOptions());

  return (
    <div className="min-h-screen bg-background font-sans" style={{ display: 'flex', overflow: 'hidden' }}>

      {/* ── Desktop sidebar (always visible on lg+) ── */}
      <aside
        style={{ width: 288, minWidth: 288, flexShrink: 0 }}
        className="hidden lg:flex flex-col h-screen sticky top-0 bg-white border-r border-slate-200 z-30 overflow-hidden"
      >
        <SidebarContent location={location} profile={profile} />
      </aside>

      {/* ── Mobile overlay backdrop ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/30 z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile sidebar (slides in) ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            key="mobile-sidebar"
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ type: "tween", duration: 0.25 }}
            style={{ width: 288 }}
            className="fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-slate-200 lg:hidden"
          >
            <SidebarContent
              onClose={() => setIsMobileOpen(false)}
              location={location}
              profile={profile}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/images/hero-bg.png')] bg-cover bg-center opacity-20 pointer-events-none" />

        {/* Mobile top bar */}
        <header className="h-16 flex items-center lg:hidden px-4 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shrink-0">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl bg-white shadow-sm border border-slate-200 text-slate-600"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1 text-center font-display font-bold text-lg text-slate-800 mr-10">
            Sahara
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 z-10">
          <div className="max-w-6xl mx-auto pb-24">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
