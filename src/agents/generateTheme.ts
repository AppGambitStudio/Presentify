import { parseJsonResponse } from "./parseResponse";
import { sendMessage } from "@/lib/ai";
import { THEME_SYSTEM_PROMPT } from "./prompts";
import type { IntakeFormData, ThemeConfig } from "@/lib/types";
import { getPaletteById } from "@/lib/palettes";

export async function generateTheme(intake: IntakeFormData): Promise<ThemeConfig> {
  // If a palette was selected, use it directly -- no AI call needed
  if (intake.paletteId) {
    const palette = getPaletteById(intake.paletteId);
    if (palette) return palette.theme;
  }

  const userMessage = [
    `Topic: ${intake.title}`,
    `Audience: ${intake.audience}`,
    `Tone: ${intake.tone.join(", ")}`,
    intake.primaryColor ? `User wants primary color: ${intake.primaryColor}` : "Choose primary color based on topic.",
    intake.accentColor ? `User wants accent color: ${intake.accentColor}` : "Choose accent color to complement primary.",
  ].join("\n");

  const { text } = await sendMessage({
    role: "generation",
    system: THEME_SYSTEM_PROMPT,
    messages: [{ role: "user", content: userMessage }],
    maxTokens: 1024,
  });

  return parseJsonResponse<ThemeConfig>(text);
}
