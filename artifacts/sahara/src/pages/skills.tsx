import { useGetSkillGaps } from "@workspace/api-client-react";
import { getAuthOptions } from "@/lib/auth";
import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { Target, Flag, AlertCircle, BookOpen } from "lucide-react";

export default function SkillsPage() {
  const { data, isLoading } = useGetSkillGaps(getAuthOptions());

  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3">
          <Target className="text-primary" /> Skill GPS
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Track your progress towards becoming a {data?.targetCareer || "professional"}.</p>
      </div>

      {isLoading || !data ? (
        <div className="animate-pulse space-y-8">
          <div className="h-32 bg-slate-200 rounded-3xl"></div>
          <div className="grid md:grid-cols-2 gap-6"><div className="h-48 bg-slate-200 rounded-3xl"></div></div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="glass-card rounded-[2rem] p-8">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-2">OVERALL PROGRESS</h3>
                <div className="text-4xl font-display font-bold text-slate-800">{data.overallProgress}%</div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-500">Target Role</p>
                <p className="text-lg font-bold text-primary">{data.targetCareer}</p>
              </div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div className="bg-gradient-to-r from-primary to-indigo-500 h-3 rounded-full transition-all duration-1000" style={{ width: `${data.overallProgress}%` }}></div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold font-display text-slate-800">Current Skills</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {data.skills.map((skill, i) => (
                  <motion.div key={skill.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i*0.1 }} className="glass-card p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-bold text-slate-800">{skill.name}</h4>
                      <span className="text-xs font-bold px-2 py-1 bg-slate-100 rounded-lg text-slate-500">{skill.category}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-2 text-sm font-semibold">
                      <span className="text-primary">{skill.currentLevel}</span>
                      <span className="text-slate-300">/</span>
                      <span className="text-slate-500">{skill.targetLevel}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${(skill.currentLevel / skill.targetLevel) * 100}%` }}></div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <h2 className="text-xl font-bold font-display text-slate-800 pt-4">Missing Skills to Learn</h2>
              <div className="flex flex-wrap gap-3">
                {data.missingSkills.map(skill => (
                  <div key={skill} className="px-4 py-2.5 rounded-xl border-2 border-dashed border-rose-200 bg-rose-50/50 text-rose-700 font-semibold text-sm flex items-center gap-2">
                    <AlertCircle size={16} /> {skill}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl font-bold font-display text-slate-800">Milestones</h2>
              <div className="glass-card p-6 rounded-[2rem] space-y-6">
                {data.milestones.map((m, i) => (
                  <div key={m.id} className="relative flex gap-4">
                    {i !== data.milestones.length - 1 && (
                      <div className="absolute top-8 left-4 w-0.5 h-full bg-slate-100"></div>
                    )}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${m.completed ? 'bg-green-500 text-white shadow-md shadow-green-500/20' : 'bg-slate-100 text-slate-400 border-2 border-white'}`}>
                      <Flag size={14} />
                    </div>
                    <div>
                      <h4 className={`font-bold ${m.completed ? 'text-slate-800' : 'text-slate-600'}`}>{m.title}</h4>
                      <p className="text-sm text-slate-500 mt-1 font-medium">{m.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
