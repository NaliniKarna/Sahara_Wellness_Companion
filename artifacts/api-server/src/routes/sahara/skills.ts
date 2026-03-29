import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { userProfilesTable, skillProgressTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { getSessionId } from "../../lib/session";
import { UpdateSkillProgressBody } from "@workspace/api-zod";

const router: IRouter = Router();

const milestoneTemplates = [
  { id: "m1", title: "Foundation Complete", description: "Master the core fundamentals of your chosen field", targetDate: null },
  { id: "m2", title: "First Portfolio Project", description: "Build and publish your first real project", targetDate: null },
  { id: "m3", title: "Job-Ready Portfolio", description: "Complete 3 projects that demonstrate your skills", targetDate: null },
  { id: "m4", title: "First Application Sent", description: "Apply to your first target role", targetDate: null },
];

router.get("/skills/gaps", async (req, res) => {
  const sessionId = getSessionId(req);
  
  const profiles = await db.select().from(userProfilesTable).where(eq(userProfilesTable.sessionId, sessionId)).limit(1);
  const skillRows = await db.select().from(skillProgressTable).where(eq(skillProgressTable.sessionId, sessionId));
  
  const profile = profiles[0];
  const targetCareer = profile?.targetCareer || "Software Engineer";
  
  const skills = skillRows.map(s => ({
    id: s.id.toString(),
    name: s.skillName,
    currentLevel: s.currentLevel || 0,
    targetLevel: s.targetLevel || 90,
    category: s.category,
    resources: s.resources || [],
  }));

  const overallProgress = skills.length > 0
    ? skills.reduce((sum, s) => sum + ((s.currentLevel / s.targetLevel) * 100), 0) / skills.length
    : 0;

  const missingSkills: string[] = [];
  if (overallProgress < 30) missingSkills.push("Portfolio Projects", "Professional Networking");
  if (overallProgress < 50) missingSkills.push("Industry Knowledge");
  if (overallProgress < 70) missingSkills.push("Advanced Specialization");

  const milestones = milestoneTemplates.map((m, i) => ({
    ...m,
    completed: overallProgress > (i + 1) * 25,
  }));

  res.json({
    targetCareer,
    overallProgress: Math.round(overallProgress),
    skills,
    milestones,
    missingSkills,
  });
});

router.post("/skills/update", async (req, res) => {
  const sessionId = getSessionId(req);
  const { skillId, currentLevel } = UpdateSkillProgressBody.parse(req.body);
  
  const updated = await db
    .update(skillProgressTable)
    .set({ currentLevel, updatedAt: new Date() })
    .where(and(eq(skillProgressTable.id, parseInt(skillId)), eq(skillProgressTable.sessionId, sessionId)))
    .returning();

  if (!updated.length) {
    res.status(404).json({ error: "Skill not found" });
    return;
  }

  const s = updated[0];
  res.json({
    id: s.id.toString(),
    name: s.skillName,
    currentLevel: s.currentLevel || 0,
    targetLevel: s.targetLevel || 90,
    category: s.category,
    resources: s.resources || [],
  });
});

export default router;
