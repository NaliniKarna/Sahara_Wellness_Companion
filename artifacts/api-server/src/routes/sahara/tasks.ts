import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { tasksTable, userProfilesTable, wellnessCheckinTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { getSessionId } from "../../lib/session";

const router: IRouter = Router();

function getCurrentWeekStart(): string {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day;
  const weekStart = new Date(today.setDate(diff));
  return weekStart.toISOString().split("T")[0];
}

function getCurrentWeekEnd(): string {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + 6;
  const weekEnd = new Date(today.setDate(diff));
  return weekEnd.toISOString().split("T")[0];
}

router.get("/tasks/weekly-plan", async (req, res) => {
  const sessionId = getSessionId(req);
  const weekStart = getCurrentWeekStart();
  const weekEnd = getCurrentWeekEnd();
  
  let tasks = await db
    .select()
    .from(tasksTable)
    .where(and(eq(tasksTable.sessionId, sessionId), eq(tasksTable.weekStart, weekStart)));

  // If no tasks for this week, create default ones
  if (tasks.length === 0) {
    const profiles = await db.select().from(userProfilesTable).where(eq(userProfilesTable.sessionId, sessionId)).limit(1);
    const career = profiles[0]?.targetCareer || "Software Engineer";
    
    const defaultTasks = [
      { title: "Review your career roadmap", description: "Check your skill gaps and update your learning priorities", category: "Planning", priority: "high", estimatedMinutes: 20, isWellnessBreak: false },
      { title: "30 min focused learning", description: "Work on your top priority skill", category: "Learning", priority: "high", estimatedMinutes: 30, isWellnessBreak: false },
      { title: "Practice what you learned", description: "Apply concepts from your recent learning session", category: "Practice", priority: "medium", estimatedMinutes: 45, isWellnessBreak: false },
      { title: "Wellness check-in", description: "Update your mood, stress, and energy levels", category: "Wellness", priority: "medium", estimatedMinutes: 5, isWellnessBreak: true },
      { title: "Network or community time", description: "Connect with one person in your target field", category: "Networking", priority: "low", estimatedMinutes: 20, isWellnessBreak: false },
    ];
    
    const inserted = await db.insert(tasksTable).values(
      defaultTasks.map(t => ({ ...t, sessionId, weekStart, completed: false }))
    ).returning();
    tasks = inserted;
  }

  const completedCount = tasks.filter(t => t.completed).length;
  const completionPercentage = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  
  // Get wellness for adaptive note
  const latestWellness = await db
    .select()
    .from(wellnessCheckinTable)
    .where(eq(wellnessCheckinTable.sessionId, sessionId))
    .orderBy(desc(wellnessCheckinTable.createdAt))
    .limit(1);
  
  const wellness = latestWellness[0];
  let adaptiveNote = "You're doing great! Keep up the consistent effort.";
  let focusTip = "🎯 Try the Pomodoro technique: 25 min focus, 5 min break.";
  
  if (wellness) {
    if (wellness.stressLevel >= 7) {
      adaptiveNote = "⚠️ High stress detected this week. Prioritize your wellness breaks. It's okay to do fewer tasks — quality over quantity.";
      focusTip = "🌿 Do your hardest task first thing in the morning when stress hormones are lower.";
    } else if (wellness.energyLevel <= 3) {
      adaptiveNote = "💤 Energy is low. Focus only on the 'high priority' tasks today. Rest is productive too.";
      focusTip = "⚡ Match task difficulty to your energy level. Save complex work for your peak hours.";
    } else if (completionPercentage >= 80) {
      adaptiveNote = "🌟 You're crushing it this week! Consider adding a bonus challenge or celebrating your progress.";
      focusTip = "🚀 You're in momentum. Keep your streak going with one more quick win!";
    }
  }

  res.json({
    weekStart,
    weekEnd,
    completionPercentage,
    tasks: tasks.map(t => ({
      id: t.id.toString(),
      title: t.title,
      description: t.description,
      category: t.category,
      priority: t.priority,
      completed: t.completed || false,
      dueDate: t.dueDate,
      estimatedMinutes: t.estimatedMinutes || 30,
      isWellnessBreak: t.isWellnessBreak || false,
    })),
    focusTip,
    adaptiveNote,
  });
});

router.post("/tasks/:taskId/complete", async (req, res) => {
  const sessionId = getSessionId(req);
  const taskId = parseInt(req.params.taskId);
  
  const updated = await db
    .update(tasksTable)
    .set({ completed: true })
    .where(and(eq(tasksTable.id, taskId), eq(tasksTable.sessionId, sessionId)))
    .returning();

  if (!updated.length) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  const t = updated[0];
  res.json({
    id: t.id.toString(),
    title: t.title,
    description: t.description,
    category: t.category,
    priority: t.priority,
    completed: t.completed || false,
    dueDate: t.dueDate,
    estimatedMinutes: t.estimatedMinutes || 30,
    isWellnessBreak: t.isWellnessBreak || false,
  });
});

router.post("/tasks/:taskId/uncomplete", async (req, res) => {
  const sessionId = getSessionId(req);
  const taskId = parseInt(req.params.taskId);
  
  const updated = await db
    .update(tasksTable)
    .set({ completed: false })
    .where(and(eq(tasksTable.id, taskId), eq(tasksTable.sessionId, sessionId)))
    .returning();

  if (!updated.length) {
    res.status(404).json({ error: "Task not found" });
    return;
  }

  const t = updated[0];
  res.json({
    id: t.id.toString(),
    title: t.title,
    description: t.description,
    category: t.category,
    priority: t.priority,
    completed: t.completed || false,
    dueDate: t.dueDate,
    estimatedMinutes: t.estimatedMinutes || 30,
    isWellnessBreak: t.isWellnessBreak || false,
  });
});

export default router;
