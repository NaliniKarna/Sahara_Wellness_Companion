import { Router, type IRouter } from "express";

const router: IRouter = Router();

const jobMarketData = {
  trending: [
    {
      title: "AI/ML Engineer",
      demandLevel: "Very High",
      avgSalary: "$140k - $220k",
      growthRate: "+35% YoY",
      topSkills: ["Python", "PyTorch", "LLMs", "MLOps", "Data Engineering"],
    },
    {
      title: "Full-Stack Developer",
      demandLevel: "Very High",
      avgSalary: "$100k - $175k",
      growthRate: "+22% YoY",
      topSkills: ["React", "Node.js", "PostgreSQL", "AWS", "TypeScript"],
    },
    {
      title: "Cloud Solutions Architect",
      demandLevel: "High",
      avgSalary: "$130k - $210k",
      growthRate: "+28% YoY",
      topSkills: ["AWS", "Azure", "Kubernetes", "Terraform", "Security"],
    },
    {
      title: "Data Engineer",
      demandLevel: "High",
      avgSalary: "$110k - $185k",
      growthRate: "+25% YoY",
      topSkills: ["Python", "Spark", "dbt", "SQL", "Airflow"],
    },
    {
      title: "Product Manager",
      demandLevel: "High",
      avgSalary: "$120k - $195k",
      growthRate: "+18% YoY",
      topSkills: ["Strategy", "Analytics", "Agile", "Stakeholder Mgmt", "SQL"],
    },
    {
      title: "Cybersecurity Analyst",
      demandLevel: "Very High",
      avgSalary: "$95k - $165k",
      growthRate: "+32% YoY",
      topSkills: ["Security+", "SIEM", "Penetration Testing", "Risk Assessment", "Python"],
    },
  ],
  insights: [
    "AI skills add 30-50% salary premium across ALL technical roles in 2025",
    "Remote work stabilized at ~60% of tech jobs — negotiate it by default",
    "SQL remains the #1 most in-demand skill across data, product, and engineering",
    "Bootcamp graduates are being hired — portfolio quality trumps credentials",
    "Cybersecurity has 3.5 million unfilled roles globally — massive opportunity",
    "Soft skills (communication, ownership) differentiate candidates more than ever",
  ],
  topIndustries: [
    "Artificial Intelligence & ML",
    "FinTech & DeFi", 
    "Health Tech & BioTech",
    "Climate Tech",
    "EdTech & Learning Platforms",
    "Cybersecurity",
    "Cloud Infrastructure",
  ],
};

router.get("/jobmarket", (_req, res) => {
  res.json(jobMarketData);
});

export default router;
