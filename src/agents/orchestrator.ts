import type { IntakeFormData, OutlineItem, PresentationConfig, Slide } from "@/lib/types";
import { generateTheme } from "./generateTheme";
import { generateSlideContent } from "./generateSlideContent";
import { generateId } from "@/lib/store";
import { searchForFacts } from "@/lib/search";
import { findSlideImage, type ImageResult } from "@/lib/images";

// Slide types that benefit from web search enrichment
const SEARCHABLE_TYPES = new Set(["content", "data", "comparison", "context", "story"]);
// Slide types that benefit from images
const VISUAL_TYPES = new Set(["title", "context", "story", "quote", "closing"]);

/**
 * Enrich an outline item with web search data.
 * Adds real facts/stats to talking points so the generation model has concrete data.
 */
async function enrichOutlineItem(item: OutlineItem): Promise<OutlineItem> {
  const shouldSearch = !item.slideType || SEARCHABLE_TYPES.has(item.slideType);
  if (!shouldSearch) return item;

  const facts = await searchForFacts(item.summary);
  if (!facts) return item;

  // Append research to talking points
  const enrichedPoints = [...(item.talkingPoints || [])];
  enrichedPoints.push(`[Research] ${facts.substring(0, 300)}`);

  return { ...item, talkingPoints: enrichedPoints };
}

/**
 * Find a relevant image for a slide.
 */
async function findImageForSlide(item: OutlineItem): Promise<ImageResult | null> {
  const shouldSearch = !item.slideType || VISUAL_TYPES.has(item.slideType);
  if (!shouldSearch) return null;

  return findSlideImage(item.keyMessage || item.summary);
}

export async function* generatePresentationStream(
  intake: IntakeFormData,
  approvedOutline: OutlineItem[]
): AsyncGenerator<{ event: string; data: any }> {
  // Step 1: Generate theme
  yield { event: "status", data: { phase: "generating-theme" } };
  const theme = await generateTheme(intake);
  yield { event: "theme", data: theme };

  // Step 2: Enrich outline with web search (if Tavily key is set)
  yield { event: "status", data: { phase: "enriching-content" } };
  const enrichedOutline: OutlineItem[] = [];
  const slideImages: Map<number, ImageResult> = new Map();

  // Run enrichment in parallel (but cap concurrency to avoid rate limits)
  const enrichPromises = approvedOutline.map(async (item, i) => {
    const [enriched, image] = await Promise.all([
      enrichOutlineItem(item),
      findImageForSlide(item),
    ]);
    return { index: i, enriched, image };
  });

  const enrichResults = await Promise.all(enrichPromises);
  for (const { index, enriched, image } of enrichResults) {
    enrichedOutline[index] = enriched;
    if (image) slideImages.set(index, image);
  }

  // Step 3: Generate slides one by one
  const allSummaries = enrichedOutline.map((o) => o.summary);
  const slides: Slide[] = [];

  for (let i = 0; i < enrichedOutline.length; i++) {
    yield { event: "status", data: { phase: "generating-slide", current: i + 1, total: enrichedOutline.length } };

    const outlineItem = enrichedOutline[i];

    // If we have an image, add it as a hint to the outline
    const image = slideImages.get(i);
    const itemWithImage = image
      ? { ...outlineItem, talkingPoints: [...(outlineItem.talkingPoints || []), `[Image available] ${image.alt} -- URL: ${image.url} -- ${image.credit}`] }
      : outlineItem;

    const slideData = await generateSlideContent(
      itemWithImage,
      theme,
      enrichedOutline.length,
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

  // Step 4: Assemble full config
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
