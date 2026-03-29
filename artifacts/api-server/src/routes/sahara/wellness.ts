import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { wellnessCheckinTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { getSessionId } from "../../lib/session";
import { SubmitWellnessCheckinBody } from "@workspace/api-zod";

const router: IRouter = Router();

const wellnessExercises = [
  {
    id: "box-breathing",
    title: "Box Breathing",
    description: "Inhale 4s → Hold 4s → Exhale 4s → Hold 4s. Repeat 4 times. Reduces cortisol and activates the parasympathetic nervous system.",
    duration: "5 min",
    type: "breathing",
  },
  {
    id: "pomodoro",
    title: "Pomodoro Focus Session",
    description: "Work for 25 minutes, then take a 5-minute break. After 4 rounds, take a 20-minute break. Proven to improve focus and reduce mental fatigue.",
    duration: "30 min cycle",
    type: "productivity",
  },
  {
    id: "journaling",
    title: "Gratitude Journaling",
    description: "Write 3 things you're grateful for today, 1 thing that challenged you, and 1 thing you learned. Shifts mindset from stress to growth.",
    duration: "10 min",
    type: "journaling",
  },
  {
    id: "body-scan",
    title: "5-Minute Body Scan",
    description: "Close your eyes. Slowly notice sensations from your feet upward. Release tension you find. Perfect for mid-day reset.",
    duration: "5 min",
    type: "mindfulness",
  },
  {
    id: "cold-water",
    title: "Cold Water Reset",
    description: "Splash cold water on your face or do a 30-second cold water wrist immersion. Instantly reduces stress hormones and sharpens focus.",
    duration: "2 min",
    type: "physical",
  },
];

function getWellnessRecommendations(stress: number, energy: number, focus: number): string[] {
  const recommendations: string[] = [];
  
  if (stress >= 7) {
    recommendations.push("🔴 High stress detected. Consider a 10-minute walk outside before your next task.");
    recommendations.push("Try the box breathing exercise below — it's clinically proven to lower cortisol.");
  } else if (stress >= 5) {
    recommendations.push("🟡 Moderate stress. Schedule a 5-minute break every 45 minutes of focused work.");
  }
  
  if (energy <= 3) {
    recommendations.push("⚡ Low energy. Prioritize only 1-2 critical tasks today. It's okay to do less.");
    recommendations.push("Check your sleep quality — even 20 extra minutes of sleep can transform your energy.");
  } else if (energy <= 5) {
    recommendations.push("🟡 Energy is moderate. Front-load your hardest tasks in the first 2 hours of work.");
  }
  
  if (focus <= 3) {
    recommendations.push("🧠 Focus is low. Try a 5-minute mindfulness reset before starting your next task.");
    recommendations.push("Remove phone from desk and use website blockers for your next work session.");
  }
  
  if (stress <= 3 && energy >= 7 && focus >= 7) {
    recommendations.push("🌟 You're in flow state conditions. Block 2-3 hours for deep work on your most important project.");
  }
  
  return recommendations.length > 0 ? recommendations : ["✅ Your wellness looks good! Keep your current routine going."];
}

router.get("/wellness/checkin", async (req, res) => {
  const sessionId = getSessionId(req);
  
  const latest = await db
    .select()
    .from(wellnessCheckinTable)
    .where(eq(wellnessCheckinTable.sessionId, sessionId))
    .orderBy(desc(wellnessCheckinTable.createdAt))
    .limit(1);

  if (!latest.length) {
    res.json({
      stressLevel: 5,
      energyLevel: 5,
      focusLevel: 5,
      moodScore: 5,
      lastCheckin: null,
      recommendations: ["Complete your first wellness check-in to get personalized recommendations!"],
    });
    return;
  }

  const w = latest[0];
  res.json({
    stressLevel: w.stressLevel,
    energyLevel: w.energyLevel,
    focusLevel: w.focusLevel,
    moodScore: w.moodScore,
    lastCheckin: w.createdAt?.toISOString(),
    recommendations: getWellnessRecommendations(w.stressLevel, w.energyLevel, w.focusLevel),
  });
});

router.post("/wellness/checkin", async (req, res) => {
  const sessionId = getSessionId(req);
  const data = SubmitWellnessCheckinBody.parse(req.body);
  
  await db.insert(wellnessCheckinTable).values({
    sessionId,
    stressLevel: data.stressLevel,
    energyLevel: data.energyLevel,
    focusLevel: data.focusLevel,
    moodScore: data.moodScore,
    notes: data.notes,
  });

  const recommendations = getWellnessRecommendations(data.stressLevel, data.energyLevel, data.focusLevel);
  
  // Select exercises based on wellness state
  const relevantExercises = data.stressLevel >= 6 
    ? wellnessExercises.filter(e => e.type === "breathing" || e.type === "mindfulness")
    : data.energy <= 4
    ? wellnessExercises.filter(e => e.type === "physical" || e.type === "productivity")
    : wellnessExercises.slice(0, 3);

  res.json({
    wellness: {
      stressLevel: data.stressLevel,
      energyLevel: data.energyLevel,
      focusLevel: data.focusLevel,
      moodScore: data.moodScore,
      lastCheckin: new Date().toISOString(),
      recommendations,
    },
    recommendations,
    exercises: relevantExercises,
  });
});

router.get("/wellness/mood-history", async (req, res) => {
  const sessionId = getSessionId(req);
  
  const history = await db
    .select()
    .from(wellnessCheckinTable)
    .where(eq(wellnessCheckinTable.sessionId, sessionId))
    .orderBy(desc(wellnessCheckinTable.createdAt))
    .limit(14);

  const entries = history.reverse().map(w => ({
    date: w.createdAt?.toISOString().split("T")[0] || "",
    moodScore: w.moodScore,
    stressLevel: w.stressLevel,
    energyLevel: w.energyLevel,
  }));

  // If no history, return sample data for display
  if (entries.length === 0) {
    const today = new Date();
    const sampleEntries = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toISOString().split("T")[0],
        moodScore: 5 + Math.sin(i) * 1.5,
        stressLevel: 5 + Math.cos(i) * 1.5,
        energyLevel: 5 + Math.sin(i + 2) * 1.5,
      };
    });
    res.json({ entries: sampleEntries });
    return;
  }

  res.json({ entries });
});

export default router;
