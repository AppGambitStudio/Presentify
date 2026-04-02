/**
 * Web Search via Tavily API
 * Free tier: 1,000 searches/month
 * Sign up: https://tavily.com/
 *
 * Returns AI-summarized answers + source URLs for grounding presentation content.
 * Optional -- if TAVILY_API_KEY is not set, returns null gracefully.
 */

export interface SearchResult {
  answer: string;           // AI-summarized answer
  sources: { title: string; url: string; snippet: string }[];
}

export async function webSearch(query: string, maxResults: number = 5): Promise<SearchResult | null> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    console.log("[Search] TAVILY_API_KEY not set, skipping web search");
    return null;
  }

  try {
    console.log(`[Search] Tavily: "${query}"`);

    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: "basic",
        max_results: maxResults,
        include_answer: true,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[Search] Tavily error (${res.status}): ${err}`);
      return null;
    }

    const data = await res.json();

    return {
      answer: data.answer || "",
      sources: (data.results || []).map((r: any) => ({
        title: r.title || "",
        url: r.url || "",
        snippet: r.content?.substring(0, 200) || "",
      })),
    };
  } catch (err: any) {
    console.error(`[Search] Tavily failed: ${err.message}`);
    return null;
  }
}

/**
 * Search for facts/stats about a specific topic for presentation enrichment.
 * Returns a formatted string that can be injected into AI prompts.
 */
export async function searchForFacts(topic: string): Promise<string> {
  const result = await webSearch(`latest facts stats data about: ${topic}`);
  if (!result) return "";

  const lines: string[] = [];
  if (result.answer) {
    lines.push(`Research findings: ${result.answer}`);
  }
  if (result.sources.length > 0) {
    lines.push("Sources:");
    result.sources.slice(0, 3).forEach((s) => {
      lines.push(`  - ${s.title}: ${s.snippet}`);
    });
  }
  return lines.join("\n");
}
