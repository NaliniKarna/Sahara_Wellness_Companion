import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { chatMessagesTable, userProfilesTable, skillProgressTable, wellnessCheckinTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { getSessionId } from "../../lib/session";
import { SendChatMessageBody } from "@workspace/api-zod";
import { openai } from "@workspace/integrations-openai-ai-server";
import { randomUUID } from "crypto";

const router: IRouter = Router();

router.post("/chat/message", async (req, res) => {
  const sessionId = getSessionId(req);
  const { message } = SendChatMessageBody.parse(req.body);
  
  // Get user context
  const profiles = await db.select().from(userProfilesTable).where(eq(userProfilesTable.sessionId, sessionId)).limit(1);
  const profile = profiles[0];
  
  const recentWellness = await db.select().from(wellnessCheckinTable).where(eq(wellnessCheckinTable.sessionId, sessionId)).orderBy(desc(wellnessCheckinTable.createdAt)).limit(1);
  const wellness = recentWellness[0];
  
  const recentMessages = await db.select().from(chatMessagesTable).where(eq(chatMessagesTable.sessionId, sessionId)).orderBy(desc(chatMessagesTable.createdAt)).limit(10);
  
  // Save user message
  await db.insert(chatMessagesTable).values({
    sessionId,
    role: "user",
    content: message,
  });

  const systemPrompt = `You are Sahara, a warm, encouraging AI mentor for career development and wellness. You help students and professionals navigate their career journey with clarity, compassion, and practical advice.

${profile ? `User context:
- Name: ${profile.name || "the user"}
- Target career: ${profile.targetCareer || "not set"}
- Current skills: ${(profile.skills || []).join(", ") || "none listed"}
- Goals: ${profile.goals || "not set"}
- Status: ${profile.status || "unknown"}` : ""}

${wellness ? `Current wellness:
- Stress: ${wellness.stressLevel}/10
- Energy: ${wellness.energyLevel}/10  
- Focus: ${wellness.focusLevel}/10
${wellness.stressLevel >= 7 ? "NOTE: User is experiencing high stress. Be extra supportive and suggest immediate coping strategies." : ""}
${wellness.energyLevel <= 3 ? "NOTE: User has low energy. Suggest lighter activities and self-care." : ""}` : ""}

Your personality:
- Warm, encouraging, and non-judgmental
- Gives practical, actionable advice
- Acknowledges emotions before giving solutions
- Uses evidence-based career and wellness strategies
- Brief but substantive (2-4 paragraphs max)
- Uses occasional emojis to feel warm (not overwhelming)
- References the user's specific goals/career when relevant`;

  const messages = [
    { role: "system" as const, content: systemPrompt },
    ...recentMessages.reverse().map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user" as const, content: message },
  ];

  let aiResponse = "I'm here to help! Could you tell me more about what you're working through?";
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 600,
      messages,
    });
    aiResponse = response.choices[0]?.message?.content || aiResponse;
  } catch (e) {
    aiResponse = "I'm having trouble connecting right now. Please try again in a moment. Remember: whatever challenge you're facing, you have the capacity to work through it. 💙";
  }

  // Save assistant response
  await db.insert(chatMessagesTable).values({
    sessionId,
    role: "assistant",
    content: aiResponse,
  });

  const suggestions = [
    "How do I deal with imposter syndrome?",
    "What should I focus on this week?",
    "I'm feeling overwhelmed — help",
    "How long will it take to get a job?",
    "How do I build my portfolio?",
  ];

  res.json({
    message: {
      id: randomUUID(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date().toISOString(),
    },
    suggestions: suggestions.slice(0, 3),
  });
});

router.get("/chat/history", async (req, res) => {
  const sessionId = getSessionId(req);
  
  const messages = await db
    .select()
    .from(chatMessagesTable)
    .where(eq(chatMessagesTable.sessionId, sessionId))
    .orderBy(chatMessagesTable.createdAt)
    .limit(100);

  res.json({
    messages: messages.map(m => ({
      id: m.id.toString(),
      role: m.role,
      content: m.content,
      timestamp: m.createdAt?.toISOString() || new Date().toISOString(),
    })),
  });
});

export default router;
