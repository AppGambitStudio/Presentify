import { NextRequest } from "next/server";
import { generatePresentationStream } from "@/agents/orchestrator";
import type { IntakeFormData, OutlineItem } from "@/lib/types";

export async function POST(request: NextRequest) {
  const { intake, outline }: { intake: IntakeFormData; outline: OutlineItem[] } = await request.json();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const { event, data } of generatePresentationStream(intake, outline)) {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        }
        controller.close();
      } catch (err: any) {
        controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ message: err.message || "Generation failed" })}\n\n`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
