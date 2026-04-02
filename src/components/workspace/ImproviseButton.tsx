"use client";

import { useState } from "react";
import { Wand2, X, Loader2 } from "lucide-react";
import type { PresentationConfig, Slide } from "@/lib/types";

interface ImproviseButtonProps {
  config: PresentationConfig;
  currentSlide: Slide;
  onSlideUpdate: (slide: Slide) => void;
}

const QUICK_SUGGESTIONS = [
  "Make it more visual and impactful",
  "Add real data and specific examples",
  "Simplify — too much content",
  "Make the tone more engaging",
  "Better structure for comparison",
  "Stronger call-to-action",
];

export function ImproviseButton({ config, currentSlide, onSlideUpdate }: ImproviseButtonProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [guidance, setGuidance] = useState("");
  const [isWorking, setIsWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImprovise = async (text?: string) => {
    const input = text || guidance.trim();
    if (!input) return;
    setIsWorking(true);
    setError(null);

    try {
      const res = await fetch("/api/improvise-slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guidance: input, currentSlide, config }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Improvisation failed");
      }

      const { slide: improved } = await res.json();
      onSlideUpdate(improved);
      setShowPopup(false);
      setGuidance("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowPopup(true)}
        className="p-1.5 rounded-lg transition-all hover:scale-110"
        style={{
          background: "linear-gradient(135deg, #8B5CF6, #EC4899, #F59E0B)",
          color: "#fff",
          border: "none",
          boxShadow: "0 0 8px rgba(139,92,246,0.3)",
        }}
        title="AImprovise this slide (Opus)"
      >
        <Wand2 size={14} />
      </button>

      {showPopup && (
        <>
          <div className="fixed inset-0 z-[90]" onClick={() => { if (!isWorking) { setShowPopup(false); setGuidance(""); setError(null); } }} />
          <div
            className="fixed z-[100] p-5 rounded-2xl shadow-2xl w-[420px]"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "var(--slide-bg)",
              border: "1px solid var(--slide-card-border)",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Wand2 size={18} style={{ color: "var(--slide-primary)" }} />
                <h3 className="font-bold" style={{ fontFamily: "var(--slide-font-heading)" }}>
                  AImprovise Slide {currentSlide.number}
                </h3>
              </div>
              <button
                onClick={() => { if (!isWorking) { setShowPopup(false); setGuidance(""); setError(null); } }}
                className="p-1"
                style={{ color: "var(--slide-text-muted)" }}
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-sm mb-3" style={{ color: "var(--slide-text-muted)" }}>
              Current: &ldquo;{currentSlide.title}&rdquo;
            </p>

            {error && (
              <div className="text-sm p-2 rounded-lg mb-3" style={{ backgroundColor: "rgba(239,68,68,0.1)", color: "#EF4444" }}>
                {error}
              </div>
            )}

            {/* Quick suggestions */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {QUICK_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleImprovise(s)}
                  disabled={isWorking}
                  className="px-2.5 py-1 rounded-lg text-xs transition-colors disabled:opacity-30"
                  style={{ backgroundColor: "var(--slide-card-bg)", color: "var(--slide-text-muted)", border: "1px solid var(--slide-card-border)" }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Custom guidance */}
            <textarea
              value={guidance}
              onChange={(e) => setGuidance(e.target.value)}
              placeholder="Or describe what to improve..."
              disabled={isWorking}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--slide-primary)] transition-colors resize-none disabled:opacity-50"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && guidance.trim()) { e.preventDefault(); handleImprovise(); }
                e.stopPropagation();
              }}
            />

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleImprovise()}
                disabled={!guidance.trim() || isWorking}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold disabled:opacity-30 transition-colors"
                style={{ backgroundColor: "var(--slide-primary)", color: "var(--slide-bg)" }}
              >
                {isWorking ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                {isWorking ? "Opus is thinking..." : "AImprovise"}
              </button>
            </div>

            {isWorking && (
              <p className="text-xs text-center mt-2" style={{ color: "var(--slide-text-muted)" }}>
                This may take a moment.
              </p>
            )}
          </div>
        </>
      )}
    </>
  );
}
