import { NextRequest, NextResponse } from "next/server";
import { editSlide } from "@/agents/editSlide";
import type { Slide, PresentationConfig } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { message, currentSlide, config }: {
      message: string;
      currentSlide: Slide;
      config: PresentationConfig;
    } = await request.json();

    const updated = await editSlide(message, currentSlide, config);
    return NextResponse.json({ slide: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Edit failed" }, { status: 500 });
  }
}
