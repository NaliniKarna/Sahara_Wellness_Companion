import { useState } from "react";
import { useGetWellnessCheckin, useSubmitWellnessCheckin } from "@workspace/api-client-react";
import { getAuthOptions } from "@/lib/auth";
import { Layout } from "@/components/layout";
import { useQueryClient } from "@tanstack/react-query";
import { Heart, Zap, Brain, Smile, Activity, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function WellnessPage() {
  const queryClient = useQueryClient();
  const { data: currentData } = useGetWellnessCheckin(getAuthOptions());
  
  const [form, setForm] = useState({
    stressLevel: 5,
    energyLevel: 5,
    focusLevel: 5,
    moodScore: 5
  });

  const { mutate: submit, isPending } = useSubmitWellnessCheckin({
    ...getAuthOptions(),
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/wellness/checkin"] });
        queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      }
    }
  });

  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3">
          <Heart className="text-rose-500 fill-rose-500/20" /> Wellness Center
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Balance is the key to sustainable success. How are you feeling today?</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Check-in Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[2rem] p-8">
          <h2 className="text-xl font-bold font-display text-slate-800 mb-6">Daily Check-in</h2>
          
          <div className="space-y-8 mb-8">
            {[
              { id: 'moodScore', label: 'Overall Mood', icon: Smile, color: 'text-green-500', from: 'Low', to: 'Great' },
              { id: 'energyLevel', label: 'Energy Level', icon: Zap, color: 'text-amber-500', from: 'Exhausted', to: 'Energized' },
              { id: 'stressLevel', label: 'Stress Level', icon: Activity, color: 'text-rose-500', from: 'Calm', to: 'Overwhelmed' },
              { id: 'focusLevel', label: 'Focus Capacity', icon: Brain, color: 'text-indigo-500', from: 'Scattered', to: 'Sharp' }
            ].map((slider) => (
              <div key={slider.id}>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                  <slider.icon size={18} className={slider.color} /> {slider.label}
                  <span className="ml-auto text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-bold">{form[slider.id as keyof typeof form]}/10</span>
                </label>
                <input 
                  type="range" min="1" max="10"
                  value={form[slider.id as keyof typeof form]}
                  onChange={(e) => setForm({...form, [slider.id]: parseInt(e.target.value)})}
                  className="w-full h-2.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-semibold">
                  <span>{slider.from}</span>
                  <span>{slider.to}</span>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => submit({ data: form })}
            disabled={isPending}
            className="w-full py-4 rounded-xl font-bold bg-slate-900 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Log Check-in"}
          </button>
        </motion.div>

        {/* Dynamic Recommendations */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-[2rem] p-8 bg-gradient-to-br from-indigo-50 to-blue-50 border-blue-100">
            <h2 className="text-xl font-bold font-display text-slate-800 mb-4 flex items-center gap-2">
              <ShieldCheck className="text-indigo-500" /> Prescriptions for Today
            </h2>
            {currentData?.recommendations ? (
              <ul className="space-y-3">
                {currentData.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3 bg-white/60 p-3 rounded-xl border border-white">
                    <span className="text-indigo-500 mt-0.5">•</span>
                    <span className="text-slate-700 font-medium text-sm leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-500 italic text-sm">Log your check-in to get personalized recommendations.</p>
            )}
          </motion.div>

          <h2 className="text-xl font-bold font-display text-slate-800 mt-8 mb-4">Mini Exercises</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Hardcoded sample exercises since standard response might lack them if not full typed */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-10 h-10 bg-teal-50 text-teal-500 rounded-full flex items-center justify-center mb-3"><Heart size={18}/></div>
              <h4 className="font-bold text-slate-800 text-sm">Box Breathing</h4>
              <p className="text-xs text-slate-500 mt-1">4 mins • Reduces stress instantly</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-3"><Smile size={18}/></div>
              <h4 className="font-bold text-slate-800 text-sm">Gratitude Log</h4>
              <p className="text-xs text-slate-500 mt-1">2 mins • Shifts focus to positive</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
