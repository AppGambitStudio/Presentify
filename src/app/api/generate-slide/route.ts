import { NextRequest, NextResponse } from "next/server";
import { generateSlideContent } from "@/agents/generateSlideContent";
import type { PresentationConfig, OutlineItem, Slide } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { description, insertAfter, config }: {
      description: string;
      insertAfter: number;
      config: PresentationConfig;
    } = await request.json();

    // Build a rich outline item from the description
    const outlineItem: OutlineItem = {
      number: insertAfter + 2,
      summary: description,
      keyMessage: description,
      talkingPoints: [],
      suggestedComponents: undefined,
      tone: config.tone.join(", "),
    };

    // Get all summaries for context
    const allSummaries = config.slides.map((s) => s.summary);
    // Insert the new summary at the right position
    allSummaries.splice(insertAfter + 1, 0, description);

    const slideData = await generateSlideContent(
      outlineItem,
      config.theme,
      config.slides.length + 1,
      allSummaries,
      {
        title: config.title,
        audience: config.audience,
        tone: config.tone,
        purpose: config.purpose,
      }
    );

    const slide: Slide = {
      id: `slide_gen_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      ...slideData,
    };

    return NextResponse.json({ slide });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate slide" }, { status: 500 });
  }
}
