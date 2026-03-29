import { useGetDashboard, useCompleteTask } from "@workspace/api-client-react";
import { getAuthOptions } from "@/lib/auth";
import { Layout } from "@/components/layout";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Target, Flame, Heart, ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/components/layout";
import { useQueryClient } from "@tanstack/react-query";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetDashboard(getAuthOptions());
  const { mutate: toggleTask } = useCompleteTask({
    ...getAuthOptions(),
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] })
    }
  });

  if (isLoading || !data) {
    return (
      <Layout>
        <div className="space-y-8 animate-pulse">
          <div className="h-12 bg-slate-200 rounded-xl w-1/3"></div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="h-40 bg-slate-200 rounded-2xl"></div>
            <div className="h-40 bg-slate-200 rounded-2xl"></div>
            <div className="h-40 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      </Layout>
    );
  }

  const chartData = [
    { name: "Completed", value: data.careerProgress },
    { name: "Remaining", value: 100 - data.careerProgress }
  ];

  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold text-slate-900">
          Good morning, {data.profile?.name?.split(' ')[0] || "Explorer"}!
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Let's make progress on your {data.profile?.targetCareer || "career goals"} today.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {/* Progress Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <h3 className="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-1">CAREER PROGRESS</h3>
              <div className="text-3xl font-display font-bold text-slate-800">{data.careerProgress}%</div>
            </div>
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
              <Target size={24} />
            </div>
          </div>
          <div className="h-[100px] w-full absolute -bottom-6 -right-6 opacity-30 group-hover:scale-110 transition-transform duration-500">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" innerRadius={30} outerRadius={40} dataKey="value" startAngle={180} endAngle={0}>
                  <Cell fill="#3b82f6" />
                  <Cell fill="#e2e8f0" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Streak Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-3xl p-6 bg-gradient-to-br from-orange-50 to-rose-50 border-orange-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-orange-600/80 font-semibold text-sm uppercase tracking-wider mb-1">STREAK</h3>
              <div className="text-3xl font-display font-bold text-orange-600">{data.streakDays} Days</div>
            </div>
            <div className="w-12 h-12 bg-white/60 text-orange-500 rounded-2xl flex items-center justify-center shadow-sm">
              <Flame size={24} />
            </div>
          </div>
          <p className="text-orange-600/80 text-sm font-medium mt-6">You're on fire! Keep it up.</p>
        </motion.div>

        {/* Wellness Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-3xl p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-slate-500 font-semibold text-sm uppercase tracking-wider mb-1">WELLNESS SCORE</h3>
              <div className="text-3xl font-display font-bold text-slate-800">{data.wellness?.moodScore || 0}/10</div>
            </div>
            <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
              <Heart size={24} />
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-6">
            <div className="bg-gradient-to-r from-rose-400 to-rose-500 h-2 rounded-full" style={{ width: `${(data.wellness?.moodScore || 0) * 10}%` }}></div>
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-slate-800">Your Action Plan</h2>
            <Link href="/weekly-plan" className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="glass-card rounded-3xl p-2">
            {data.upcomingTasks?.length > 0 ? data.upcomingTasks.map(task => (
              <div key={task.id} className={cn(
                "flex items-start gap-4 p-4 rounded-2xl transition-all",
                task.completed ? "bg-slate-50/50" : "hover:bg-slate-50"
              )}>
                <button onClick={() => toggleTask({ taskId: task.id })} className={cn("mt-1 flex-shrink-0 transition-colors", task.completed ? "text-green-500" : "text-slate-300 hover:text-primary")}>
                  {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                <div className={cn("flex-1", task.completed && "opacity-50")}>
                  <h4 className={cn("font-semibold", task.completed ? "line-through text-slate-500" : "text-slate-800")}>{task.title}</h4>
                  <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">{task.estimatedMinutes} min</span>
                    {task.isWellnessBreak && <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-green-100 text-green-700">Wellness Break</span>}
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-slate-500 font-medium">All caught up! Time to relax.</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-display font-bold text-slate-800">Quick Actions</h2>
          <div className="space-y-4">
            <Link href="/wellness" className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform group">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center group-hover:bg-rose-100 transition-colors"><Heart size={24}/></div>
              <div>
                <h4 className="font-bold text-slate-800">Daily Check-in</h4>
                <p className="text-sm text-slate-500">Log your mood today</p>
              </div>
            </Link>
            <Link href="/chat" className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors"><MessageCircle size={24}/></div>
              <div>
                <h4 className="font-bold text-slate-800">Talk to Mentor</h4>
                <p className="text-sm text-slate-500">Feeling stuck? Chat now</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
