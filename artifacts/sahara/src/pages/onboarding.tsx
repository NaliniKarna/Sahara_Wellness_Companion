import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Loader2, Target, Heart, Brain, Zap, Sparkles } from "lucide-react";
import { useSubmitOnboarding } from "@workspace/api-client-react";
import { getAuthOptions } from "@/lib/auth";
import confetti from "canvas-confetti";
import { cn } from "@/components/layout";

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    interests: [] as string[],
    skills: [] as string[],
    education: "",
    status: "",
    weeklyLearningHours: 5,
    goals: "",
    energyLevel: 5,
    stressLevel: 5,
    focusLevel: 5,
  });

  const { mutate: submitOnboarding, isPending } = useSubmitOnboarding({
    ...getAuthOptions(),
    mutation: {
      onSuccess: () => {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#6366f1', '#a855f7']
        });
        setTimeout(() => setLocation("/dashboard"), 1500);
      }
    }
  });

  const handleNext = () => setStep(s => Math.min(s + 1, 5));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));
  const handleSubmit = () => submitOnboarding({ data: formData });

  const toggleArray = (field: 'interests' | 'skills', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(i => i !== value)
        : [...prev[field], value]
    }));
  };

  const steps = [
    {
      title: "Welcome to Sahara.",
      subtitle: "Let's start with the basics.",
      content: (
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">What should we call you?</label>
            <input 
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Your name"
              className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-100 text-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">What are you interested in?</label>
            <div className="flex flex-wrap gap-2">
              {['Technology', 'Design', 'Business', 'Healthcare', 'Writing', 'Science', 'Art', 'Data'].map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleArray('interests', interest)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border-2",
                    formData.interests.includes(interest)
                      ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                      : "bg-white text-slate-600 border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "What are your current skills?",
      subtitle: "Don't worry if you're just starting out.",
      content: (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {['Communication', 'Coding', 'UI/UX', 'Marketing', 'Analysis', 'Project Management', 'Public Speaking', 'Research'].map(skill => (
              <button
                key={skill}
                onClick={() => toggleArray('skills', skill)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border-2",
                  formData.skills.includes(skill)
                    ? "bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-500/20"
                    : "bg-white text-slate-600 border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Where are you in life?",
      subtitle: "Help us understand your current context.",
      content: (
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Current Status</label>
            <div className="grid grid-cols-2 gap-4">
              {['Student', 'Employed', 'Job Seeking', 'Career Changer'].map(status => (
                <button
                  key={status}
                  onClick={() => setFormData({...formData, status})}
                  className={cn(
                    "p-4 rounded-2xl text-center font-semibold transition-all border-2",
                    formData.status === status
                      ? "bg-primary/5 text-primary border-primary"
                      : "bg-white text-slate-600 border-slate-100 hover:border-slate-200"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Highest Education Level</label>
            <select
              value={formData.education}
              onChange={(e) => setFormData({...formData, education: e.target.value})}
              className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-100 text-lg focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-slate-700"
            >
              <option value="" disabled>Select education...</option>
              <option value="high_school">High School</option>
              <option value="bachelors">Bachelor's Degree</option>
              <option value="masters">Master's Degree</option>
              <option value="phd">Ph.D. or Higher</option>
              <option value="bootcamp">Bootcamp / Self-Taught</option>
            </select>
          </div>
        </div>
      )
    },
    {
      title: "Setting your pace.",
      subtitle: "How much time can you commit?",
      content: (
        <div className="space-y-8">
          <div>
            <label className="flex justify-between items-center text-sm font-semibold text-slate-700 mb-4">
              <span>Weekly Learning Hours</span>
              <span className="text-primary text-xl font-bold bg-primary/10 px-3 py-1 rounded-lg">{formData.weeklyLearningHours} hrs</span>
            </label>
            <input 
              type="range" min="1" max="40"
              value={formData.weeklyLearningHours}
              onChange={(e) => setFormData({...formData, weeklyLearningHours: parseInt(e.target.value)})}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">What is your main goal right now?</label>
            <textarea
              value={formData.goals}
              onChange={(e) => setFormData({...formData, goals: e.target.value})}
              placeholder="E.g., I want to transition into UX design without burning out..."
              rows={4}
              className="w-full px-5 py-4 rounded-2xl bg-white border-2 border-slate-100 text-base focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none shadow-sm"
            />
          </div>
        </div>
      )
    },
    {
      title: "Check your vital signs.",
      subtitle: "How are you feeling right now?",
      content: (
        <div className="space-y-8">
          {[
            { id: 'energyLevel', label: 'Energy Level', icon: Zap, color: 'text-amber-500' },
            { id: 'stressLevel', label: 'Stress Level', icon: Heart, color: 'text-rose-500' },
            { id: 'focusLevel', label: 'Focus Level', icon: Brain, color: 'text-indigo-500' }
          ].map((slider) => (
            <div key={slider.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-4">
                <slider.icon size={18} className={slider.color} />
                {slider.label}
                <span className="ml-auto text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-lg text-xs">
                  {formData[slider.id as keyof typeof formData]}/10
                </span>
              </label>
              <input 
                type="range" min="1" max="10"
                value={formData[slider.id as keyof typeof formData] as number}
                onChange={(e) => setFormData({...formData, [slider.id]: parseInt(e.target.value)})}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="mb-8 flex justify-center gap-2">
          {[1,2,3,4,5].map(i => (
            <div key={i} className={cn("h-2 rounded-full transition-all duration-500", i <= step ? "w-12 bg-primary" : "w-4 bg-slate-200")} />
          ))}
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] shadow-xl overflow-hidden">
          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">{steps[step-1].title}</h1>
                <p className="text-slate-500 font-medium mb-10">{steps[step-1].subtitle}</p>
                {steps[step-1].content}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="bg-slate-50/80 p-6 px-8 md:px-12 flex items-center justify-between border-t border-slate-100">
            {step > 1 ? (
              <button onClick={handleBack} className="px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-white hover:shadow-sm transition-all flex items-center gap-2">
                <ArrowLeft size={18} /> Back
              </button>
            ) : <div />}

            {step < 5 ? (
              <button onClick={handleNext} className="px-8 py-3 rounded-xl font-semibold bg-slate-900 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
                Continue <ArrowRight size={18} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                disabled={isPending}
                className="px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary to-indigo-500 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isPending ? <Loader2 className="animate-spin" size={18}/> : <><Sparkles size={18} /> Complete Setup</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
