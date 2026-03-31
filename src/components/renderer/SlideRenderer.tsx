"use client";

import React from "react";
import type { Slide, Section, SectionStyle, ComponentType } from "@/lib/types";
import { componentRegistry } from "@/components/slides";

interface SlideRendererProps {
  slide: Slide;
  showSectionIds?: boolean;
}

function renderComponent(component: ComponentType, props: Record<string, any>) {
  const Component = componentRegistry[component];
  if (!Component) {
    console.warn(`Unknown component: ${component}`);
    return null;
  }
  const clean: Record<string, any> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v && typeof v === "object" && !Array.isArray(v) && v.component) continue;
    clean[k] = v;
  }
  return <Component {...clean} />;
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

  // Alignment -- use flexbox for true centering (text-center alone doesn't work on flex children)
  const align = s.align || (isFirstSlide ? "center" : undefined);
  if (align === "center") {
    classes.push("flex flex-col items-center text-center");
  } else if (align === "right") {
    classes.push("flex flex-col items-end text-right");
  }

  // Glass panel
  if (s.glass || (s.glass === undefined && component && GLASS_BY_DEFAULT.has(component))) {
    classes.push("glass-panel");
  }

  // Accent border
  if (s.accent) {
    wrapperStyle.borderLeft = `4px solid ${s.accent}`;
    wrapperStyle.paddingLeft = "1.5rem";
  }

  // Spacing
  if (s.spacing === "none") wrapperStyle.padding = "0";
  else if (s.spacing === "tight") wrapperStyle.padding = "0.25rem 0";
  else if (s.spacing === "loose") wrapperStyle.padding = "1.5rem 0";

  // Max width constraint
  if (s.maxWidth) {
    wrapperStyle.maxWidth = s.maxWidth;
    if (align === "center") wrapperStyle.margin = "0 auto";
  }

  // Padding override
  if (s.padding) wrapperStyle.padding = s.padding;

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

function SectionRenderer({ section, isFirstSlide, sectionId, showId }: { section: Section; isFirstSlide: boolean; sectionId: string; showId: boolean }) {
  if (section.type === "full") {
    const { className, wrapperStyle } = buildSectionWrapper(
      section.style, section.component, isFirstSlide
    );
    return (
      <div className={`relative ${className}`} style={Object.keys(wrapperStyle).length > 0 ? wrapperStyle : undefined}>
        {showId && <SectionBadge id={sectionId} />}
        {renderComponent(section.component, section.props)}
      </div>
    );
  }

  if (section.type === "columns") {
    const colCount = section.columns.length;
    const { className } = buildSectionWrapper(section.style, undefined, isFirstSlide);
    return (
      <div
        className={`relative w-full gap-5 md:gap-8 ${className}`}
        style={{ display: "grid", gridTemplateColumns: `repeat(${colCount}, 1fr)` }}
      >
        {showId && <SectionBadge id={sectionId} />}
        {section.columns.map((col, i) => (
          <div key={i}>
            {renderComponent(col.component, col.props)}
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export function SlideRenderer({ slide, showSectionIds = false }: SlideRendererProps) {
  let displayTitle = slide.title;
  if (slide.titleAccent) {
    const idx = displayTitle.lastIndexOf(slide.titleAccent);
    if (idx >= 0 && idx + slide.titleAccent.length === displayTitle.length) {
      displayTitle = displayTitle.slice(0, idx);
    }
  }

  const isFirstSlide = slide.number === 1;
  const isSparse = slide.sections.length <= 2;

  return (
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
              {displayTitle}
              {slide.titleAccent && (
                <span style={{ color: "var(--slide-primary)" }}>{slide.titleAccent}</span>
              )}
            </h1>
            {slide.subtitle && (
              <p
                className={`${
                  isFirstSlide
                    ? "mt-5 text-xl md:text-2xl"
                    : "mt-3 text-base md:text-xl"
                }`}
                style={{ color: "var(--slide-text-muted)" }}
              >
                {slide.subtitle}
              </p>
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
          />
        ))}
      </div>
    </div>
  );
}
