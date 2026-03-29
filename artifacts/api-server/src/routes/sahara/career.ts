import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { userProfilesTable, skillProgressTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { getSessionId } from "../../lib/session";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

const careerDatabase: Record<string, any> = {
  "software-engineer": {
    id: "software-engineer",
    title: "Software Engineer",
    whyItFits: "Your analytical mindset and interest in building things makes you a natural fit for software engineering. The logical problem-solving nature of coding aligns perfectly with your profile.",
    difficulty: "Medium",
    requiredSkills: ["Python or JavaScript", "Data Structures", "Algorithms", "Git", "System Design"],
    marketDemand: "Very High",
    salaryRange: "$90k - $180k",
    matchScore: 92,
  },
  "data-scientist": {
    id: "data-scientist",
    title: "Data Scientist",
    whyItFits: "Your curiosity about patterns and insights, combined with analytical thinking, positions you well for data science. The field rewards structured thinking and continuous learning.",
    difficulty: "Medium-High",
    requiredSkills: ["Python", "Statistics", "Machine Learning", "SQL", "Data Visualization"],
    marketDemand: "High",
    salaryRange: "$95k - $175k",
    matchScore: 87,
  },
  "ux-designer": {
    id: "ux-designer",
    title: "UX Designer",
    whyItFits: "Your empathy and creative instincts make UX design a strong match. The field combines psychology, design thinking, and technology — a perfect blend for your profile.",
    difficulty: "Medium",
    requiredSkills: ["Figma", "User Research", "Prototyping", "Design Thinking", "Information Architecture"],
    marketDemand: "High",
    salaryRange: "$75k - $145k",
    matchScore: 84,
  },
  "product-manager": {
    id: "product-manager",
    title: "Product Manager",
    whyItFits: "Your ability to see the big picture while managing details makes you a natural product leader. PMs sit at the intersection of business, tech, and design — where you thrive.",
    difficulty: "Medium-High",
    requiredSkills: ["Product Strategy", "Data Analysis", "Communication", "Agile", "Market Research"],
    marketDemand: "High",
    salaryRange: "$100k - $200k",
    matchScore: 81,
  },
};

const realityData: Record<string, any> = {
  "software-engineer": {
    careerTitle: "Software Engineer",
    dailyTasks: [
      "Review and respond to pull request comments",
      "Attend 30-min daily standup meeting",
      "Write and test feature code (3-5 hours)",
      "Debug reported issues from QA or users",
      "Read technical documentation and research solutions",
      "Update tickets in project management tool",
    ],
    workEnvironment: "Mostly remote or hybrid. Collaborative but independent. Lots of deep focus work with occasional meetings.",
    effortLevel: "High — you'll spend 3-6 hours daily in deep coding focus. Requires continuous learning of new technologies.",
    timeline: "6-18 months to land first role (depending on prior experience). 2-4 years to become mid-level. 5+ years for senior.",
    challenges: [
      "Imposter syndrome is very common — everyone feels it",
      "Debugging can be frustrating and time-consuming",
      "Keeping up with rapidly changing technology",
      "Code reviews can feel like personal criticism at first",
    ],
    typicalDay: "Morning: coffee and emails. 10am standup. Then 3 hours of coding your current feature. Lunch break. Afternoon: code reviews, debugging, documentation. End of day: update your tickets and plan tomorrow.",
    salaryJourney: "Junior: $75-95k → Mid-level (3-5yr): $110-150k → Senior (5-8yr): $150-220k → Staff/Principal: $200k+",
    burnoutRisk: "Moderate — deadlines and on-call rotations can be stressful. Good companies invest in work-life balance.",
  },
  "data-scientist": {
    careerTitle: "Data Scientist",
    dailyTasks: [
      "Explore and clean raw datasets (often messy!)",
      "Build and test predictive models",
      "Create visualizations and dashboards",
      "Write SQL queries to extract insights",
      "Present findings to business stakeholders",
      "Collaborate with engineers to deploy models",
    ],
    workEnvironment: "Hybrid or remote. Blend of solo analysis and stakeholder presentations. Collaborative with both technical and non-technical teams.",
    effortLevel: "High — data cleaning alone takes 60-80% of time. Requires patience and systematic thinking.",
    timeline: "8-24 months to first role. Strong portfolio (Kaggle, projects) can accelerate this significantly.",
    challenges: [
      "Data is often messy, incomplete, or wrong",
      "Translating insights for non-technical audiences",
      "Model deployment is harder than building models",
      "Expectations can be unrealistic — 'AI will solve everything'",
    ],
    typicalDay: "Morning: check experiment results from overnight runs. Review stakeholder requests. 2-3 hours of data wrangling. Afternoon: model iteration, creating visualizations. Late day: stakeholder sync or presentation prep.",
    salaryJourney: "Junior: $85-105k → Mid-level: $120-155k → Senior: $150-200k → ML Engineering/Research: $200k+",
    burnoutRisk: "Moderate — pressure to deliver 'impossible' insights from bad data is common. Find a company that values data quality.",
  },
  "ux-designer": {
    careerTitle: "UX Designer",
    dailyTasks: [
      "Conduct user interviews and usability tests",
      "Create wireframes and low-fidelity prototypes",
      "Design high-fidelity screens in Figma",
      "Review designs with product and engineering",
      "Iterate on feedback and revise designs",
      "Document design decisions and patterns",
    ],
    workEnvironment: "Creative and collaborative. Lots of feedback loops. Close work with product managers and developers.",
    effortLevel: "Medium — creative work is mentally demanding. Managing stakeholder feedback requires strong communication skills.",
    timeline: "6-18 months with portfolio. Building portfolio projects is the key to entry. Many bootcamp graduates land roles in 6-9 months.",
    challenges: [
      "Constant feedback and iteration can feel never-ending",
      "Engineering constraints often limit design vision",
      "Advocating for users vs. business needs is ongoing tension",
      "Portfolio building requires significant self-directed effort",
    ],
    typicalDay: "Morning: design review with team. Review user research findings. Afternoon: Figma design session for current feature. Late day: sync with engineers on implementation questions.",
    salaryJourney: "Junior: $65-85k → Mid-level: $90-120k → Senior: $120-160k → Principal/Director: $150k+",
    burnoutRisk: "Low-Moderate — creative work is rewarding but feedback-heavy cultures can drain energy. Good culture fit matters a lot.",
  },
  "product-manager": {
    careerTitle: "Product Manager",
    dailyTasks: [
      "Triage and prioritize incoming feature requests",
      "Write or refine product requirements documents",
      "Run sprint planning and stakeholder syncs",
      "Analyze product metrics and user behavior",
      "Coordinate between engineering, design, and business",
      "Define success metrics for current features",
    ],
    workEnvironment: "Meeting-heavy. PM is the glue between all teams. Requires context-switching and managing ambiguity.",
    effortLevel: "High — you own outcomes without directly controlling how they're built. Requires strong influence skills.",
    timeline: "Hard to break in directly. Most PMs come from engineering, design, or business. APM programs at big companies are competitive but accessible.",
    challenges: [
      "You're responsible for outcomes you don't control",
      "Constant prioritization decisions under uncertainty",
      "Managing stakeholders with competing interests",
      "PMs rarely write code — requires trust in engineering",
    ],
    typicalDay: "9am: daily standup with engineering. 10am: stakeholder meeting about roadmap. Noon: review product metrics. Afternoon: PRD writing and design reviews. Late day: customer calls and strategy planning.",
    salaryJourney: "APM: $100-130k → PM: $130-170k → Senior PM: $160-220k → Director/VP Product: $200k+",
    burnoutRisk: "High — the pressure of owning outcomes without authority can be stressful. Strong company culture is critical.",
  },
};

function getCareerData(careerId: string) {
  if (careerDatabase[careerId]) return careerDatabase[careerId];
  // Fallback to software engineer
  return { ...careerDatabase["software-engineer"], id: careerId, title: careerId.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) };
}

