import { useGetJobMarket } from "@workspace/api-client-react";
import { getAuthOptions } from "@/lib/auth";
import { Layout } from "@/components/layout";
import { Briefcase, TrendingUp, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function JobsPage() {
  const { data, isLoading } = useGetJobMarket(getAuthOptions());

  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3">
          <Briefcase className="text-primary" /> Job Market Intel
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Real-time insights to future-proof your career decisions.</p>
      </div>

      {isLoading || !data ? (
        <div className="animate-pulse space-y-6">
          <div className="h-40 bg-slate-200 rounded-3xl"></div>
          <div className="h-96 bg-slate-200 rounded-3xl"></div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 rounded-[2rem] bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Globe className="text-blue-500"/> Key Market Insights</h3>
              <ul className="space-y-3">
                {data.insights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></span>
                    <span className="text-slate-700 font-medium text-sm leading-relaxed">{insight}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8 rounded-[2rem]">
              <h3 className="font-bold text-slate-800 mb-4">Top Growth Industries</h3>
              <div className="flex flex-wrap gap-2">
                {data.topIndustries.map(ind => (
                  <span key={ind} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl">
                    {ind}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          <div>
            <h2 className="text-xl font-bold font-display text-slate-800 mb-6">Trending Roles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {data.trending.map((role, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i*0.1 }} className="glass-card p-6 rounded-3xl hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-slate-800">{role.title}</h3>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg uppercase tracking-wide shrink-0">
                      <TrendingUp size={14}/> {role.growthRate}
                    </span>
                  </div>
                  <p className="text-slate-500 font-semibold mb-4 text-sm">Avg. Salary: <span className="text-slate-800">{role.avgSalary}</span></p>
                  
                  <div className="pt-4 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {role.topSkills.map(skill => (
                        <span key={skill} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-md text-xs font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
