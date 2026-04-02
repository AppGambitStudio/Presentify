"use client";
import { Loader2, Check } from "lucide-react";

interface Props { phase: string; slidesCompleted: number; totalSlides: number; }

export function GenerationProgress({ phase, slidesCompleted, totalSlides }: Props) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <Loader2 size={48} className="animate-spin mx-auto mb-4" style={{ color: "var(--slide-primary)" }} />
        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "var(--slide-font-heading)" }}>
          {phase === "generating-theme" && "Designing your theme..."}
          {phase === "enriching-content" && "Researching facts & finding images..."}
          {phase === "generating-slide" && `Generating slide ${slidesCompleted + 1} of ${totalSlides}...`}
          {!phase && "Starting generation..."}
        </h2>
        <p style={{ color: "var(--slide-text-muted)" }}>AI is crafting your presentation</p>
      </div>
      {totalSlides > 0 && (
        <div className="space-y-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg transition-colors" style={{ backgroundColor: i < slidesCompleted ? "var(--slide-card-bg)" : "transparent", border: i === slidesCompleted ? "1px solid var(--slide-primary)" : "1px solid transparent" }}>
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                {i < slidesCompleted ? <Check size={16} style={{ color: "var(--slide-primary)" }} /> : i === slidesCompleted ? <Loader2 size={14} className="animate-spin" style={{ color: "var(--slide-primary)" }} /> : <span className="text-sm" style={{ color: "var(--slide-text-muted)" }}>{i + 1}</span>}
              </div>
              <span className="text-sm text-left" style={{ color: i <= slidesCompleted ? "var(--slide-text)" : "var(--slide-text-muted)" }}>Slide {i + 1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
