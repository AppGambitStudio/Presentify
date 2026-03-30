"use client";

import type { Slide, Cell, CellDecoration, FontSize, TextAlign } from "@/lib/types";
import { componentRegistry } from "@/components/slides";
import * as LucideIcons from "lucide-react";
import { motion } from "motion/react";

interface SlideRendererProps {
  slide: Slide;
}

// --- Font size map: config value -> responsive CSS classes ---
const fontSizeMap: Record<FontSize, string> = {
  sm: "text-sm md:text-base",
  base: "text-base md:text-lg",
  lg: "text-lg md:text-xl",
  xl: "text-xl md:text-2xl",
  "2xl": "text-2xl md:text-3xl",
  "3xl": "text-3xl md:text-4xl",
  "4xl": "text-4xl md:text-5xl",
  "5xl": "text-5xl md:text-6xl",
  "6xl": "text-6xl md:text-7xl",
  "7xl": "text-7xl md:text-8xl",
  "8xl": "text-8xl md:text-9xl",
};

const alignMap: Record<TextAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const fontWeightMap: Record<string, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
};

const animateMap: Record<string, object> = {
  "fade-in": { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6 } },
  "slide-up": { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } },
  "scale": { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.5 } },
};

function getIcon(name: string) {
  const formatted = name.replace(/-./g, (m) => m[1].toUpperCase()).replace(/^./, (m) => m.toUpperCase());
  return (LucideIcons as any)[formatted] || null;
}

function buildVariantStyles(decoration: CellDecoration): { className: string; style: React.CSSProperties } {
  const variant = decoration.variant || "default";
  let className = "";
  const style: React.CSSProperties = {};

  switch (variant) {
    case "elevated":
      className = "glass-panel shadow-lg";
      break;
    case "outlined":
      className = "rounded-2xl";
      style.border = `1px solid var(--slide-card-border)`;
      style.padding = decoration.padding || "1.5rem";
      break;
    case "filled":
      className = "rounded-2xl";
      style.backgroundColor = decoration.background || "var(--slide-card-bg)";
      style.padding = decoration.padding || "1.5rem";
      break;
    case "ghost":
      // No visual treatment, just a container
      break;
    default:
      break;
  }

  if (decoration.borderAccent) {
    style.borderLeft = `4px solid ${decoration.borderAccent}`;
    if (variant === "default") {
      style.paddingLeft = "1.5rem";
    }
  }

  if (decoration.background && variant !== "filled") {
    style.background = decoration.background;
  }

  if (decoration.rounded) {
    style.borderRadius = decoration.rounded;
  }

  if (decoration.padding) {
    style.padding = decoration.padding;
  }

  if (decoration.glow) {
    style.boxShadow = `0 0 30px ${decoration.borderAccent || "var(--slide-primary)"}30`;
  }

  return { className, style };
}

// Check if an object looks like a nested cell/component definition
function isNestedComponent(obj: any): boolean {
  return obj && typeof obj === "object" && !Array.isArray(obj) && typeof obj.component === "string";
}

// Recursively render a nested cell object into a React element
function renderNestedCell(obj: any): React.ReactNode {
  if (!obj || typeof obj !== "object") return obj;
  if (isNestedComponent(obj)) {
    const Comp = componentRegistry[obj.component as keyof typeof componentRegistry];
    if (Comp) {
      const cleanProps = sanitizeProps(obj.props || {});
      // Also handle "children" if present
      if (obj.children) {
        const childContent = typeof obj.children === "string"
          ? obj.children
          : isNestedComponent(obj.children)
            ? renderNestedCell(obj.children)
            : Array.isArray(obj.children)
              ? obj.children.map((c: any, i: number) => isNestedComponent(c) ? <span key={i}>{renderNestedCell(c)}</span> : c)
              : String(obj.children);
        return <Comp {...cleanProps}>{childContent}</Comp>;
      }
      return <Comp {...cleanProps} />;
    }
  }
  // If it's a plain object but not a component, convert to string to prevent React error
  return JSON.stringify(obj);
}

// Clean props: if a prop value looks like a nested cell, render it; filter out raw objects that would crash React
function sanitizeProps(props: Record<string, any>): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(props)) {
    if (value === null || value === undefined) {
      clean[key] = value;
    } else if (isNestedComponent(value)) {
      clean[key] = renderNestedCell(value);
    } else if (Array.isArray(value)) {
      clean[key] = value.map((item, i) =>
        isNestedComponent(item) ? renderNestedCell(item) : item
      );
    } else if (typeof value === "object" && !(value instanceof Date)) {
      // Plain objects that aren't component defs -- check if they have only primitive values
      const hasOnlyPrimitives = Object.values(value).every(
        (v) => v === null || v === undefined || typeof v !== "object"
      );
      if (hasOnlyPrimitives) {
        clean[key] = value; // safe to pass (e.g. style objects)
      } else {
        // Deep object -- try to sanitize recursively
        clean[key] = sanitizeProps(value);
      }
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

function CellRenderer({ cell }: { cell: Cell }) {
  const Component = componentRegistry[cell.component];
  if (!Component) {
    console.warn(`Unknown component type: ${cell.component}`);
    return null;
  }

  const dec = cell.decoration || {};
  const { className: variantClass, style: variantStyle } = buildVariantStyles(dec);

  // Build typography classes
  const typoClasses = [
    dec.fontSize ? fontSizeMap[dec.fontSize] : "",
    dec.align ? alignMap[dec.align] : "",
    dec.fontWeight ? fontWeightMap[dec.fontWeight] : "",
  ].filter(Boolean).join(" ");

  // Build typography styles
  const typoStyle: React.CSSProperties = {};
  if (dec.textColor) typoStyle.color = dec.textColor;

  // Merge all styles
  const mergedStyle: React.CSSProperties = {
    gridArea: cell.gridArea,
    ...variantStyle,
    ...typoStyle,
  };

  const mergedClass = [variantClass, typoClasses].filter(Boolean).join(" ");

  // Decorative background icon
  const BgIcon = dec.icon ? getIcon(dec.icon) : null;

  // Wrap in motion.div if animation is set
  const animate = dec.animate && dec.animate !== "none" ? animateMap[dec.animate] : null;
  const Wrapper = animate ? motion.div : "div";
  const wrapperProps = animate || {};

  return (
    <Wrapper
      data-cell-id={cell.id}
      className={`relative overflow-hidden ${mergedClass}`}
      style={mergedStyle}
      {...(wrapperProps as any)}
    >
      {/* Decorative background icon */}
      {BgIcon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
          <BgIcon size={200} />
        </div>
      )}
      {/* Component content */}
      <div className="relative z-10">
        <Component {...sanitizeProps(cell.props)} />
      </div>
    </Wrapper>
  );
}

export function SlideRenderer({ slide }: SlideRendererProps) {
  return (
    <div className="slide-content">
      <div
        data-slide-grid
        className="w-full flex-1 overflow-hidden"
        style={{
          display: "grid",
          gridTemplateColumns: slide.layout.columns,
          gridTemplateRows: slide.layout.rows,
          gap: slide.layout.gap,
          alignContent: "center",
          alignItems: "center",
          maxHeight: "100%",
        }}
      >
        {slide.cells.map((cell) => (
          <CellRenderer key={cell.id} cell={cell} />
        ))}
      </div>
    </div>
  );
}
