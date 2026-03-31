"use client";

import React from "react";
import type { Slide, Section, ComponentType } from "@/lib/types";
import { componentRegistry } from "@/components/slides";

interface SlideRendererProps {
  slide: Slide;
}

function renderComponent(component: ComponentType, props: Record<string, any>) {
  const Component = componentRegistry[component];
  if (!Component) {
    console.warn(`Unknown component: ${component}`);
    return null;
  }
  // Sanitize: if any prop value is an object with "component", skip it (AI artifact)
  const clean: Record<string, any> = {};
  for (const [k, v] of Object.entries(props)) {
    if (v && typeof v === "object" && !Array.isArray(v) && v.component) {
      continue; // skip nested component objects
    }
    clean[k] = v;
  }
  return <Component {...clean} />;
}

function SectionRenderer({ section }: { section: Section }) {
  if (section.type === "full") {
    return (
      <div className="w-full">
        {renderComponent(section.component, section.props)}
      </div>
    );
  }

  if (section.type === "columns") {
    const colCount = section.columns.length;
    return (
      <div
        className="w-full gap-6 md:gap-8"
        style={{ display: "grid", gridTemplateColumns: `repeat(${colCount}, 1fr)` }}
      >
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

export function SlideRenderer({ slide }: SlideRendererProps) {
  // Strip duplicate accent text from title
  let displayTitle = slide.title;
  if (slide.titleAccent) {
    const idx = displayTitle.lastIndexOf(slide.titleAccent);
    if (idx >= 0 && idx + slide.titleAccent.length === displayTitle.length) {
      displayTitle = displayTitle.slice(0, idx);
    }
  }

  return (
    <div className="slide-content">
      <div className="w-full flex-1 flex flex-col justify-center gap-6 overflow-hidden">
        {/* Title area */}
        {slide.title && (
          <div className="text-center">
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
              style={{ fontFamily: "var(--slide-font-heading)" }}
            >
              {displayTitle}
              {slide.titleAccent && (
                <span style={{ color: "var(--slide-primary)" }}>{slide.titleAccent}</span>
              )}
            </h1>
            {slide.subtitle && (
              <p className="mt-3 text-lg md:text-xl" style={{ color: "var(--slide-text-muted)" }}>
                {slide.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Sections */}
        {slide.sections.map((section, i) => (
          <SectionRenderer key={i} section={section} />
        ))}
      </div>
    </div>
  );
}
