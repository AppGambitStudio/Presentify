import { NextRequest, NextResponse } from "next/server";
import { improviseSlide } from "@/agents/improviseSlide";
import type { Slide, PresentationConfig } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { guidance, currentSlide, config }: {
      guidance: string;
      currentSlide: Slide;
      config: PresentationConfig;
    } = await request.json();

    const improved = await improviseSlide(guidance, currentSlide, config);
    return NextResponse.json({ slide: improved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Improvisation failed" }, { status: 500 });
  }
}
