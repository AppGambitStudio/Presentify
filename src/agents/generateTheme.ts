import { parseJsonResponse } from "./parseResponse";
import { getAnthropicClient } from "./client";
import { SONNET_THEME_PROMPT } from "./prompts";
import type { IntakeFormData, ThemeConfig } from "@/lib/types";

export async function generateTheme(intake: IntakeFormData): Promise<ThemeConfig> {
  const client = getAnthropicClient();
  const userMessage = [
    `Topic: ${intake.title}`,
    `Audience: ${intake.audience}`,
    `Tone: ${intake.tone.join(", ")}`,
    intake.primaryColor ? `User wants primary color: ${intake.primaryColor}` : "Choose primary color based on topic.",
    intake.accentColor ? `User wants accent color: ${intake.accentColor}` : "Choose accent color to complement primary.",
  ].join("\n");
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: SONNET_THEME_PROMPT,
    messages: [{ role: "user", content: userMessage }],
  });
  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") throw new Error("No text response from theme generation");
  return parseJsonResponse<ThemeConfig>(textBlock.text);
}
