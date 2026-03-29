import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { userProfilesTable, skillProgressTable, tasksTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getSessionId } from "../../lib/session";
import { SubmitOnboardingBody } from "@workspace/api-zod";

const router: IRouter = Router();

// Generate career-aligned initial skills
function generateInitialSkills(interests: string[], currentSkills: string[], targetCareer: string | null): Array<{name: string, currentLevel: number, targetLevel: number, category: string, resources: string[]}> {
  const careerSkillMaps: Record<string, Array<{name: string, category: string, resources: string[]}>> = {
    "Software Engineer": [
      { name: "Python", category: "Technical", resources: ["Python.org docs", "CS50 on edX", "Real Python"] },
      { name: "Data Structures", category: "Technical", resources: ["LeetCode", "Grokking Algorithms"] },
      { name: "System Design", category: "Technical", resources: ["Designing Data-Intensive Applications", "Grokking System Design"] },
      { name: "Git & Version Control", category: "Technical", resources: ["Pro Git Book", "GitHub Docs"] },
    ],
    "Data Scientist": [
      { name: "Python", category: "Technical", resources: ["Kaggle Learn", "DataCamp"] },
      { name: "Machine Learning", category: "Technical", resources: ["fast.ai", "Coursera ML Specialization"] },
      { name: "Statistics", category: "Technical", resources: ["Khan Academy Statistics", "Think Stats"] },
      { name: "SQL", category: "Technical", resources: ["Mode Analytics SQL", "SQLZoo"] },
    ],
    "UX Designer": [
      { name: "Figma", category: "Design", resources: ["Figma Learn", "Google UX Design Certificate"] },
      { name: "User Research", category: "Design", resources: ["Nielsen Norman Group", "Just Enough Research"] },
      { name: "Prototyping", category: "Design", resources: ["InVision Academy", "UX Booth"] },
      { name: "Design Systems", category: "Design", resources: ["Atomic Design Book", "Design Systems Repo"] },
    ],
    "Product Manager": [
      { name: "Product Strategy", category: "Business", resources: ["Inspired by Marty Cagan", "Product School"] },
      { name: "Data Analysis", category: "Technical", resources: ["Mixpanel Academy", "Amplitude Learn"] },
      { name: "Stakeholder Communication", category: "Soft Skills", resources: ["Crucial Conversations Book"] },
      { name: "Agile/Scrum", category: "Business", resources: ["Scrum.org", "Atlassian Agile Coach"] },
    ],
  };

  const defaultSkills = [
    { name: "Communication", category: "Soft Skills", resources: ["Toastmasters", "Harvard Communication Course"] },
    { name: "Problem Solving", category: "Soft Skills", resources: ["Farnam Street Blog", "Mental Models"] },
    { name: "Time Management", category: "Soft Skills", resources: ["Getting Things Done", "Deep Work by Cal Newport"] },
    { name: "Learning Agility", category: "Soft Skills", resources: ["Learn Like a Pro", "Coursera Learning How to Learn"] },
  ];

  const careerKey = targetCareer && careerSkillMaps[targetCareer] ? targetCareer : null;
  const careerSpecific = careerKey ? careerSkillMaps[careerKey] : defaultSkills;

  return careerSpecific.map(skill => {
    const hasSkill = currentSkills.some(s => s.toLowerCase().includes(skill.name.toLowerCase()));
    return {
      name: skill.name,
      currentLevel: hasSkill ? Math.random() * 40 + 30 : Math.random() * 20,
      targetLevel: 90,
      category: skill.category,
      resources: skill.resources,
    };
  });
}

// Infer best career from interests and goals
function inferTargetCareer(interests: string[], goals: string): string {
  const lower = (interests.join(" ") + " " + goals).toLowerCase();
  if (lower.includes("code") || lower.includes("software") || lower.includes("programming") || lower.includes("developer")) return "Software Engineer";
  if (lower.includes("data") || lower.includes("machine learning") || lower.includes("ai") || lower.includes("analytics")) return "Data Scientist";
  if (lower.includes("design") || lower.includes("ux") || lower.includes("ui") || lower.includes("creative")) return "UX Designer";
  if (lower.includes("product") || lower.includes("management") || lower.includes("business")) return "Product Manager";
  if (lower.includes("market") || lower.includes("content") || lower.includes("social media")) return "Marketing Specialist";
  return "Software Engineer";
}

