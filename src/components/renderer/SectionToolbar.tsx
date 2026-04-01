"use client";

import { AlignLeft, AlignCenter, AlignRight, Plus, Minus, PanelTop, Type, Palette } from "lucide-react";
import { useState } from "react";
import type { SectionStyle } from "@/lib/types";

interface SectionToolbarProps {
  style: SectionStyle | undefined;
  onChange: (style: SectionStyle) => void;
}

const SPACING_CYCLE: Array<SectionStyle["spacing"]> = ["none", "tight", "normal", "loose"];
const FONT_STEPS = ["80%", "90%", "100%", "110%", "120%", "130%", "150%"];

function ToolbarButton({ active, onClick, title, children }: { active?: boolean; onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      title={title}
      className="p-1.5 rounded transition-colors"
      style={{
        backgroundColor: active ? "var(--slide-primary)" : "transparent",
        color: active ? "var(--slide-bg)" : "var(--slide-text-muted)",
      }}
    >
      {children}
    </button>
  );
}

export function SectionToolbar({ style, onChange }: SectionToolbarProps) {
  const [showColor, setShowColor] = useState(false);
  const s = style || {};

  const currentFontIndex = FONT_STEPS.indexOf(s.fontSize || "100%");
  const currentSpacingIndex = SPACING_CYCLE.indexOf(s.spacing || "normal");

  const setAlign = (align: "left" | "center" | "right") => {
    onChange({ ...s, align: s.align === align ? undefined : align });
  };

  const stepFont = (dir: 1 | -1) => {
    const idx = Math.max(0, Math.min(FONT_STEPS.length - 1, (currentFontIndex === -1 ? 2 : currentFontIndex) + dir));
    const val = FONT_STEPS[idx];
    onChange({ ...s, fontSize: val === "100%" ? undefined : val });
  };

  const cycleSpacing = (dir: 1 | -1) => {
    const idx = currentSpacingIndex === -1 ? 2 : currentSpacingIndex;
    const next = Math.max(0, Math.min(SPACING_CYCLE.length - 1, idx + dir));
    const val = SPACING_CYCLE[next];
    onChange({ ...s, spacing: val === "normal" ? undefined : val });
  };

  const toggleGlass = () => {
    onChange({ ...s, glass: !s.glass });
  };

  return (
    <div
      className="flex items-center gap-0.5 px-2 py-1 rounded-lg shadow-lg"
      style={{
        backgroundColor: "var(--slide-bg)",
        border: "1px solid var(--slide-card-border)",
        fontSize: "12px",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Alignment */}
      <ToolbarButton active={s.align === "left"} onClick={() => setAlign("left")} title="Align left">
        <AlignLeft size={14} />
      </ToolbarButton>
      <ToolbarButton active={s.align === "center"} onClick={() => setAlign("center")} title="Align center">
        <AlignCenter size={14} />
      </ToolbarButton>
      <ToolbarButton active={s.align === "right"} onClick={() => setAlign("right")} title="Align right">
        <AlignRight size={14} />
      </ToolbarButton>

      <div className="w-px h-4 mx-1" style={{ backgroundColor: "var(--slide-card-border)" }} />

      {/* Font size */}
      <ToolbarButton onClick={() => stepFont(-1)} title="Decrease font size">
        <Type size={12} />
        <Minus size={8} className="absolute" />
      </ToolbarButton>
      <span className="text-[10px] font-mono min-w-[32px] text-center" style={{ color: "var(--slide-text-muted)" }}>
        {s.fontSize || "100%"}
      </span>
      <ToolbarButton onClick={() => stepFont(1)} title="Increase font size">
        <Type size={12} />
        <Plus size={8} className="absolute" />
      </ToolbarButton>

      <div className="w-px h-4 mx-1" style={{ backgroundColor: "var(--slide-card-border)" }} />

      {/* Spacing */}
      <ToolbarButton onClick={() => cycleSpacing(-1)} title="Decrease spacing">
        <Minus size={14} />
      </ToolbarButton>
      <span className="text-[10px] font-mono min-w-[32px] text-center" style={{ color: "var(--slide-text-muted)" }}>
        {s.spacing || "normal"}
      </span>
      <ToolbarButton onClick={() => cycleSpacing(1)} title="Increase spacing">
        <Plus size={14} />
      </ToolbarButton>

      <div className="w-px h-4 mx-1" style={{ backgroundColor: "var(--slide-card-border)" }} />

      {/* Glass toggle */}
      <ToolbarButton active={!!s.glass} onClick={toggleGlass} title="Toggle glass panel">
        <PanelTop size={14} />
      </ToolbarButton>

      {/* Color */}
      <div className="relative">
        <ToolbarButton onClick={() => setShowColor(!showColor)} title="Text color">
          <Palette size={14} />
        </ToolbarButton>
        {showColor && (
          <div className="absolute bottom-full left-0 mb-2 p-2 rounded-lg shadow-lg" style={{ backgroundColor: "var(--slide-bg)", border: "1px solid var(--slide-card-border)" }}>
            <div className="flex gap-1.5 mb-2">
              {["#FFFFFF", "#FF9900", "#10B981", "#3B82F6", "#EF4444", "#8B5CF6"].map((c) => (
                <button
                  key={c}
                  className="w-5 h-5 rounded-full border border-white/20"
                  style={{ backgroundColor: c }}
                  onClick={() => { onChange({ ...s, color: c }); setShowColor(false); }}
                />
              ))}
            </div>
            <button
              className="text-[10px] w-full text-center"
              style={{ color: "var(--slide-text-muted)" }}
              onClick={() => { onChange({ ...s, color: undefined }); setShowColor(false); }}
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
