# Sahara — AI Career & Wellness Companion

## Overview

A full-stack AI-powered career and wellness companion for students and professionals. Helps users gain career clarity, build skills, and maintain mental health through personalized recommendations, AI mentoring, and wellness tracking.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/sahara)
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **AI**: OpenAI via Replit AI Integrations (gpt-5.2)
- **UI**: Tailwind CSS, Shadcn UI, Framer Motion, Recharts
- **Build**: esbuild (CJS bundle)
- **Auth**: Session-based (sessionId in localStorage, X-Session-Id header)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── sahara/             # React + Vite frontend (preview path: /)
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   ├── db/                 # Drizzle ORM schema + DB connection
│   ├── integrations-openai-ai-server/  # OpenAI server integration
│   └── integrations-openai-ai-react/   # OpenAI React hooks
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Database Schema

- `user_profiles` — User onboarding data, career preferences, wellness settings
- `wellness_checkins` — Daily mood/stress/energy/focus check-ins
- `sahara_tasks` — Weekly action plan tasks
- `skill_progress` — Skill gap tracking with progress levels
- `sahara_chat_messages` — AI mentor chat history
- `conversations` / `messages` — OpenAI integration tables

## API Routes (all under /api/)

- `GET/PUT /users/profile` — User profile CRUD
- `POST /onboarding` — Submit onboarding, seeds skills and tasks
- `GET /career/recommendations` — AI-generated career paths (OpenAI)
- `GET /career/reality-simulator/:careerId` — Day-in-the-life simulation
- `GET /career/probability/:careerId` — Success probability engine
- `GET /skills/gaps` — Skill gap analysis and milestones
- `POST /skills/update` — Update skill progress level
- `GET/POST /wellness/checkin` — Wellness check-in and recommendations
- `GET /wellness/mood-history` — 7-14 day mood history
- `GET /tasks/weekly-plan` — Adaptive weekly action plan
- `POST /tasks/:id/complete|uncomplete` — Toggle task completion
- `POST /chat/message` — AI mentor chat (OpenAI gpt-5.2)
- `GET /chat/history` — Chat message history
- `GET /jobmarket` — Job market trends and intelligence
- `GET /dashboard` — Combined dashboard overview

## Frontend Pages

1. `/` — Landing Page (hero, features, CTA)
2. `/onboarding` — 5-step profile builder wizard
3. `/dashboard` — Overview: career progress, streak, wellness, tasks
4. `/career` — AI career recommendations with match scores
5. `/reality-simulator/:id` — Day-in-the-life career simulator
6. `/probability/:id` — Career success probability gauge
7. `/skills` — Career GPS skill gap tracker
8. `/weekly-plan` — Interactive weekly action plan checklist
9. `/chat` — AI mentor chat interface
10. `/wellness` — Daily wellness check-in + exercises
11. `/jobs` — Job market intelligence dashboard
12. `/focus` — Brain focus coach
13. `/procrastination` — Anti-procrastination atomic tasks
14. `/myths` — Expectation vs Reality myth debunker
15. `/mental-health` — Mental health support and mood history

## Key Design Decisions

- Session-based auth: no login required, sessionId in localStorage sent as `X-Session-Id` header
- Onboarding automatically infers best target career from interests/goals
- Skills and weekly tasks seeded after onboarding based on target career
- All AI responses use OpenAI gpt-5.2 via Replit AI Integrations (no user API key needed)
- Calm blue palette (#D0E7FF, #B0D4FF), Poppins/Inter fonts

## Running

- Frontend: `pnpm --filter @workspace/sahara run dev`
- API: `pnpm --filter @workspace/api-server run dev`
- DB push: `pnpm --filter @workspace/db run push`
- Codegen: `pnpm --filter @workspace/api-spec run codegen`
