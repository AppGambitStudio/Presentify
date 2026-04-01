"use client";

import { Plus, Trash2, ChevronUp, ChevronDown, Copy } from "lucide-react";
import type { PresentationConfig, Slide } from "@/lib/types";

interface SlideControlsProps {
  config: PresentationConfig;
  currentSlideIndex: number;
  onConfigUpdate: (config: PresentationConfig) => void;
}

export function SlideControls({ config, currentSlideIndex, onConfigUpdate }: SlideControlsProps) {
  const totalSlides = config.slides.length;
  const currentSlide = config.slides[currentSlideIndex];

  const addSlideAfter = () => {
    const newSlide: Slide = {
      id: `slide_new_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      number: currentSlideIndex + 2,
      summary: "New slide",
      title: "New Slide",
      sections: [],
      speakerNotes: "",
      decorations: [],
    };
    const newSlides = [...config.slides];
    newSlides.splice(currentSlideIndex + 1, 0, newSlide);
    // Renumber
    const renumbered = newSlides.map((s, i) => ({ ...s, number: i + 1 }));
    onConfigUpdate({ ...config, slides: renumbered, lastModified: new Date().toISOString() });
  };

  const duplicateSlide = () => {
    const dup: Slide = {
      ...JSON.parse(JSON.stringify(currentSlide)),
      id: `slide_dup_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    };
    const newSlides = [...config.slides];
    newSlides.splice(currentSlideIndex + 1, 0, dup);
    const renumbered = newSlides.map((s, i) => ({ ...s, number: i + 1 }));
    onConfigUpdate({ ...config, slides: renumbered, lastModified: new Date().toISOString() });
  };

  const deleteSlide = () => {
    if (totalSlides <= 1) return;
    const newSlides = config.slides.filter((_, i) => i !== currentSlideIndex);
    const renumbered = newSlides.map((s, i) => ({ ...s, number: i + 1 }));
    onConfigUpdate({ ...config, slides: renumbered, lastModified: new Date().toISOString() });
  };

  const moveSlide = (dir: -1 | 1) => {
    const targetIndex = currentSlideIndex + dir;
    if (targetIndex < 0 || targetIndex >= totalSlides) return;
    const newSlides = [...config.slides];
    [newSlides[currentSlideIndex], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[currentSlideIndex]];
    const renumbered = newSlides.map((s, i) => ({ ...s, number: i + 1 }));
    onConfigUpdate({ ...config, slides: renumbered, lastModified: new Date().toISOString() });
  };

  const btnClass = "p-1.5 rounded-lg transition-colors disabled:opacity-20";
  const btnStyle = { color: "var(--slide-text-muted)", backgroundColor: "var(--slide-card-bg)", border: "1px solid var(--slide-card-border)" };

  return (
    <div className="flex items-center gap-1.5">
      <button onClick={() => moveSlide(-1)} disabled={currentSlideIndex === 0} className={btnClass} style={btnStyle} title="Move slide up">
        <ChevronUp size={14} />
      </button>
      <button onClick={() => moveSlide(1)} disabled={currentSlideIndex === totalSlides - 1} className={btnClass} style={btnStyle} title="Move slide down">
        <ChevronDown size={14} />
      </button>
      <button onClick={addSlideAfter} className={btnClass} style={btnStyle} title="Add slide after this">
        <Plus size={14} />
      </button>
      <button onClick={duplicateSlide} className={btnClass} style={btnStyle} title="Duplicate slide">
        <Copy size={14} />
      </button>
      <button onClick={deleteSlide} disabled={totalSlides <= 1} className={btnClass} style={{ ...btnStyle, color: totalSlides <= 1 ? "var(--slide-text-muted)" : "#EF4444" }} title="Delete slide">
        <Trash2 size={14} />
      </button>
    </div>
  );
}
