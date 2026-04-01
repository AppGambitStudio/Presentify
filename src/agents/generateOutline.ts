import { parseJsonResponse } from "./parseResponse";
import { getAnthropicClient } from "./client";
import { OPUS_SYSTEM_PROMPT } from "./prompts";
import type { IntakeFormData, OutlineItem } from "@/lib/types";

function buildUserMessage(intake: IntakeFormData): string {
  const parts = [
    `Title: ${intake.title}`,
    `Speaker: ${intake.speakerName}${intake.speakerRole ? `, ${intake.speakerRole}` : ""}${intake.speakerOrganization ? ` at ${intake.speakerOrganization}` : ""}`,
    `Audience: ${intake.audience}`,
    `Purpose: ${intake.purpose}`,
    `Duration: ${intake.duration} minutes`,
    `Tone: ${intake.tone.join(", ")}`,
  ];
  if (intake.keyPoints.trim()) parts.push(`Key Points to cover: ${intake.keyPoints}`);
  if (intake.dos.trim()) parts.push(`DO emphasize: ${intake.dos}`);
  if (intake.donts.trim()) parts.push(`DON'T include: ${intake.donts}`);
  if (intake.maxSlides > 0) parts.push(`Maximum slides: ${intake.maxSlides} (hard limit, do not exceed)`);
  return parts.join("\n");
}

export async function generateOutline(intake: IntakeFormData): Promise<OutlineItem[]> {
  const client = getAnthropicClient();
  const response = await client.messages.create({
    model: "claude-opus-4-20250514",
    max_tokens: 4096,
    system: OPUS_SYSTEM_PROMPT,
    messages: [{ role: "user", content: buildUserMessage(intake) }],
  });
  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") throw new Error("No text response from outline generation");
  const outline: OutlineItem[] = parseJsonResponse(textBlock.text);
  if (!Array.isArray(outline) || outline.length === 0) throw new Error("Invalid outline format");

  // Preserve all rich fields from Opus, renumber
  return outline.map((item, i) => ({
    number: i + 1,
    summary: item.summary,
    keyMessage: item.keyMessage,
    talkingPoints: item.talkingPoints,
    suggestedComponents: item.suggestedComponents,
    tone: item.tone,
  }));
}
