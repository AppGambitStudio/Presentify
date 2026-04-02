/**
 * Unified AI Provider Layer
 *
 * Routes AI requests to Anthropic, OpenRouter, or Ollama based on env config.
 * All agents call sendMessage() instead of provider-specific clients.
 */

export type AIRole = "planning" | "generation";

interface AIMessage {
  role: "user" | "assistant";
  content: string;
}

interface AIRequest {
  role: AIRole;              // which task role (determines model)
  system: string;            // system prompt
  messages: AIMessage[];     // conversation
  maxTokens?: number;        // max output tokens
}

interface AIResponse {
  text: string;
}

// --- Config from env ---

type AIProvider = "anthropic" | "openrouter" | "ollama";

function getProvider(): AIProvider {
  return (process.env.AI_PROVIDER as AIProvider) || "anthropic";
}

function getModelForRole(role: AIRole): string {
  if (role === "planning") {
    return process.env.AI_MODEL_PLANNING || getDefaultPlanningModel();
  }
  return process.env.AI_MODEL_GENERATION || getDefaultGenerationModel();
}

function getDefaultPlanningModel(): string {
  const provider = getProvider();
  switch (provider) {
    case "anthropic": return "claude-opus-4-20250514";
    case "openrouter": return "anthropic/claude-opus-4";
    case "ollama": return "llama3.3";
  }
}

function getDefaultGenerationModel(): string {
  const provider = getProvider();
  switch (provider) {
    case "anthropic": return "claude-sonnet-4-20250514";
    case "openrouter": return "anthropic/claude-sonnet-4";
    case "ollama": return "llama3.3";
  }
}

// --- Anthropic Provider ---

async function sendAnthropic(model: string, system: string, messages: AIMessage[], maxTokens: number): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const textBlock = data.content?.find((b: any) => b.type === "text");
  if (!textBlock) throw new Error("No text response from Anthropic");
  return textBlock.text;
}

// --- OpenRouter Provider ---

async function sendOpenRouter(model: string, system: string, messages: AIMessage[], maxTokens: number): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not set");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000); // 2 min timeout

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "Presentify",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      // Disable reasoning/thinking for models that support it -- we need raw JSON output
      reasoning: { effort: "none" },
      messages: [
        { role: "system", content: system },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  }).finally(() => clearTimeout(timeout));

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  // Some models (reasoning models like kimi-k2.5) return content as null with reasoning in a separate field
  let text = data.choices?.[0]?.message?.content;
  if (!text) {
    // Try extracting from reasoning_details or reasoning field
    const reasoning = data.choices?.[0]?.message?.reasoning;
    if (reasoning) text = reasoning;
  }
  if (!text) {
    // Try reasoning_details array
    const details = data.choices?.[0]?.message?.reasoning_details;
    if (Array.isArray(details) && details.length > 0) {
      text = details.map((d: any) => d.text).join("");
    }
  }
  if (!text) throw new Error(`No text response from OpenRouter. Raw: ${JSON.stringify(data.choices?.[0]?.message).substring(0, 200)}`);
  return text;
}

// --- Ollama Provider ---

async function sendOllama(model: string, system: string, messages: AIMessage[], maxTokens: number): Promise<string> {
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";

  const res = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      stream: false,
      options: { num_predict: maxTokens },
      messages: [
        { role: "system", content: system },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Ollama API error (${res.status}): ${err}`);
  }

  const data = await res.json();
  const text = data.message?.content;
  if (!text) throw new Error("No text response from Ollama");
  return text;
}

// --- Unified Send ---

export async function sendMessage(req: AIRequest): Promise<AIResponse> {
  const provider = getProvider();
  const model = getModelForRole(req.role);
  const maxTokens = req.maxTokens || 4000;

  console.log(`[AI] ${provider}/${model} role=${req.role} maxTokens=${maxTokens}`);

  let text: string;

  switch (provider) {
    case "anthropic":
      text = await sendAnthropic(model, req.system, req.messages, maxTokens);
      break;
    case "openrouter":
      text = await sendOpenRouter(model, req.system, req.messages, maxTokens);
      break;
    case "ollama":
      text = await sendOllama(model, req.system, req.messages, maxTokens);
      break;
    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }

  console.log(`[AI] Response received: ${text.substring(0, 100)}...`);
  return { text };
}

/**
 * Helper: get current provider info for display
 */
export function getProviderInfo(): { provider: string; planningModel: string; generationModel: string } {
  return {
    provider: getProvider(),
    planningModel: getModelForRole("planning"),
    generationModel: getModelForRole("generation"),
  };
}
