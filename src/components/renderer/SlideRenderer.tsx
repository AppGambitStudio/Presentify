"use client";

import React, { useEffect, useMemo, useState } from "react";
import type {
  Slide,
  Section,
  SectionStyle,
  ComponentType,
  SectionDetailLevel,
} from "@/lib/types";
import { componentRegistry } from "@/components/slides";
import { EditProvider, useEdit } from "./EditContext";
import { EditableText } from "./EditableText";
import { SectionToolbar } from "./SectionToolbar";

export type DensityMode = SectionDetailLevel;

interface SlideRendererProps {
  slide: Slide;
  showSectionIds?: boolean;
  workspaceMode?: boolean;
  densityMode?: DensityMode;
  onSlideUpdate?: (updated: Slide) => void;
}

const DETAIL_ORDER: Record<SectionDetailLevel, number> = {
  summary: 0,
  standard: 1,
  deep: 2,
};

const GAP_BY_DENSITY: Record<DensityMode, { sparse: string; dense: string }> = {
  summary: { sparse: "1.5rem", dense: "1rem" },
  standard: { sparse: "2rem", dense: "1.25rem" },
  deep: { sparse: "2.5rem", dense: "1.75rem" },
};

function splitTitle(fullTitle: string, accent?: string) {
  if (accent) {
    const idx = fullTitle.lastIndexOf(accent);
    if (idx >= 0 && idx + accent.length === fullTitle.length) {
      return { base: fullTitle.slice(0, idx), accent };
    }
  }
  return { base: fullTitle, accent: accent || "" };
}

