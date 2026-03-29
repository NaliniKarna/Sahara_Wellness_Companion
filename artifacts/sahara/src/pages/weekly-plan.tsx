import { useGetWeeklyPlan, useCompleteTask, useUncompleteTask } from "@workspace/api-client-react";
import { getAuthOptions } from "@/lib/auth";
import { Layout } from "@/components/layout";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Calendar, Leaf, Lightbulb } from "lucide-react";
import { cn } from "@/components/layout";
import confetti from "canvas-confetti";

export default function WeeklyPlanPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetWeeklyPlan(getAuthOptions());
  
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["/api/tasks/weekly-plan"] });
  
  const { mutate: completeTask } = useCompleteTask({
    ...getAuthOptions(),
    mutation: {
      onSuccess: () => {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
        invalidate();
      }
    }
  });
  
  const { mutate: uncompleteTask } = useUncompleteTask({
    ...getAuthOptions(),
    mutation: { onSuccess: invalidate }
  });

  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold text-slate-900 flex items-center gap-3">
          <Calendar className="text-primary" /> Weekly Action Plan
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Bite-sized tasks to keep you moving forward without burning out.</p>
      </div>

      {isLoading || !data ? (
        <div className="animate-pulse space-y-6"><div className="h-64 bg-slate-200 rounded-3xl"></div></div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-100 shadow-sm">
              <span className="font-bold text-slate-700">Week Progress</span>
              <div className="flex items-center gap-4 flex-1 max-w-sm ml-6">
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${data.completionPercentage}%` }} />
                </div>
                <span className="font-bold text-slate-800">{data.completionPercentage}%</span>
              </div>
            </div>

            <div className="space-y-3">
              {data.tasks.map((task, i) => (
                <motion.div 
                  key={task.id} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i*0.05 }}
                  className={cn(
                    "glass-card p-5 rounded-2xl flex gap-4 transition-all duration-300",
                    task.completed ? "opacity-75 bg-slate-50" : "hover:shadow-md border-transparent hover:border-slate-200",
                    task.isWellnessBreak && !task.completed && "bg-green-50/50 border-green-100"
                  )}
                >
                  <button 
                    onClick={() => task.completed ? uncompleteTask({ taskId: task.id }) : completeTask({ taskId: task.id })}
                    className={cn(
                      "mt-1 flex-shrink-0 transition-all hover:scale-110",
                      task.completed ? "text-green-500" : "text-slate-300 hover:text-primary"
                    )}
                  >
                    {task.completed ? <CheckCircle2 size={26} /> : <Circle size={26} />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className={cn("font-bold text-lg", task.completed ? "line-through text-slate-500" : "text-slate-800")}>
                        {task.title}
                      </h3>
                      {task.isWellnessBreak && (
                        <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-lg shrink-0">
                          <Leaf size={14} /> Wellness
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 font-medium text-sm mt-1">{task.description}</p>
                    <div className="flex gap-2 mt-3">
                      <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{task.estimatedMinutes} min</span>
                      <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-md uppercase">{task.category}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6 rounded-[2rem] bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
                <Lightbulb size={24} />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">Coach's Note</h3>
              <p className="text-slate-600 font-medium text-sm leading-relaxed">{data.adaptiveNote}</p>
            </div>
            
            <div className="glass-card p-6 rounded-[2rem]">
              <h3 className="font-bold text-slate-800 mb-2">Focus Tip</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">{data.focusTip}</p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
