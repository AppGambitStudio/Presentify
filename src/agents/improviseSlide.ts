import { parseJsonResponse } from "./parseResponse";
import { validateSlide } from "@/lib/validateSlide";
import { sendMessage } from "@/lib/ai";
import { COMPONENT_REFERENCE } from "./componentReference";
import type { Slide, PresentationConfig } from "@/lib/types";

export async function improviseSlide(
  guidance: string,
  currentSlide: Slide,
  config: PresentationConfig
): Promise<Slide> {
  const allSummaries = config.slides.map((s, i) =>
    `  ${i + 1}. ${s.title}${s.summary !== s.title ? ` — ${s.summary}` : ""}`
  ).join("\n");

  const systemPrompt = `You are a senior presentation architect. A user wants to IMPROVISE a slide — meaning significantly improve its quality, structure, and impact based on their guidance.

Unlike simple edits, improvisation can completely restructure the slide:
- Change the layout (e.g. from bullets to comparison table)
- Add or remove sections
- Rewrite content for more impact
- Change the visual approach entirely
- Add data, stats, or examples that were missing
- Fix tone mismatches

${COMPONENT_REFERENCE}

Think step by step:
1. Analyze the current slide: what works, what doesn't
2. Consider the user's guidance: what specifically do they want improved
3. Consider the presentation context: where does this slide sit in the narrative
4. Redesign the slide to be significantly better

Rules:
- Return the COMPLETE slide JSON (all fields)
- Keep the same id and number
- Update the summary to reflect the new content
- Use SPECIFIC facts and examples, not generic filler
- Keep content presentation-style: short, punchy
- BulletList items under 8 words, max 5 items
- All colors must be hex codes
- titleAccent must be a substring at END of title

Always respond with ONLY valid JSON, no markdown formatting or explanation.`;

  const userMessage = `PRESENTATION CONTEXT:
Title: "${config.title}"
Audience: ${config.audience}
Tone: ${config.tone.join(", ")}
Purpose: ${config.purpose}

SLIDE POSITION IN DECK:
${allSummaries}

CURRENT SLIDE (slide ${currentSlide.number}):
${JSON.stringify(currentSlide, null, 2)}

USER'S IMPROVISATION GUIDANCE:
"${guidance}"

Redesign this slide based on the guidance. Return the improved slide as JSON.`;

  const { text } = await sendMessage({
    role: "planning",
    system: systemPrompt,
    messages: [{ role: "user", content: userMessage }],
    maxTokens: 4096,
  });

  const raw = parseJsonResponse<any>(text);
  const improved = validateSlide({ ...raw, id: currentSlide.id, number: currentSlide.number });
  return improved;
}
