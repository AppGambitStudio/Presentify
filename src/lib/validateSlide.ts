/**
 * Validate and sanitize slide data from AI output.
 * Fixes common structural issues so the renderer doesn't crash.
 */

import type { Slide, Section } from "./types";

/**
 * Validate and fix a slide's structure. Returns a sanitized slide
 * that the renderer can safely render without crashing.
 */
export function validateSlide(raw: any): Slide {
  const slide: Slide = {
    id: raw.id || `slide_${Date.now()}`,
    number: typeof raw.number === "number" ? raw.number : 1,
    summary: typeof raw.summary === "string" ? raw.summary : raw.title || "Untitled",
    title: typeof raw.title === "string" ? raw.title : "Untitled Slide",
    titleAccent: typeof raw.titleAccent === "string" ? raw.titleAccent : undefined,
    subtitle: typeof raw.subtitle === "string" ? raw.subtitle : undefined,
    gap: typeof raw.gap === "string" ? raw.gap : undefined,
    style: raw.style && typeof raw.style === "object" ? raw.style : undefined,
    sections: validateSections(raw.sections),
    speakerNotes: typeof raw.speakerNotes === "string" ? raw.speakerNotes : "",
    decorations: Array.isArray(raw.decorations) ? raw.decorations : [],
  };

  // Fix titleAccent: must be substring at end of title
  if (slide.titleAccent && !slide.title.endsWith(slide.titleAccent)) {
    // Try to find it in the title
    if (slide.title.includes(slide.titleAccent)) {
      // It's in the title but not at the end -- leave it, the renderer handles dedup
    } else {
      // Not in the title at all -- clear it
      slide.titleAccent = undefined;
    }
  }

  return slide;
}

/**
 * Validate sections array. Handles common AI mistakes:
 * - sections is a single object instead of array
 * - sections is missing entirely
 * - section has wrong type field
 * - columns is not an array
 */
function validateSections(raw: any): Section[] {
  if (!raw) return [];

  // Common mistake: sections is a single object, not an array
  if (!Array.isArray(raw) && typeof raw === "object" && raw.type) {
    const section = validateSection(raw);
    return section ? [section] : [];
  }

  if (!Array.isArray(raw)) return [];

  return raw.map((s: any) => validateSection(s)).filter(Boolean) as Section[];
}

function validateSection(raw: any): Section | null {
  if (!raw || typeof raw !== "object") return null;

  const type = raw.type;

  if (type === "full") {
    if (!raw.component || typeof raw.component !== "string") return null;
    return {
      type: "full",
      component: raw.component,
      props: validateProps(raw.props),
      style: raw.style,
    } as Section;
  }

  if (type === "columns") {
    let columns = raw.columns;
    // columns might not be an array
    if (!Array.isArray(columns)) {
      if (columns && typeof columns === "object" && columns.component) {
        columns = [columns]; // single column object -> array
      } else {
        return null;
      }
    }

    const validColumns = columns
      .map((col: any) => {
        if (!col || !col.component || typeof col.component !== "string") return null;
        return {
          component: col.component,
          props: validateProps(col.props),
          style: col.style,
        };
      })
      .filter(Boolean);

    if (validColumns.length === 0) return null;

    return {
      type: "columns",
      columns: validColumns,
      style: raw.style,
    } as Section;
  }

  // Unknown type -- try to interpret as "full" if it has a component
  if (raw.component && typeof raw.component === "string") {
    return {
      type: "full",
      component: raw.component,
      props: validateProps(raw.props),
      style: raw.style,
    } as Section;
  }

  return null;
}

/**
 * Validate props object. Ensures it's a plain object, not null/undefined/array.
 */
function validateProps(raw: any): Record<string, any> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return raw;
}

/**
 * Validate an entire presentation config's slides.
 */
export function validateAllSlides(slides: any[]): Slide[] {
  if (!Array.isArray(slides)) return [];
  return slides.map((s, i) => {
    const validated = validateSlide(s);
    validated.number = i + 1; // ensure correct numbering
    return validated;
  });
}
