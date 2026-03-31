"use client";

import React from "react";
import type { Slide, Section, SectionStyle, ComponentType } from "@/lib/types";
import { componentRegistry } from "@/components/slides";
import { EditProvider, useEdit } from "./EditContext";
import { EditableText } from "./EditableText";

interface SlideRendererProps {
  slide: Slide;
  showSectionIds?: boolean;
  workspaceMode?: boolean;
  onSlideUpdate?: (updated: Slide) => void;
}

function renderComponent(component: ComponentType, props: Record<string, any>, editable: boolean, onPropsChange?: (newProps: Record<string, any>) => void) {
  const Component = componentRegistry[component];
  if (!Component) {
    console.warn(`Unknown component: ${component}`);
    return null;
  }

  // Safety: wrap in try-catch so a bad prop doesn't crash the whole slide
  try {
    const clean: Record<string, any> = {};
    for (const [k, v] of Object.entries(props || {})) {
      if (v && typeof v === "object" && !Array.isArray(v) && v.component) continue;
      clean[k] = v;
    }
  // Pass edit callbacks for components that support inline editing
  if (editable && onPropsChange) {
    clean.__editable = true;
    clean.__onPropsChange = onPropsChange;
  }
    return <Component {...clean} />;
  } catch (err) {
    console.error(`Error rendering ${component}:`, err);
    return <div className="text-red-400 text-sm p-2">Error rendering {component}</div>;
  }
}

// Components that look better wrapped in glass-panel by default
const GLASS_BY_DEFAULT = new Set(["ComparisonTable", "NumberedSteps"]);

function buildSectionWrapper(
  style: SectionStyle | undefined,
  component: string | undefined,
  isFirstSlide: boolean
): { className: string; wrapperStyle: React.CSSProperties } {
  const s = style || {};
  const classes: string[] = [];
  const wrapperStyle: React.CSSProperties = {};

  const align = s.align || (isFirstSlide ? "center" : undefined);
  if (align === "center") {
    // Use margin auto to center the child block. items-center alone doesn't work
    // when children are full-width (like <ul>).
    wrapperStyle.display = "flex";
    wrapperStyle.flexDirection = "column";
    wrapperStyle.alignItems = "center";
    wrapperStyle.textAlign = "center";
  } else if (align === "right") {
    wrapperStyle.display = "flex";
    wrapperStyle.flexDirection = "column";
    wrapperStyle.alignItems = "flex-end";
    wrapperStyle.textAlign = "right";
  }

  if (s.glass || (s.glass === undefined && component && GLASS_BY_DEFAULT.has(component))) {
    classes.push("glass-panel");
  }

  if (s.accent) {
    wrapperStyle.borderLeft = `4px solid ${s.accent}`;
    wrapperStyle.paddingLeft = "1.5rem";
  }

  if (s.spacing === "none") wrapperStyle.padding = "0";
  else if (s.spacing === "tight") wrapperStyle.padding = "0.25rem 0";
  else if (s.spacing === "loose") wrapperStyle.padding = "1.5rem 0";

  if (s.maxWidth) {
    wrapperStyle.maxWidth = s.maxWidth;
    if (align === "center") wrapperStyle.margin = "0 auto";
  }

  if (s.padding) wrapperStyle.padding = s.padding;
  if (s.fontSize) {
    // Use zoom for scaling -- it overrides Tailwind's hardcoded font sizes
    // Convert percentage strings like "125%" to zoom value like 1.25
    const match = s.fontSize.match(/^(\d+)%$/);
    if (match) {
      (wrapperStyle as any).zoom = parseInt(match[1]) / 100;
    } else {
      // For absolute values, set font-size and hope for inheritance
      wrapperStyle.fontSize = s.fontSize;
    }
  }
  if (s.color) wrapperStyle.color = s.color;

  return { className: classes.join(" "), wrapperStyle };
}

function SectionBadge({ id }: { id: string }) {
  return (
    <span
      className="absolute -top-3 -left-3 z-20 px-2.5 py-1 rounded-lg text-xs font-mono font-bold leading-none shadow-lg"
      style={{
        backgroundColor: "var(--slide-primary)",
        color: "var(--slide-bg)",
        border: "2px solid var(--slide-bg)",
        letterSpacing: "0.05em",
      }}
    >
      {id}
    </span>
  );
}

