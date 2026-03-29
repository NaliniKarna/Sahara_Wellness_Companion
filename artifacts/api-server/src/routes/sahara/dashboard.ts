import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { userProfilesTable, tasksTable, wellnessCheckinTable, skillProgressTable } from "@workspace/db";
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

router.get("/dashboard", async (req, res) => {
  const sessionId = getSessionId(req);
  const weekStart = getCurrentWeekStart();
  
  const [profiles, tasks, wellnessData, skills] = await Promise.all([
    db.select().from(userProfilesTable).where(eq(userProfilesTable.sessionId, sessionId)).limit(1),
    db.select().from(tasksTable).where(and(eq(tasksTable.sessionId, sessionId), eq(tasksTable.weekStart, weekStart))),
    db.select().from(wellnessCheckinTable).where(eq(wellnessCheckinTable.sessionId, sessionId)).orderBy(desc(wellnessCheckinTable.createdAt)).limit(1),
    db.select().from(skillProgressTable).where(eq(skillProgressTable.sessionId, sessionId)),
  ]);

  const profile = profiles[0];
  const wellness = wellnessData[0];
  
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  
  const avgSkillProgress = skills.length > 0
    ? skills.reduce((sum, s) => sum + ((s.currentLevel || 0) / (s.targetLevel || 90)), 0) / skills.length * 100
    : 0;

  // Calculate streak (simplified: count consecutive days with at least one checkin)
  const allCheckins = await db.select().from(wellnessCheckinTable).where(eq(wellnessCheckinTable.sessionId, sessionId)).orderBy(desc(wellnessCheckinTable.createdAt)).limit(30);
  let streakDays = allCheckins.length > 0 ? Math.min(7, allCheckins.length) : 0;

  const upcomingTasks = tasks
    .filter(t => !t.completed)
    .slice(0, 3)
    .map(t => ({
      id: t.id.toString(),
      title: t.title,
      description: t.description,
      category: t.category,
      priority: t.priority,
      completed: t.completed || false,
      dueDate: t.dueDate,
      estimatedMinutes: t.estimatedMinutes || 30,
      isWellnessBreak: t.isWellnessBreak || false,
    }));

  res.json({
    profile: profile ? {
      id: profile.id.toString(),
      sessionId: profile.sessionId,
      name: profile.name,
      interests: profile.interests || [],
      skills: profile.skills || [],
      education: profile.education,
      status: profile.status,
      weeklyLearningHours: profile.weeklyLearningHours,
      goals: profile.goals,
      energyLevel: profile.energyLevel,
      stressLevel: profile.stressLevel,
      focusLevel: profile.focusLevel,
      targetCareer: profile.targetCareer,
      onboardingComplete: profile.onboardingComplete,
      createdAt: profile.createdAt?.toISOString(),
    } : null,
    careerProgress: Math.round(avgSkillProgress),
    weeklyTasksCompleted: completedTasks,
    weeklyTasksTotal: totalTasks,
    wellness: {
      stressLevel: wellness?.stressLevel ?? 5,
      energyLevel: wellness?.energyLevel ?? 5,
      focusLevel: wellness?.focusLevel ?? 5,
      moodScore: wellness?.moodScore ?? 5,
      lastCheckin: wellness?.createdAt?.toISOString() ?? null,
      recommendations: [],
    },
    upcomingTasks,
    streakDays,
  });
});

export default router;
