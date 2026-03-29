import { useGetRealitySimulator } from "@workspace/api-client-react";
import { getAuthOptions } from "@/lib/auth";
import { Layout } from "@/components/layout";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, MapPin, Target, Zap, AlertTriangle, Coffee } from "lucide-react";
import { format } from "date-fns";

export default function RealitySimulatorPage() {
  const [, params] = useRoute("/reality-simulator/:id");
  const { data, isLoading } = useGetRealitySimulator(params?.id || "", {
    ...getAuthOptions(),
    query: { enabled: !!params?.id }
  });

  return (
    <Layout>
      <div className="mb-8">
        <Link href="/career" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-semibold text-sm transition-colors mb-4">
          <ArrowLeft size={16} /> Back to Careers
        </Link>
        {isLoading ? (
          <div className="h-10 bg-slate-200 rounded w-1/3 animate-pulse"></div>
        ) : (
          <h1 className="text-3xl font-display font-bold text-slate-900">
            Reality Check: {data?.careerTitle}
          </h1>
        )}
      </div>

      {!isLoading && data && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[2rem] p-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Clock className="text-primary" /> A Typical Day
              </h2>
              <div className="p-5 bg-blue-50/50 rounded-2xl text-slate-700 leading-relaxed italic mb-8 border border-blue-100">
                "{data.typicalDay}"
              </div>

              <h3 className="font-bold text-slate-800 mb-4 uppercase tracking-wider text-sm">Daily Tasks Breakdown</h3>
              <ul className="space-y-4">
                {data.dailyTasks.map((task, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="mt-1 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-slate-600 font-medium">{task}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-[2rem] p-8 bg-gradient-to-br from-rose-50/50 to-white border-rose-100/50">
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <AlertTriangle className="text-rose-500" /> Hard Truths & Challenges
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {data.challenges.map((challenge, i) => (
                  <div key={i} className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                    <p className="text-slate-600 font-medium text-sm">{challenge}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-[2rem] p-6">
              <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider flex items-center gap-2"><MapPin size={16}/> Environment</h3>
              <p className="text-slate-600 font-medium">{data.workEnvironment}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-[2rem] p-6">
              <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider flex items-center gap-2"><Zap size={16}/> Effort Level</h3>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-display font-bold text-primary">{data.effortLevel}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-[2rem] p-6">
              <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider flex items-center gap-2"><Coffee size={16}/> Burnout Risk</h3>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 text-orange-700 font-bold">
                {data.burnoutRisk}
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-[2rem] p-6 bg-slate-900 text-white">
              <h3 className="font-bold text-white mb-2 text-sm uppercase tracking-wider">Salary Journey</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{data.salaryJourney}</p>
            </motion.div>
          </div>
        </div>
      )}
    </Layout>
  );
}
