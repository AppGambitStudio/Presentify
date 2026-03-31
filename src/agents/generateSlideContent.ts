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
  const userMessage = [
    `Presentation: "${intake.title}"`,
    `Audience: ${intake.audience}`,
    `Tone: ${intake.tone.join(", ")}`,
    `Purpose: ${intake.purpose}`,
    ``,
    `This is slide ${outlineItem.number} of ${totalSlides}.`,
    `Slide summary: "${outlineItem.summary}"`,
    ``,
    `Full outline for context:`,
    ...allSummaries.map((s, i) => `  ${i + 1}. ${s}${i + 1 === outlineItem.number ? " <-- THIS SLIDE" : ""}`),
  ].join("\n");
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: buildSonnetSlidePrompt(themeJson),
    messages: [{ role: "user", content: userMessage }],
  });
  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") throw new Error(`No text response for slide ${outlineItem.number}`);
  const slideData = JSON.parse(textBlock.text);
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