router.get("/career/recommendations", async (req, res) => {
  const sessionId = getSessionId(req);
  
  const profiles = await db.select().from(userProfilesTable).where(eq(userProfilesTable.sessionId, sessionId)).limit(1);
  
  let recommendations;
  if (profiles.length && profiles[0].interests && profiles[0].interests.length > 0) {
    const profile = profiles[0];
    const interests = profile.interests || [];
    const skills = profile.skills || [];
    const goals = profile.goals || "";
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-5.2",
        max_completion_tokens: 1500,
        messages: [
          {
            role: "system",
            content: "You are a career counselor. Return ONLY valid JSON. No markdown, no explanation.",
          },
          {
            role: "user",
            content: `Based on this profile, recommend exactly 2 career paths. Return JSON array:
Interests: ${interests.join(", ")}
Skills: ${skills.join(", ")}
Education: ${profile.education}
Goals: ${goals}

Return: [{"id": "slug-id", "title": "Career Title", "whyItFits": "2-3 sentences why", "difficulty": "Low|Medium|Medium-High|High", "requiredSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"], "marketDemand": "Low|Medium|High|Very High", "salaryRange": "$Xk - $Yk", "matchScore": 0-100}]`,
          },
        ],
      });
      
      const content = response.choices[0]?.message?.content || "[]";
      recommendations = JSON.parse(content);
    } catch (e) {
      recommendations = [careerDatabase["software-engineer"], careerDatabase["data-scientist"]];
    }
  } else {
    recommendations = [careerDatabase["software-engineer"], careerDatabase["data-scientist"]];
  }

  res.json({ recommendations });
});