function SectionRenderer({ section, isFirstSlide, sectionId, showId, sectionIndex }: {
  section: Section; isFirstSlide: boolean; sectionId: string; showId: boolean; sectionIndex: number;
}) {
  const { editable, onSectionUpdate } = useEdit();

  const handlePropsChange = (newProps: Record<string, any>) => {
    if (section.type === "full") {
      onSectionUpdate(sectionIndex, { ...section, props: newProps });
    }
  };

  const handleColumnPropsChange = (colIndex: number, newProps: Record<string, any>) => {
    if (section.type === "columns") {
      const newColumns = [...section.columns];
      newColumns[colIndex] = { ...newColumns[colIndex], props: newProps };
      onSectionUpdate(sectionIndex, { ...section, columns: newColumns });
    }
  };

  if (section.type === "full") {
    const { className, wrapperStyle } = buildSectionWrapper(section.style, section.component, isFirstSlide);
    return (
      <div className={`relative ${className}`} style={Object.keys(wrapperStyle).length > 0 ? wrapperStyle : undefined}>
        {showId && <SectionBadge id={sectionId} />}
        {renderComponent(section.component, section.props, editable, handlePropsChange)}
      </div>
    );
  }

  if (section.type === "columns") {
    const colCount = section.columns.length;
    const { className, wrapperStyle } = buildSectionWrapper(section.style, undefined, isFirstSlide);
    return (
      <div
        className={`relative w-full gap-5 md:gap-8 ${className}`}
        style={{ display: "grid", gridTemplateColumns: `repeat(${colCount}, 1fr)`, ...wrapperStyle }}
      >
        {showId && <SectionBadge id={sectionId} />}
        {section.columns.map((col, i) => {
          const colStyle = col.style ? buildSectionWrapper(col.style, col.component, isFirstSlide) : null;
          return (
            <div
              key={i}
              className={colStyle?.className || ""}
              style={colStyle?.wrapperStyle && Object.keys(colStyle.wrapperStyle).length > 0 ? colStyle.wrapperStyle : undefined}
            >
              {renderComponent(col.component, col.props, editable, (newProps) => handleColumnPropsChange(i, newProps))}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}

export function SlideRenderer({ slide, showSectionIds = false, workspaceMode = false, onSlideUpdate }: SlideRendererProps) {
  let displayTitle = slide.title;
  if (slide.titleAccent) {
    const idx = displayTitle.lastIndexOf(slide.titleAccent);
    if (idx >= 0 && idx + slide.titleAccent.length === displayTitle.length) {
      displayTitle = displayTitle.slice(0, idx);
    }
  }

  const isFirstSlide = slide.number === 1;
  const isSparse = slide.sections.length <= 2;
  const editable = workspaceMode && !!onSlideUpdate;

  const handleTitleUpdate = (newTitle: string) => {
    if (onSlideUpdate) {
      // Reconstruct full title with accent
      const fullTitle = slide.titleAccent ? newTitle + slide.titleAccent : newTitle;
      onSlideUpdate({ ...slide, title: fullTitle });
    }
  };

  const handleSubtitleUpdate = (newSubtitle: string) => {
    if (onSlideUpdate) {
      onSlideUpdate({ ...slide, subtitle: newSubtitle });
    }
  };

  const handleSectionUpdate = (sectionIndex: number, updatedSection: Section) => {
    if (onSlideUpdate) {
      const newSections = [...slide.sections];
      newSections[sectionIndex] = updatedSection;
      onSlideUpdate({ ...slide, sections: newSections });
    }
  };

  return (
    <EditProvider
      editable={editable}
      onSectionUpdate={handleSectionUpdate}
      onTitleUpdate={handleTitleUpdate}
      onSubtitleUpdate={handleSubtitleUpdate}
    >
      <div className="slide-content">
        <div
          className="w-full flex-1 flex flex-col justify-center overflow-hidden"
          style={{ gap: slide.gap || (isSparse ? "2rem" : "1.25rem") }}
        >
          {/* Title area */}
          {slide.title && (
            <div className="text-center">
              <h1
                className={`font-bold leading-tight ${
                  isFirstSlide
                    ? "text-4xl md:text-6xl lg:text-7xl"
                    : "text-3xl md:text-4xl lg:text-5xl"
                }`}
                style={{ fontFamily: "var(--slide-font-heading)" }}
              >
                <EditableText
                  value={displayTitle}
                  onChange={handleTitleUpdate}
                  editable={editable}
                />
                {slide.titleAccent && (
                  <span style={{ color: "var(--slide-primary)" }}>{slide.titleAccent}</span>
                )}
              </h1>
              {slide.subtitle && (
                <EditableText
                  value={slide.subtitle}
                  onChange={handleSubtitleUpdate}
                  editable={editable}
                  tag="p"
                  className={`${isFirstSlide ? "mt-5 text-xl md:text-2xl" : "mt-3 text-base md:text-xl"}`}
                  style={{ color: "var(--slide-text-muted)" }}
                />
              )}
            </div>
          )}

          {/* Sections */}
          {slide.sections.map((section, i) => (
            <SectionRenderer
              key={i}
              section={section}
              isFirstSlide={isFirstSlide}
              sectionId={`S${i + 1}`}
              showId={showSectionIds}
              sectionIndex={i}
            />
          ))}
        </div>
      </div>
    </EditProvider>
  );
}