function composeFullTitle(base: string, accent?: string) {
  const trimmedBase = base.trimEnd();
  const trimmedAccent = (accent || "").trim();
  if (!trimmedBase) return trimmedAccent;
  if (!trimmedAccent) return trimmedBase;
  return `${trimmedBase} ${trimmedAccent}`;
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

interface SectionChromeProps {
  section: Section;
  sectionId: string;
  showId: boolean;
  sectionIndex: number;
  focusedSection: number | null;
  onFocusToggle: (next: number | null) => void;
  onStyleChange?: (style: SectionStyle) => void;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

function SectionChrome({
  section,
  sectionId,
  showId,
  sectionIndex,
  focusedSection,
  onFocusToggle,
  onStyleChange,
  className,
  style,
  children,
}: SectionChromeProps) {
  const isFocused = focusedSection === sectionIndex;
  const hasFocus = focusedSection !== null;
  const detailLabel = section.detailLevel ? section.detailLevel.toUpperCase() : null;
  const audienceLabels = section.audienceTags?.slice(0, 3) || [];

  return (
    <div
      className={[
        "relative group transition-all duration-300",
        className,
        isFocused ? "ring-2 ring-[var(--slide-primary)] shadow-2xl !overflow-visible" : "",
        hasFocus && !isFocused ? "opacity-40" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {showId && <SectionBadge id={sectionId} />}
      <div
        className="absolute top-3 right-3 flex gap-2 items-center text-[11px] uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ zIndex: 5 }}
      >
        {detailLabel && (
          <span
            className="px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: "rgba(255,255,255,0.08)",
              letterSpacing: "0.08em",
            }}
          >
            {detailLabel}
          </span>
        )}
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onFocusToggle(isFocused ? null : sectionIndex);
          }}
          className="px-2 py-0.5 rounded-full border text-[10px] font-semibold"
          style={{
            borderColor: "var(--slide-card-border)",
            backgroundColor: isFocused ? "var(--slide-primary)" : "rgba(0,0,0,0.35)",
            color: isFocused ? "var(--slide-bg)" : "var(--slide-text)",
          }}
        >
          {isFocused ? "Clear" : "Focus"}
        </button>
      </div>
      {audienceLabels.length > 0 && (
        <div
          className="absolute top-3 left-3 flex flex-wrap gap-1 text-[10px] uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ zIndex: 5 }}
        >
          {audienceLabels.map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 rounded border"
              style={{
                borderColor: "rgba(255,255,255,0.15)",
                color: "var(--slide-text-muted)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      {children}
      {/* Section toolbar -- top-right of focused section */}
      {isFocused && onStyleChange && (
        <div className="absolute -top-9 right-0 z-30">
          <SectionToolbar style={section.style} onChange={onStyleChange} />
        </div>
      )}
    </div>
  );
}

function SectionRenderer({
  section,
  isFirstSlide,
  sectionId,
  showId,
  sectionIndex,
  densityMode,
  focusedSection,
  onFocusToggle,
  workspaceMode,
}: {
  section: Section;
  isFirstSlide: boolean;
  sectionId: string;
  showId: boolean;
  sectionIndex: number;
  densityMode: DensityMode;
  focusedSection: number | null;
  onFocusToggle: (next: number | null) => void;
  workspaceMode: boolean;
}) {
  const { editable, onSectionUpdate } = useEdit();
  const isEditable = editable && workspaceMode;
  const densityAware = Boolean(section.detailLevel);

  const handlePropsChange = (newProps: Record<string, any>) => {
    if (section.type === "full") {
      onSectionUpdate(sectionIndex, { ...section, props: newProps });
    }
  };

  const handleStyleChange = (newStyle: SectionStyle) => {
    onSectionUpdate(sectionIndex, { ...section, style: newStyle });
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
    const displayProps = transformComponentProps(
      section.component,
      section.props,
      densityMode,
      densityAware,
      isEditable
    );
    return (
      <SectionChrome
        section={section}
        sectionId={sectionId}
        showId={showId}
        sectionIndex={sectionIndex}
        focusedSection={focusedSection}
        onFocusToggle={onFocusToggle}
        onStyleChange={isEditable ? handleStyleChange : undefined}
        className={`relative ${className}`.trim()}
        style={Object.keys(wrapperStyle).length > 0 ? wrapperStyle : undefined}
      >
        {renderComponent(section.component, displayProps, isEditable, handlePropsChange)}
      </SectionChrome>
    );
  }

  if (section.type === "columns") {
    const colCount = section.columns.length;
    const { className, wrapperStyle } = buildSectionWrapper(section.style, undefined, isFirstSlide);
    const layoutAware = densityAware || Boolean(section.dynamicLayout && section.dynamicLayout !== "auto");
    const gridTemplate = layoutAware
      ? getColumnTemplate(colCount, densityMode, section.dynamicLayout)
      : `repeat(${colCount}, 1fr)`;
    const columnGap = layoutAware ? (densityMode === "summary" ? "1rem" : densityMode === "deep" ? "2rem" : "1.25rem") : undefined;
    return (
      <SectionChrome
        section={section}
        sectionId={sectionId}
        showId={showId}
        sectionIndex={sectionIndex}
        focusedSection={focusedSection}
        onFocusToggle={onFocusToggle}
        onStyleChange={isEditable ? handleStyleChange : undefined}
        className={`relative w-full ${layoutAware ? "" : "gap-5 md:gap-8"} ${className}`.trim()}
        style={{ display: "grid", gridTemplateColumns: gridTemplate, gap: columnGap, ...wrapperStyle }}
      >
        {section.columns.map((col, i) => {
          const colStyle = col.style ? buildSectionWrapper(col.style, col.component, isFirstSlide) : null;
          const columnDensityAware = Boolean(col.detailLevel) || densityAware;
          const displayProps = transformComponentProps(
            col.component,
            col.props,
            densityMode,
            columnDensityAware,
            isEditable
          );
          return (
            <div
              key={i}
              className={colStyle?.className || ""}
              style={colStyle?.wrapperStyle && Object.keys(colStyle.wrapperStyle).length > 0 ? colStyle.wrapperStyle : undefined}
            >
              {renderComponent(
                col.component,
                displayProps,
                isEditable,
                (newProps) => handleColumnPropsChange(i, newProps)
              )}
            </div>
          );
        })}
      </SectionChrome>
    );
  }

  return null;
}

export function SlideRenderer({
  slide,
  showSectionIds = false,
  workspaceMode = false,
  densityMode = "standard",
  onSlideUpdate,
}: SlideRendererProps) {
  const { base: baseTitle, accent: accentValue } = useMemo(
    () => splitTitle(slide.title, slide.titleAccent),
    [slide.title, slide.titleAccent]
  );
  const displayTitle = baseTitle;

  const isFirstSlide = slide.number === 1;
  const visibleSections = useMemo(
    () => slide.sections.filter((section) => shouldRenderSection(section, densityMode)),
    [slide.sections, densityMode]
  );
  const isSparse = visibleSections.length <= 2;
  const editable = workspaceMode && !!onSlideUpdate;
  const [focusedSection, setFocusedSection] = useState<number | null>(null);
  useEffect(() => { setFocusedSection(null); }, [densityMode]);

  const handleTitleUpdate = (newTitle: string) => {
    if (onSlideUpdate) {
      const fullTitle = composeFullTitle(newTitle, slide.titleAccent);
      onSlideUpdate({ ...slide, title: fullTitle });
    }
  };

  const handleAccentUpdate = (newAccent: string) => {
    if (onSlideUpdate) {
      const fullTitle = composeFullTitle(displayTitle, newAccent);
      onSlideUpdate({ ...slide, title: fullTitle, titleAccent: newAccent || undefined });
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

  const resolvedGap = slide.gap || (isSparse ? GAP_BY_DENSITY[densityMode].sparse : GAP_BY_DENSITY[densityMode].dense);
  const hasVisibleSections = visibleSections.length > 0;

  // Auto-scale: shrink content if it overflows the container
  const containerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [contentScale, setContentScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const check = () => {
      const containerH = container.clientHeight;
      const contentH = content.scrollHeight;
      if (contentH > containerH && containerH > 0) {
        setContentScale(Math.max(0.55, containerH / contentH));
      } else {
        setContentScale(1);
      }
    };

    check();
    const timer = setTimeout(check, 200);
    return () => clearTimeout(timer);
  }, [slide.id, slide.sections, densityMode]);

  return (
    <EditProvider
      editable={editable}
      onSectionUpdate={handleSectionUpdate}
      onTitleUpdate={handleTitleUpdate}
      onSubtitleUpdate={handleSubtitleUpdate}
    >
      <div
        className="slide-content"
        style={{
          ...(slide.style?.backgroundColor ? { "--slide-bg": slide.style.backgroundColor, backgroundColor: slide.style.backgroundColor } as React.CSSProperties : {}),
          ...(slide.style?.textColor ? { "--slide-text": slide.style.textColor, color: slide.style.textColor } as React.CSSProperties : {}),
          ...(slide.style?.primaryColor ? { "--slide-primary": slide.style.primaryColor } as React.CSSProperties : {}),
          ...(slide.style?.fontFamily ? { "--slide-font-heading": `'${slide.style.fontFamily}', sans-serif` } as React.CSSProperties : {}),
          ...(slide.style?.backgroundImage ? { backgroundImage: slide.style.backgroundImage, backgroundSize: "cover", backgroundPosition: "center" } : {}),
          position: "relative",
        }}
      >
        {/* Overlay for background images */}
        {slide.style?.overlay && (
          <div className="absolute inset-0 z-0" style={{ backgroundColor: slide.style.overlay }} />
        )}
        <div ref={containerRef} className="w-full flex-1 overflow-hidden relative z-10">
        <div
          ref={contentRef}
          className="w-full flex flex-col justify-center"
          style={{
            gap: resolvedGap,
            transform: contentScale < 1 ? `scale(${contentScale})` : undefined,
            transformOrigin: "top center",
            minHeight: contentScale < 1 ? undefined : "100%",
          }}
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
                {(accentValue || editable) && (
                  <>
                    {" "}
                    <EditableText
                      value={accentValue}
                      onChange={handleAccentUpdate}
                      editable={editable}
                      className="slide-title-accent inline-block"
                      style={{
                        color: "var(--slide-primary)",
                        minWidth: !accentValue && editable ? "1ch" : undefined,
                        opacity: !accentValue && editable ? 0.6 : 1,
                      }}
                    />
                  </>
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
          {slide.sections.map((section, i) =>
            shouldRenderSection(section, densityMode) ? (
              <SectionRenderer
                key={i}
                section={section}
                isFirstSlide={isFirstSlide}
                sectionId={`S${i + 1}`}
                showId={showSectionIds}
                sectionIndex={i}
                densityMode={densityMode}
                focusedSection={focusedSection}
                onFocusToggle={setFocusedSection}
                workspaceMode={workspaceMode}
              />
            ) : null
          )}

          {!hasVisibleSections && (
            <div className="glass-panel text-center text-sm" style={{ color: "var(--slide-text-muted)" }}>
              No content for this detail level. Switch modes to see more.
            </div>
          )}
        </div>
        </div>
        </div>
    </EditProvider>
  );
}

function shouldRenderSection(section: Section, densityMode: DensityMode) {
  const detail = section.detailLevel;
  if (!detail) return true;
  return DETAIL_ORDER[detail] <= DETAIL_ORDER[densityMode];
}

function getColumnTemplate(count: number, densityMode: DensityMode, layout: Section["dynamicLayout"]) {
  if (layout === "stack") {
    return "repeat(1, minmax(0, 1fr))";
  }
  if (layout === "grid") {
    return `repeat(${Math.max(1, Math.min(3, count))}, minmax(0, 1fr))`;
  }

  const safeCount = Math.max(1, count);
  if (densityMode === "summary") {
    return "repeat(1, minmax(0, 1fr))";
  }
  if (densityMode === "deep") {
    return `repeat(${Math.min(3, safeCount)}, minmax(0, 1fr))`;
  }
  return `repeat(${Math.min(2, safeCount)}, minmax(0, 1fr))`;
}

function transformComponentProps(
  component: ComponentType,
  props: Record<string, any>,
  densityMode: DensityMode,
  densityActive: boolean,
  editable: boolean
) {
  if (!props || editable || !densityActive) return props;
  switch (component) {
    case "Body": {
      if (typeof props.markdown !== "string") return props;
      const limit = densityMode === "summary" ? 260 : densityMode === "standard" ? 480 : Infinity;
      return limit === Infinity || props.markdown.length <= limit
        ? props
        : { ...props, markdown: truncateMarkdown(props.markdown, limit) };
    }
    case "BulletList": {
      const items: string[] = props.items || [];
      const limit = densityMode === "summary" ? 3 : densityMode === "standard" ? 6 : Infinity;
      return limit === Infinity || items.length <= limit
        ? props
        : { ...props, items: [...items.slice(0, limit), "..."] };
    }
    case "NumberedSteps": {
      const steps = props.steps || [];
      const limit = densityMode === "summary" ? 3 : densityMode === "standard" ? 5 : Infinity;
      return limit === Infinity || steps.length <= limit
        ? props
        : { ...props, steps: steps.slice(0, limit) };
    }
    case "CardGrid": {
      const cards = props.cards || [];
      const limit = densityMode === "summary" ? 3 : densityMode === "standard" ? 6 : cards.length;
      const limitedCards = limit >= cards.length ? cards : cards.slice(0, limit);
      const baseColumns = typeof props.columns === "number" && props.columns > 0 ? props.columns : Math.min(3, Math.max(1, limitedCards.length));
      const columns = (() => {
        if (densityMode === "summary") return Math.min(2, baseColumns);
        if (densityMode === "deep") return Math.min(4, Math.max(baseColumns, Math.min(4, limitedCards.length)));
        return baseColumns;
      })();
      return {
        ...props,
        cards: limitedCards,
        columns,
      };
    }
    case "TagList": {
      const tags: string[] = props.tags || [];
      const limit = densityMode === "summary" ? 6 : densityMode === "standard" ? 12 : tags.length;
      return limit >= tags.length
        ? props
        : { ...props, tags: [...tags.slice(0, limit), "..."] };
    }
    case "ComparisonTable": {
      const rows = props.rows || [];
      const limit = densityMode === "summary" ? 2 : densityMode === "standard" ? 4 : rows.length;
      return { ...props, rows: rows.slice(0, limit) };
    }
    case "ChartBlock": {
      const data = props.data || [];
      const limit = densityMode === "summary" ? 4 : densityMode === "standard" ? 6 : data.length;
      return limit >= data.length ? props : { ...props, data: data.slice(0, limit) };
    }
    default:
      return props;
  }
}

function truncateMarkdown(markdown: string, limit: number) {
  if (markdown.length <= limit) return markdown;
  const truncated = markdown.slice(0, limit).trimEnd();
  const lastSentence = truncated.lastIndexOf(". ");
  const cutoff = lastSentence > limit * 0.6 ? lastSentence + 1 : truncated.length;
  return `${truncated.slice(0, cutoff).trimEnd()} ...`;
}
