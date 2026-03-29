import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { userProfilesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getSessionId } from "../../lib/session";
import { UpdateProfileBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/users/profile", async (req, res) => {
  const sessionId = getSessionId(req);
  
  const profile = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.sessionId, sessionId))
    .limit(1);

  if (!profile.length) {
    res.status(200).json(null);
    return;
  }

  const p = profile[0];
  res.json({
    id: p.id.toString(),
    sessionId: p.sessionId,
    name: p.name,
    interests: p.interests || [],
    skills: p.skills || [],
    education: p.education,
    status: p.status,
    weeklyLearningHours: p.weeklyLearningHours,
    goals: p.goals,
    energyLevel: p.energyLevel,
    stressLevel: p.stressLevel,
    focusLevel: p.focusLevel,
    targetCareer: p.targetCareer,
    onboardingComplete: p.onboardingComplete,
    createdAt: p.createdAt?.toISOString(),
  });
});

router.put("/users/profile", async (req, res) => {
  const sessionId = getSessionId(req);
  const data = UpdateProfileBody.parse(req.body);

  const existing = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.sessionId, sessionId))
    .limit(1);

  if (!existing.length) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }

  const updated = await db
    .update(userProfilesTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(userProfilesTable.sessionId, sessionId))
    .returning();

  const p = updated[0];
  res.json({
    id: p.id.toString(),
    sessionId: p.sessionId,
    name: p.name,
    interests: p.interests || [],
    skills: p.skills || [],
    education: p.education,
    status: p.status,
    weeklyLearningHours: p.weeklyLearningHours,
    goals: p.goals,
    energyLevel: p.energyLevel,
    stressLevel: p.stressLevel,
    focusLevel: p.focusLevel,
    targetCareer: p.targetCareer,
    onboardingComplete: p.onboardingComplete,
    createdAt: p.createdAt?.toISOString(),
  });
});

export default router;
