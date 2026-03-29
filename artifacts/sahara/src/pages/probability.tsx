import { useGetCareerProbability } from "@workspace/api-client-react";
import { getAuthOptions } from "@/lib/auth";
import { Layout } from "@/components/layout";
import { Link, useRoute } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, TrendingUp, Lightbulb, CheckCircle2 } from "lucide-react";

function GaugeChart({ value }: { value: number }) {
  const size = 280;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Background ring */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <motion.circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - filled }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-5xl font-display font-bold text-slate-800"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {value}%
        </motion.span>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">Probability</span>
      </div>
    </div>
  );
}

export default function ProbabilityPage() {
  const [, params] = useRoute("/probability/:id");
  const { data, isLoading } = useGetCareerProbability(params?.id || "", {
    ...getAuthOptions(),
    query: { enabled: !!params?.id }
  });

  if (isLoading || !data) {
    return (
      <Layout>
        <div className="animate-pulse flex flex-col items-center justify-center pt-20">
          <div className="w-64 h-64 bg-slate-200 rounded-full mb-8"></div>
          <div className="w-1/2 h-8 bg-slate-200 rounded"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <Link href="/career" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-semibold text-sm transition-colors mb-4">
          <ArrowLeft size={16} /> Back to Careers
        </Link>
        <h1 className="text-3xl font-display font-bold text-slate-900">
          Success Probability: {data.careerTitle}
        </h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto pt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center"
        >
          <GaugeChart value={data.successProbability} />
        </motion.div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 rounded-3xl border-l-4 border-l-primary bg-white shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-xl text-primary shrink-0"><Brain size={24}/></div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">Required Effort</h3>
                <p className="text-slate-600 font-medium">{data.requiredEffort}</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-3xl border-l-4 border-l-indigo-500 bg-white shadow-sm">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-500 shrink-0"><TrendingUp size={24}/></div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">Suggested Timeline</h3>
                <p className="text-slate-600 font-medium">{data.suggestedLearningTime}</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl">
            <h3 className="font-bold text-white text-lg mb-4 flex items-center gap-2">
              <Lightbulb size={20} className="text-amber-400"/> How to improve your odds
            </h3>
            <ul className="space-y-3">
              {data.improvementTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-green-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300 font-medium text-sm leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
