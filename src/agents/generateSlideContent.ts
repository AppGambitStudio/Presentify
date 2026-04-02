import { parseJsonResponse } from "./parseResponse";
import { sendMessage } from "@/lib/ai";
import { buildSlideGenerationPrompt } from "./prompts";
import { validateSlide } from "@/lib/validateSlide";
import type { OutlineItem, ThemeConfig, Slide } from "@/lib/types";

export async function generateSlideContent(
  outlineItem: OutlineItem,
  theme: ThemeConfig,
  totalSlides: number,
  allSummaries: string[],
  intake: { title: string; audience: string; tone: string[]; purpose: string }
): Promise<Omit<Slide, "id">> {
  const themeJson = JSON.stringify(theme, null, 2);

  const lines = [
    `Presentation: "${intake.title}"`,
    `Audience: ${intake.audience}`,
    `Overall tone: ${intake.tone.join(", ")}`,
    `Purpose: ${intake.purpose}`,
    ``,
    `--- THIS SLIDE (${outlineItem.number} of ${totalSlides}) ---`,
    `Summary: ${outlineItem.summary}`,
    outlineItem.slideType ? `Slide type: ${outlineItem.slideType} (generate content appropriate for this type)` : "",
  ].filter(Boolean);

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

  const { text } = await sendMessage({
    role: "generation",
    system: buildSlideGenerationPrompt(themeJson),
    messages: [{ role: "user", content: lines.join("\n") }],
    maxTokens: 2048,
  });

  const slideData = parseJsonResponse<any>(text);
  // Validate and sanitize -- fixes common AI output issues
  const validated = validateSlide({
    ...slideData,
    id: `temp_${outlineItem.number}`,
    number: outlineItem.number,
    summary: outlineItem.summary,
  });
  return validated;
}
