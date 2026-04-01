import { parseJsonResponse } from "./parseResponse";
import { getAnthropicClient } from "./client";
import { buildSonnetSlidePrompt } from "./prompts";
import type { OutlineItem, ThemeConfig, Slide } from "@/lib/types";

export async function generateSlideContent(
  outlineItem: OutlineItem,
  theme: ThemeConfig,
  totalSlides: number,
  allSummaries: string[],
  intake: { title: string; audience: string; tone: string[]; purpose: string }
): Promise<Omit<Slide, "id">> {
  const client = getAnthropicClient();
  const themeJson = JSON.stringify(theme, null, 2);

  // Build a rich context message with all the detail Opus provided
  const lines = [
    `Presentation: "${intake.title}"`,
    `Audience: ${intake.audience}`,
    `Overall tone: ${intake.tone.join(", ")}`,
    `Purpose: ${intake.purpose}`,
    ``,
    `--- THIS SLIDE (${outlineItem.number} of ${totalSlides}) ---`,
    `Summary: ${outlineItem.summary}`,
  ];

  if (outlineItem.keyMessage) {
    lines.push(`Key message (the ONE thing audience remembers): ${outlineItem.keyMessage}`);
  }
  if (outlineItem.talkingPoints && outlineItem.talkingPoints.length > 0) {
    lines.push(`Talking points (USE these specific facts/examples):`);
    outlineItem.talkingPoints.forEach((tp) => lines.push(`  • ${tp}`));
  }
  if (outlineItem.suggestedComponents) {
    lines.push(`Suggested visual structure: ${outlineItem.suggestedComponents}`);
  }
  if (outlineItem.tone) {
    lines.push(`This slide's tone: ${outlineItem.tone}`);
  }

  lines.push(``);
  lines.push(`Full outline for narrative context:`);
  allSummaries.forEach((s, i) => {
    lines.push(`  ${i + 1}. ${s}${i + 1 === outlineItem.number ? " ◀ YOU ARE HERE" : ""}`);
  });

  const userMessage = lines.join("\n");

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: buildSonnetSlidePrompt(themeJson),
    messages: [{ role: "user", content: userMessage }],
  });
  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") throw new Error(`No text response for slide ${outlineItem.number}`);
  const slideData = parseJsonResponse<any>(textBlock.text);
  return {
    number: outlineItem.number,
    summary: outlineItem.summary,
    title: slideData.title || outlineItem.summary,
    titleAccent: slideData.titleAccent,
    subtitle: slideData.subtitle,
    sections: slideData.sections || [],
    speakerNotes: slideData.speakerNotes || "",
    decorations: slideData.decorations || [],
  };
}
