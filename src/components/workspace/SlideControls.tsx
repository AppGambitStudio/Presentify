"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Copy, Sparkles, X, Loader2 } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";
import type { PresentationConfig, Slide } from "@/lib/types";

interface SlideControlsProps {
  config: PresentationConfig;
  currentSlideIndex: number;
  onConfigUpdate: (config: PresentationConfig) => void;
}

export function SlideControls({ config, currentSlideIndex, onConfigUpdate }: SlideControlsProps) {
  const totalSlides = config.slides.length;
  const currentSlide = config.slides[currentSlideIndex];
  const [showAddPrompt, setShowAddPrompt] = useState(false);
  const [newSlideDesc, setNewSlideDesc] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const addSlideWithAI = async () => {
    if (!newSlideDesc.trim()) return;
    setIsGenerating(true);

    try {
      // Call the edit API with a "generate new slide" instruction
      const res = await fetch("/api/generate-slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: newSlideDesc.trim(),
          insertAfter: currentSlideIndex,
          config,
        }),
      });

      if (!res.ok) {
        // Fallback: create a simple slide with the description as title
        addEmptySlide(newSlideDesc.trim());
        return;
      }

      const { slide: generatedSlide } = await res.json();

      const newSlides = [...config.slides];
      newSlides.splice(currentSlideIndex + 1, 0, generatedSlide);
      const renumbered = newSlides.map((s, i) => ({ ...s, number: i + 1 }));
      onConfigUpdate({ ...config, slides: renumbered, lastModified: new Date().toISOString() });
    } catch {
      // Fallback on error
      addEmptySlide(newSlideDesc.trim());
    } finally {
      setIsGenerating(false);
      setShowAddPrompt(false);
      setNewSlideDesc("");
    }
  };

  const addEmptySlide = (title: string = "New Slide") => {
    const newSlide: Slide = {
      id: `slide_new_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      number: currentSlideIndex + 2,
      summary: title,
      title: title,
      sections: [],
      speakerNotes: "",
      decorations: [],
    };
    const newSlides = [...config.slides];
    newSlides.splice(currentSlideIndex + 1, 0, newSlide);
    const renumbered = newSlides.map((s, i) => ({ ...s, number: i + 1 }));
    onConfigUpdate({ ...config, slides: renumbered, lastModified: new Date().toISOString() });
    setShowAddPrompt(false);
    setNewSlideDesc("");
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
    <div className="flex items-center gap-1.5 relative">
      <button onClick={() => moveSlide(-1)} disabled={currentSlideIndex === 0} className={btnClass} style={btnStyle} title="Move slide up">
        <ChevronUp size={14} />
      </button>
      <button onClick={() => moveSlide(1)} disabled={currentSlideIndex === totalSlides - 1} className={btnClass} style={btnStyle} title="Move slide down">
        <ChevronDown size={14} />
      </button>
      <button onClick={() => setShowAddPrompt(true)} className={btnClass} style={btnStyle} title="Add slide after this">
        <Plus size={14} />
      </button>
      <button onClick={duplicateSlide} className={btnClass} style={btnStyle} title="Duplicate slide">
        <Copy size={14} />
      </button>
      <button onClick={() => setShowDeleteConfirm(true)} disabled={totalSlides <= 1} className={btnClass} style={{ ...btnStyle, color: totalSlides <= 1 ? "var(--slide-text-muted)" : "#EF4444" }} title="Delete slide">
        <Trash2 size={14} />
      </button>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete slide?"
          message={`This will remove slide ${currentSlideIndex + 1}: "${currentSlide.title}". This cannot be undone.`}
          confirmLabel="Delete slide"
          onConfirm={() => { deleteSlide(); setShowDeleteConfirm(false); }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {/* Add slide prompt */}
      {showAddPrompt && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => { setShowAddPrompt(false); setNewSlideDesc(""); }} />
          <div
            className="fixed z-[100] p-4 rounded-xl shadow-2xl w-96"
            style={{
              top: "50px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "var(--slide-bg)",
              border: "1px solid var(--slide-card-border)",
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-bold" style={{ fontFamily: "var(--slide-font-heading)" }}>
                Add slide after #{currentSlideIndex + 1}
              </p>
              <button onClick={() => { setShowAddPrompt(false); setNewSlideDesc(""); }} className="p-1" style={{ color: "var(--slide-text-muted)" }}>
                <X size={14} />
              </button>
            </div>
            <input
              type="text"
              value={newSlideDesc}
              onChange={(e) => setNewSlideDesc(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newSlideDesc.trim()) addSlideWithAI();
                e.stopPropagation();
              }}
              placeholder="What should this slide cover?"
              disabled={isGenerating}
              autoFocus
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--slide-primary)] transition-colors disabled:opacity-50"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={addSlideWithAI}
                disabled={!newSlideDesc.trim() || isGenerating}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold disabled:opacity-30 transition-colors"
                style={{ backgroundColor: "var(--slide-primary)", color: "var(--slide-bg)" }}
              >
                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {isGenerating ? "Generating..." : "Generate with AI"}
              </button>
              <button
                onClick={() => addEmptySlide(newSlideDesc.trim() || "New Slide")}
                disabled={isGenerating}
                className="px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-30"
                style={{ color: "var(--slide-text-muted)", border: "1px solid var(--slide-card-border)" }}
              >
                Empty
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
