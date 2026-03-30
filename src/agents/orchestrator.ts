import type { IntakeFormData, OutlineItem, PresentationConfig, Slide } from "@/lib/types";
import { generateTheme } from "./generateTheme";
import { generateSlideContent } from "./generateSlideContent";
import { generateId } from "@/lib/store";

export async function* generatePresentationStream(
  intake: IntakeFormData,
  approvedOutline: OutlineItem[]
): AsyncGenerator<{ event: string; data: any }> {
  // Step 1: Generate theme
  yield { event: "status", data: { phase: "generating-theme" } };
  const theme = await generateTheme(intake);
  yield { event: "theme", data: theme };

  // Step 2: Generate slides one by one
  const allSummaries = approvedOutline.map((o) => o.summary);
  const slides: Slide[] = [];

  for (let i = 0; i < approvedOutline.length; i++) {
    yield { event: "status", data: { phase: "generating-slide", current: i + 1, total: approvedOutline.length } };

    const slideData = await generateSlideContent(
      approvedOutline[i],
      theme,
      approvedOutline.length,
      allSummaries,
      { title: intake.title, audience: intake.audience, tone: intake.tone, purpose: intake.purpose }
    );

    const slide: Slide = {
      id: `slide_${i + 1}_${Math.random().toString(36).slice(2, 6)}`,
      ...slideData,
    };

    slides.push(slide);
    yield { event: "slide", data: slide };
  }

  // Step 3: Assemble full config
  const config: PresentationConfig = {
    id: generateId(),
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    title: intake.title,
    speaker: { name: intake.speakerName, role: intake.speakerRole, organization: intake.speakerOrganization },
    audience: intake.audience,
    purpose: intake.purpose,
    duration: intake.duration,
    tone: intake.tone,
    keyPoints: intake.keyPoints.split(",").map((s) => s.trim()).filter(Boolean),
    dos: intake.dos.split(",").map((s) => s.trim()).filter(Boolean),
    donts: intake.donts.split(",").map((s) => s.trim()).filter(Boolean),
    theme,
    slides,
  };

  yield { event: "complete", data: { id: config.id, totalSlides: slides.length } };
  yield { event: "config", data: config };
}
