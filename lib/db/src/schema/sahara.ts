import { pgTable, text, serial, integer, real, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userProfilesTable = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  name: text("name"),
  interests: jsonb("interests").$type<string[]>().default([]),
  skills: jsonb("skills").$type<string[]>().default([]),
  education: text("education"),
  status: text("status"),
  weeklyLearningHours: real("weekly_learning_hours").default(5),
  goals: text("goals"),
  energyLevel: integer("energy_level").default(5),
  stressLevel: integer("stress_level").default(5),
  focusLevel: integer("focus_level").default(5),
  targetCareer: text("target_career"),
  onboardingComplete: boolean("onboarding_complete").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const wellnessCheckinTable = pgTable("wellness_checkins", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  stressLevel: integer("stress_level").notNull(),
  energyLevel: integer("energy_level").notNull(),
  focusLevel: integer("focus_level").notNull(),
  moodScore: integer("mood_score").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tasksTable = pgTable("sahara_tasks", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  priority: text("priority").notNull().default("medium"),
  completed: boolean("completed").default(false),
  dueDate: text("due_date"),
  estimatedMinutes: integer("estimated_minutes").default(30),
  isWellnessBreak: boolean("is_wellness_break").default(false),
  weekStart: text("week_start").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const skillProgressTable = pgTable("skill_progress", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  skillName: text("skill_name").notNull(),
  currentLevel: real("current_level").default(0),
  targetLevel: real("target_level").default(100),
  category: text("category").notNull(),
  resources: jsonb("resources").$type<string[]>().default([]),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chatMessagesTable = pgTable("sahara_chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserProfileSchema = createInsertSchema(userProfilesTable).omit({ id: true, createdAt: true, updatedAt: true });
export const insertWellnessCheckinSchema = createInsertSchema(wellnessCheckinTable).omit({ id: true, createdAt: true });
export const insertTaskSchema = createInsertSchema(tasksTable).omit({ id: true, createdAt: true });
export const insertSkillProgressSchema = createInsertSchema(skillProgressTable).omit({ id: true, updatedAt: true });
export const insertChatMessageSchema = createInsertSchema(chatMessagesTable).omit({ id: true, createdAt: true });

export type UserProfile = typeof userProfilesTable.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type WellnessCheckin = typeof wellnessCheckinTable.$inferSelect;
export type Task = typeof tasksTable.$inferSelect;
export type SkillProgress = typeof skillProgressTable.$inferSelect;
export type SaharaChatMessage = typeof chatMessagesTable.$inferSelect;