router.get("/career/reality-simulator/:careerId", async (req, res) => {
  const { careerId } = req.params;
  const data = realityData[careerId] || realityData["software-engineer"];
  res.json({ careerId, ...data });
});

router.get("/career/probability/:careerId", async (req, res) => {
  const sessionId = getSessionId(req);
  const { careerId } = req.params;
  
  const profiles = await db.select().from(userProfilesTable).where(eq(userProfilesTable.sessionId, sessionId)).limit(1);
  const skillsData = await db.select().from(skillProgressTable).where(eq(skillProgressTable.sessionId, sessionId));
  
  const profile = profiles[0];
  const avgSkillLevel = skillsData.length > 0 
    ? skillsData.reduce((sum, s) => sum + (s.currentLevel || 0), 0) / skillsData.length 
    : 30;
  
  const weeklyHours = profile?.weeklyLearningHours || 5;
  const baseProb = Math.min(95, 40 + (avgSkillLevel * 0.4) + (weeklyHours * 2));
  
  const careerData = getCareerData(careerId);
  
  res.json({
    careerId,
    careerTitle: careerData.title || careerId,
    successProbability: Math.round(baseProb),
    requiredEffort: weeklyHours >= 15 ? "High" : weeklyHours >= 8 ? "Medium" : "Low",
    suggestedLearningTime: `${Math.max(3, Math.round(12 - weeklyHours * 0.5))} months`,
    keyFactors: [
      `Your ${Math.round(avgSkillLevel)}% average skill level gives a solid foundation`,
      `${weeklyHours}h/week learning commitment ${weeklyHours >= 10 ? "is excellent" : "can be improved"}`,
      profile?.education ? `${profile.education} background is ${profile.education.includes("Computer") || profile.education.includes("Engineering") ? "directly relevant" : "transferable"}` : "Diverse background adds perspective",
      `Market demand for ${careerData.title || careerId} is ${careerData.marketDemand || "High"}`,
    ],
    improvementTips: [
      "Complete 2-3 portfolio projects to demonstrate skills",
      "Network on LinkedIn — 70% of jobs are filled through connections",
      `Increase weekly study time to ${Math.min(20, weeklyHours + 5)}h to accelerate progress`,
      "Join communities like Discord servers or local meetups",
    ],
  });
});

export default router;
