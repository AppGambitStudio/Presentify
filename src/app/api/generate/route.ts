import { NextRequest, NextResponse } from "next/server";
import { generateOutline } from "@/agents/generateOutline";
import type { IntakeFormData } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const intake: IntakeFormData = await request.json();
    const outline = await generateOutline(intake);
    return NextResponse.json({ outline });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate outline" }, { status: 500 });
  }
}
