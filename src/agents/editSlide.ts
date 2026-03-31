import { parseJsonResponse } from "./parseResponse";
import { getAnthropicClient } from "./client";
import { COMPONENT_REFERENCE } from "./componentReference";
import type { Slide, PresentationConfig } from "@/lib/types";

export async function editSlide(
  message: string,
  currentSlide: Slide,
  config: PresentationConfig
): Promise<Slide> {
  const client = getAnthropicClient();

  const allSummaries = config.slides.map((s, i) => `  ${i + 1}. ${s.summary}`).join("\n");

  const systemPrompt = `You are a presentation slide editor. The user wants to modify a specific slide. You receive the current slide data and a user instruction. Return the COMPLETE updated slide as JSON.

${COMPONENT_REFERENCE}

Rules:
- Return the FULL slide JSON (not just the changed parts)
- Keep the same id, number, and summary unless the user explicitly asks to change them
- Keep content presentation-style: short, punchy, not essays
- BulletList items under 8 words each, max 5 items
- All color values must be hex codes (e.g. "#FF9900")
- titleAccent must be a substring at the END of title

Always respond with ONLY valid JSON, no markdown formatting or explanation.`;

  const userMessage = `Presentation: "${config.title}"
Audience: ${config.audience}
Tone: ${config.tone.join(", ")}

Full outline:
${allSummaries}

Current slide (slide ${currentSlide.number}):
${JSON.stringify(currentSlide, null, 2)}

User request: "${message}"

Return the updated slide as JSON.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") throw new Error("No response from edit agent");

  const updated = parseJsonResponse<Slide>(textBlock.text);
  // Preserve id and number
  updated.id = currentSlide.id;
  updated.number = currentSlide.number;
  return updated;
}
