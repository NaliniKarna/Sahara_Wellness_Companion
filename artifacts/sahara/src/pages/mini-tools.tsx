import { Layout } from "@/components/layout";
import { Brain, Timer, Lightbulb, CheckCircle2, Circle, AlertTriangle, Battery, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useGetMoodHistory } from "@workspace/api-client-react";
import { getAuthOptions } from "@/lib/auth";

export function FocusPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto text-center space-y-10">
        <div>
          <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl mx-auto flex items-center justify-center mb-6">
            <Timer size={32} />
          </div>
          <h1 className="text-4xl font-display font-bold text-slate-900 mb-4">Brain Focus Coach</h1>
          <p className="text-slate-500 font-medium">Work with your brain, not against it. 25 minutes of deep focus.</p>
        </div>

        <div className="glass-card rounded-[3rem] p-12 relative overflow-hidden">
          <div className="text-[6rem] font-display font-bold text-slate-800 tabular-nums tracking-tighter leading-none mb-8">
            {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
          </div>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => setIsActive(!isActive)}
              className="px-10 py-4 rounded-full font-bold text-lg bg-slate-900 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              {isActive ? "Pause" : "Start Focus"}
            </button>
            <button 
              onClick={() => { setIsActive(false); setTimeLeft(25*60); }}
              className="px-10 py-4 rounded-full font-bold text-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export function ProcrastinationPage() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Open resume document", done: true },
    { id: 2, text: "Update latest job title", done: false },
    { id: 3, text: "Write 3 bullet points", done: false },
  ]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-4 flex items-center gap-3">
          <Brain className="text-primary" /> Anti-Procrastination
        </h1>
        <p className="text-slate-500 font-medium mb-10">Overwhelmed? Let's break it down into microscopic, impossible-to-fail steps.</p>

        <div className="glass-card p-8 rounded-[2rem]">
          <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
            <Target size={20} className="text-rose-500"/> Current Goal: Update Resume
          </h3>
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <button 
                  onClick={() => setTasks(tasks.map(t => t.id === task.id ? {...t, done: !t.done} : t))}
                  className={task.done ? "text-green-500" : "text-slate-300"}
                >
                  {task.done ? <CheckCircle2 size={24}/> : <Circle size={24}/>}
                </button>
                <span className={`font-semibold ${task.done ? "text-slate-400 line-through" : "text-slate-700"}`}>
                  {task.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export function MythsPage() {
  const myths = [
    { myth: "I need to have my entire career figured out by 25.", reality: "Most people change careers 5-7 times in their lifetime. Agility > Certainty." },
    { myth: "Tech requires a Computer Science degree.", reality: "60% of developers are self-taught or bootcamp grads. Skills matter more than pedigrees." }
  ];
  const [revealed, setRevealed] = useState<number[]>([]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-4 flex items-center gap-3">
          <Lightbulb className="text-amber-500" /> Expectation vs Reality
        </h1>
        <p className="text-slate-500 font-medium mb-10">Debunking toxic career myths that cause unnecessary anxiety.</p>

        <div className="grid gap-6">
          {myths.map((m, i) => (
            <div key={i} className="glass-card rounded-[2rem] overflow-hidden">
              <div className="p-8 bg-slate-50/50">
                <div className="text-sm font-bold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-2"><AlertTriangle size={16}/> The Myth</div>
                <h3 className="text-xl font-bold text-slate-800">"{m.myth}"</h3>
              </div>
              <div className="p-8 border-t border-slate-100">
                {revealed.includes(i) ? (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                    <div className="text-sm font-bold text-green-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Sparkles size={16}/> Reality Check</div>
                    <p className="text-lg font-medium text-slate-700 leading-relaxed">{m.reality}</p>
                  </motion.div>
                ) : (
                  <button 
                    onClick={() => setRevealed([...revealed, i])}
                    className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-bold hover:bg-slate-50 hover:text-primary transition-colors"
                  >
                    Reveal Reality
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export function MentalHealthPage() {
  const { data } = useGetMoodHistory(getAuthOptions());
  
  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3">
          <Battery className="text-teal-500" /> Mental Health Support
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Safe space to reflect, breathe, and track your emotional journey over time.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-[2rem]">
          <h3 className="font-bold font-display text-xl text-slate-800 mb-6">Mood History (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.entries || []}>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
                <Tooltip cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="moodScore" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6 rounded-[2rem]">
            <h3 className="font-bold text-slate-800 mb-4">Quick Journal</h3>
            <textarea 
              placeholder="What's on your mind right now? (Private & encrypted)"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:outline-none focus:border-primary resize-none h-32 text-slate-700"
            />
            <div className="mt-4 flex justify-end">
              <button className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm">Save Entry</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Ensure importing Target inside mini-tools works
import { Target } from "lucide-react";
