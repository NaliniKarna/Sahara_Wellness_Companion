**Sahara - AI Career & Wellness Companion**
“From confusion to clarity - your career, your path.”

Sahara is a full-stack web application designed to help students and professionals navigate their career journey while maintaining mental health and wellbeing.
It combines AI-driven career guidance, real-world insights, and wellness support into one unified platform.


🚀 Features
•	🤖AI Career Recommendations
Personalized career paths based on skills, interests, and goals 
•	🎯 Skill GPS
Track skill gaps and milestones toward your target career 
•	📅 Weekly Action Plan
AI-generated tasks balancing learning and mental wellness 
•	💬 AI Mentor Chat
Conversational AI for career guidance, productivity, and stress support 
•	🌍 Reality Simulator
“Day in the life” preview of careers with real expectations 
•	📊 Probability Calculator
Success likelihood with improvement suggestions 
•	📈 Job Market Intelligence
Insights into demand, skills, and salary trends 
•	🧠 Wellness Center
Daily mood, stress, and energy tracking with AI insights 
•	👥 Community Support
Peer feed with posts, likes, and shared experiences 
•	⏱️ Focus Coach
Pomodoro timer + anti-procrastination task manager 
•	🔍 Reality Check
Debunks career myths with evidence-based insights 
•	⚙️ Settings & Personalization
Profile, goals, notifications, and privacy controls 

Tech Stack
Frontend (artifacts/sahara)
•	React + TypeScript 
•	Vite 
•	Tailwind CSS v4 
•	Framer Motion 
•	Wouter (routing) 
•	TanStack Query 
•	Recharts 
Backend (artifacts/api-server)
•	Node.js + Express 
•	TypeScript 
•	PostgreSQL (Replit DB) 
•	Drizzle ORM 
•	OpenAI-compatible API (Replit AI) 

Getting Started
This project uses pnpm workspaces.
Manual Start
# Start API Server
pnpm --filter @workspace/api-server run dev

# Start Frontend
pnpm --filter @workspace/sahara run dev

Environment Variables
Variable	Description
DATABASE_URL	PostgreSQL connection string
SESSION_SECRET	Secret for session authentication

📁 Project Structure
artifacts/
  api-server/          
    src/
      routes/sahara/   
      db/              
  sahara/              
    src/
      pages/           
      components/      
      lib/             

packages/
  api-client/          
  api-client-react/    

Navigation
Route	Page
/	Landing Page
/onboarding	Onboarding Wizard
/dashboard	Main Dashboard
/career	Career Recommendations
/reality-simulator/:id	Reality Simulator
/probability/:id	Success Probability
/skills	Skill GPS
/weekly-plan	Weekly Plan
/chat	AI Mentor Chat
/wellness	Wellness & Community
/jobs	Job Market Intelligence
/focus	Focus Coach
/myths	Reality Check
/mental-health	Mental Health Support
/settings	Profile & Preferences

Authentication
•	Session-based authentication 
•	Secure cookie handling 
•	User-specific data protection 

Vision
Sahara aims to become a holistic career + mental wellness platform, helping users:
•	Make better career decisions 
•	Stay consistent and focused 
•	Avoid burnout and confusion 
•	Grow with clarity and confidence
