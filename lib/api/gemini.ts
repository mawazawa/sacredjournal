/**
 * Gemini API Integration
 * Handles real-time AI coaching and conversation
 */

interface GeminiRequest {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
  personality?: Record<string, unknown>;
  systemPrompt?: string;
}

interface GeminiResponse {
  content: string;
  role: "assistant";
  stop_reason?: string;
}

export async function getGeminiCoaching(
  request: GeminiRequest
): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.NEXT_PUBLIC_GEMINI_MODEL || "gemini-3-pro";

  if (!apiKey) {
    throw new Error("Gemini API key not configured");
  }

  // This is a placeholder implementation
  // In production, use the actual Gemini API
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/" +
      model +
      ":generateContent",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: request.messages.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
        systemInstruction: {
          parts: [
            {
              text:
                request.systemPrompt ||
                getPersonalityAwareSystemPrompt(request.personality),
            },
          ],
        },
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content =
    data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";

  return {
    content,
    role: "assistant",
  };
}

export function getPersonalityAwareSystemPrompt(
  personality?: Record<string, unknown>
): string {
  const basePrompt = `You are Sacred Journal, a compassionate AI coaching assistant specializing in journaling and personal growth.
Your role is to help users gain insights about themselves, identify patterns in their thinking, and support their personal development goals.

Key characteristics:
- Ask thoughtful, open-ended questions to help users explore their thoughts and feelings
- Provide personalized coaching based on the user's personality type
- Help identify patterns and recurring themes in their journaling
- Suggest actionable steps for personal growth and goal achievement
- Maintain a supportive, non-judgmental tone
- Adapt your communication style to the user's personality preferences`;

  if (!personality) {
    return basePrompt;
  }

  // Add personality-specific guidance
  const personalityGuidance = buildPersonalityGuidance(personality);
  return basePrompt + "\n\n" + personalityGuidance;
}

function buildPersonalityGuidance(personality: Record<string, unknown>): string {
  const traits = personality as Record<string, number>;

  let guidance =
    "Communication preferences based on their personality profile:\n";

  // Big Five traits
  if (traits.openness) {
    guidance += `- ${traits.openness > 0.5 ? "They enjoy exploring new ideas and abstract concepts. Use imaginative examples." : "They prefer concrete, practical advice. Focus on real-world applications."}\n`;
  }

  if (traits.conscientiousness) {
    guidance += `- ${traits.conscientiousness > 0.5 ? "They value organization and planning. Help them create structured action plans." : "They prefer flexibility and spontaneity. Allow room for change and adaptation."}\n`;
  }

  if (traits.extraversion) {
    guidance += `- ${traits.extraversion > 0.5 ? "They may enjoy discussing their social connections. Explore relationship patterns." : "They prefer deeper, more introspective conversations. Focus on internal insights."}\n`;
  }

  if (traits.agreeableness) {
    guidance += `- ${traits.agreeableness > 0.5 ? "They're responsive to emotional appeals and relationship-focused guidance (Pathos)." : "They prefer logical reasoning and objective analysis (Logos)."}\n`;
  }

  if (traits.neuroticism) {
    guidance += `- ${traits.neuroticism > 0.5 ? "Emphasize stability, coping strategies, and emotional regulation techniques." : "They handle stress well. Focus on growth and achievement."}\n`;
  }

  return guidance;
}
