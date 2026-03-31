/**
 * Extract JSON from an AI response that may be wrapped in markdown code fences.
 * Handles: raw JSON, ```json ... ```, ``` ... ```
 */
export function parseJsonResponse<T>(text: string): T {
  let cleaned = text.trim();

  // Strip markdown code fences
  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json|JSON)?\s*\n?/, "")
      .replace(/\n?\s*```$/, "");
  }

  return JSON.parse(cleaned) as T;
}
