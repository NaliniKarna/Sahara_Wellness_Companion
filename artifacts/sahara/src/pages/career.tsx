import { useGetCareerRecommendations } from "@workspace/api-client-react";
import { getAuthOptions } from "@/lib/auth";
import { Layout } from "@/components/layout";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, TrendingUp, Sparkles, AlertCircle } from "lucide-react";
import { cn } from "@/components/layout";

export default function CareerPage() {
  const { data, isLoading } = useGetCareerRecommendations(getAuthOptions());

  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3">
          <MapPin className="text-primary" /> Career Paths
        </h1>
        <p className="text-slate-500 mt-2 font-medium">AI-curated recommendations based on your skills, interests, and personality.</p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-6 animate-pulse">
          <div className="h-80 bg-slate-200 rounded-3xl"></div>
          <div className="h-80 bg-slate-200 rounded-3xl"></div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {data?.recommendations.map((rec, i) => (
            <motion.div 
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-[2rem] p-8 flex flex-col h-full border-t-4 border-t-primary"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold font-display text-slate-900">{rec.title}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg uppercase tracking-wide">
                      <TrendingUp size={14}/> {rec.marketDemand} Demand
                    </span>
                    <span className="text-sm font-semibold text-slate-500">{rec.salaryRange}</span>
                  </div>
                </div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/30">
                  {rec.matchScore}%
                </div>
              </div>

              <div className="mb-6 p-4 bg-slate-50 rounded-2xl">
                <p className="text-slate-700 text-sm leading-relaxed"><strong className="text-slate-900">Why it fits:</strong> {rec.whyItFits}</p>
              </div>

              <div className="mb-8 flex-1">
                <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2"><Sparkles size={16} className="text-amber-500"/> Key Skills Needed</h4>
                <div className="flex flex-wrap gap-2">
                  {rec.requiredSkills.map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold shadow-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-auto pt-6 border-t border-slate-100">
                <Link href={`/reality-simulator/${rec.id}`} className="flex-1 text-center py-3.5 rounded-xl font-semibold bg-slate-900 text-white shadow-md hover:bg-slate-800 hover:-translate-y-0.5 transition-all">
                  Reality Simulator
                </Link>
                <Link href={`/probability/${rec.id}`} className="flex-1 text-center py-3.5 rounded-xl font-semibold bg-white border-2 border-slate-200 text-slate-700 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2">
                  Check Odds <ArrowRight size={16}/>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Layout>
  );
}
