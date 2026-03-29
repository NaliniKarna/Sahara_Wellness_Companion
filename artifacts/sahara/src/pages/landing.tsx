import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Target, Heart, Shield } from "lucide-react";
import { useGetProfile } from "@workspace/api-client-react";
import { getAuthOptions } from "@/lib/auth";
import { useEffect } from "react";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const { data: profile, isLoading } = useGetProfile({
    ...getAuthOptions(),
    query: { retry: false } // Don't retry if 404, just show landing page
  });

  useEffect(() => {
    // If they already completed onboarding, skip landing page
    if (!isLoading && profile?.onboardingComplete) {
      setLocation("/dashboard");
    }
  }, [profile, isLoading, setLocation]);

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-background overflow-hidden relative selection:bg-primary/20">
      <div className="absolute inset-0 z-0">
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
          alt="Calm abstract gradient background" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white font-bold font-display shadow-lg shadow-primary/20">
            S
          </div>
          <span className="font-display font-bold text-2xl text-slate-800 tracking-tight">Sahara</span>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/onboarding" className="px-6 py-2.5 rounded-full font-semibold bg-white text-primary border border-primary/20 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            Sign In
          </Link>
          <Link href="/onboarding" className="px-6 py-2.5 rounded-full font-semibold bg-gradient-to-r from-primary to-indigo-500 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300">
            Start Journey
          </Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 lg:pt-32 pb-24 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-primary font-medium text-sm mb-8">
            <Sparkles size={16} />
            Your AI Career & Wellness Companion
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-slate-900 mb-6">
            From confusion to clarity — <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-500">your career, your path.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed font-medium">
            Discover careers that fit your true self. Balance your mental health, track your skills, and conquer procrastination with your personal AI mentor.
          </p>
          <Link href="/onboarding" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-primary to-indigo-500 text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300">
            Begin Your Journey <ArrowRight size={20} />
          </Link>
          
          <div className="mt-12 flex items-center gap-8 text-slate-500 font-medium text-sm">
            <div className="flex items-center gap-2"><Target size={18} className="text-indigo-400" /> Career GPS</div>
            <div className="flex items-center gap-2"><Heart size={18} className="text-rose-400" /> Wellness Tracker</div>
            <div className="flex items-center gap-2"><Shield size={18} className="text-teal-400" /> AI Mentor</div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative lg:h-[600px] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-indigo-500/10 rounded-full blur-3xl" />
          <img 
            src={`${import.meta.env.BASE_URL}images/meditation.png`} 
            alt="Person meditating surrounded by career paths"
            className="w-full h-auto object-contain relative z-10 transform -translate-y-4 drop-shadow-2xl drop-shadow-primary/20"
          />
          
          {/* Floating UI Elements */}
          <motion.div 
            animate={{ y: [0, -15, 0] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute top-10 left-0 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white z-20 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Target size={20}/></div>
            <div>
              <div className="text-sm font-bold text-slate-800">Skill Match</div>
              <div className="text-xs text-slate-500">UX Designer • 92%</div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 15, 0] }} 
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-20 right-0 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white z-20 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-500"><Heart size={20}/></div>
            <div>
              <div className="text-sm font-bold text-slate-800">Stress Levels</div>
              <div className="text-xs text-slate-500">Perfectly balanced</div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