// Generate initial weekly tasks
function generateWeeklyTasks(career: string, weeklyHours: number, sessionId: string): Array<{
  sessionId: string, title: string, description: string, category: string, priority: string, completed: boolean, estimatedMinutes: number, isWellnessBreak: boolean, weekStart: string
}> {
  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay())).toISOString().split("T")[0];
  
  const dailyMinutes = (weeklyHours * 60) / 5;

  const careerTasks: Record<string, Array<{title: string, description: string, category: string, priority: string, estimatedMinutes: number}>> = {
    "Software Engineer": [
      { title: "Complete Python basics module", description: "Work through variables, loops, and functions", category: "Learning", priority: "high", estimatedMinutes: 45 },
      { title: "Solve 2 LeetCode easy problems", description: "Practice array and string problems", category: "Practice", priority: "high", estimatedMinutes: 60 },
      { title: "Read about Git branching", description: "Learn merge vs rebase strategies", category: "Learning", priority: "medium", estimatedMinutes: 30 },
      { title: "Build a simple CLI tool", description: "Apply Python skills to a real mini-project", category: "Project", priority: "high", estimatedMinutes: 90 },
    ],
    "Data Scientist": [
      { title: "Complete Pandas tutorial", description: "Data manipulation with Python", category: "Learning", priority: "high", estimatedMinutes: 60 },
      { title: "Explore a Kaggle dataset", description: "Practice EDA on a real dataset", category: "Practice", priority: "high", estimatedMinutes: 90 },
      { title: "Read statistics chapter", description: "Probability and distributions", category: "Learning", priority: "medium", estimatedMinutes: 45 },
    ],
    "UX Designer": [
      { title: "Complete Figma basics", description: "Frames, components, and auto-layout", category: "Learning", priority: "high", estimatedMinutes: 60 },
      { title: "Conduct user interview", description: "Practice asking open-ended questions", category: "Practice", priority: "high", estimatedMinutes: 45 },
      { title: "Redesign an existing app screen", description: "Pick an app and improve its UX", category: "Project", priority: "medium", estimatedMinutes: 90 },
    ],
    "Product Manager": [
      { title: "Write a product requirements doc", description: "Practice writing clear requirements", category: "Practice", priority: "high", estimatedMinutes: 60 },
      { title: "Analyze a competitor product", description: "Feature comparison and gap analysis", category: "Research", priority: "medium", estimatedMinutes: 45 },
      { title: "Study agile ceremonies", description: "Sprint planning, standups, retrospectives", category: "Learning", priority: "medium", estimatedMinutes: 30 },
    ],
  };

  const tasks = (careerTasks[career] || careerTasks["Software Engineer"]).map(t => ({
    sessionId,
    ...t,
    completed: false,
    weekStart,
  }));

  // Add wellness break
  tasks.push({
    sessionId,
    title: "5-minute mindfulness break",
    description: "Take a short breathing or stretching break to reset your focus",
    category: "Wellness",
    priority: "medium",
    completed: false,
    estimatedMinutes: 5,
    isWellnessBreak: true,
    weekStart,
  });

  return tasks;
}

router.post("/onboarding", async (req, res) => {
  const sessionId = getSessionId(req);
  const data = SubmitOnboardingBody.parse(req.body);

  const targetCareer = inferTargetCareer(data.interests, data.goals);

  // Upsert user profile
  const existing = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.sessionId, sessionId))
    .limit(1);

  let profile;
  if (existing.length) {
    const updated = await db
      .update(userProfilesTable)
      .set({
        name: data.name,
        interests: data.interests,
        skills: data.skills,
        education: data.education,
        status: data.status,
        weeklyLearningHours: data.weeklyLearningHours,
        goals: data.goals,
        energyLevel: data.energyLevel ?? 5,
        stressLevel: data.stressLevel ?? 5,
        focusLevel: data.focusLevel ?? 5,
        targetCareer,
        onboardingComplete: true,
        updatedAt: new Date(),
      })
      .where(eq(userProfilesTable.sessionId, sessionId))
      .returning();
    profile = updated[0];
  } else {
    const created = await db
      .insert(userProfilesTable)
      .values({
        sessionId,
        name: data.name,
        interests: data.interests,
        skills: data.skills,
        education: data.education,
        status: data.status,
        weeklyLearningHours: data.weeklyLearningHours,
        goals: data.goals,
        energyLevel: data.energyLevel ?? 5,
        stressLevel: data.stressLevel ?? 5,
        focusLevel: data.focusLevel ?? 5,
        targetCareer,
        onboardingComplete: true,
      })
      .returning();
    profile = created[0];
  }

  // Seed initial skills
  await db.delete(skillProgressTable).where(eq(skillProgressTable.sessionId, sessionId));
  const skills = generateInitialSkills(data.interests, data.skills, targetCareer);
  if (skills.length) {
    await db.insert(skillProgressTable).values(
      skills.map(s => ({ sessionId, skillName: s.name, currentLevel: s.currentLevel, targetLevel: s.targetLevel, category: s.category, resources: s.resources }))
    );
  }

  // Seed initial weekly tasks
  await db.delete(tasksTable).where(eq(tasksTable.sessionId, sessionId));
  const tasks = generateWeeklyTasks(targetCareer, data.weeklyLearningHours, sessionId);
  if (tasks.length) {
    await db.insert(tasksTable).values(tasks.map(t => ({
      ...t,
      isWellnessBreak: t.isWellnessBreak ?? false,
    })));
  }

  res.status(201).json({
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
  });
});

export default router;
