"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { PresentationRenderer } from "@/components/renderer/PresentationRenderer";
import { ChatPanel } from "@/components/workspace/ChatPanel";
import type { PresentationConfig } from "@/lib/types";
import { getPresentation, savePresentation } from "@/lib/store";
import { Presentation, PenLine, HelpCircle, Palette } from "lucide-react";
import Link from "next/link";
import sampleData from "@/lib/sample-presentation.json";
import { SlideControls } from "@/components/workspace/SlideControls";
import { PaletteSelector } from "@/components/workspace/PaletteSelector";
import { PALETTES, type Palette as PaletteType } from "@/lib/palettes";
import { WelcomeHints } from "@/components/workspace/WelcomeHints";

export default function WorkspacePage() {
  const params = useParams();
  const id = params.id as string;
  const [config, setConfig] = useState<PresentationConfig | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  useEffect(() => {
    if (id === "sample") {
      setConfig(sampleData as unknown as PresentationConfig);
    } else {
      const saved = getPresentation(id);
      if (saved) setConfig(saved);
    }
  }, [id]);

  const handleConfigUpdate = useCallback((newConfig: PresentationConfig) => {
    setConfig(newConfig);
    if (id !== "sample") {
      savePresentation(newConfig);
    }
  }, [id]);

  const handleChatMessage = useCallback(async (message: string): Promise<string> => {
    if (!config) throw new Error("No presentation loaded");

    const currentSlide = config.slides[currentSlideIndex];
    setIsEditing(true);

    try {
      const res = await fetch("/api/edit-slide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, currentSlide, config }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Edit failed");
      }

      const { slide: updatedSlide } = await res.json();

      // Update config with the edited slide
      const newConfig = {
        ...config,
        lastModified: new Date().toISOString(),
        slides: config.slides.map((s) =>
          s.id === updatedSlide.id ? updatedSlide : s
        ),
      };
      setConfig(newConfig);
      savePresentation(newConfig);

      // Friendly description of what changed
      const oldSlide = config.slides[currentSlideIndex];
      const changes: string[] = [];
      if (oldSlide.title !== updatedSlide.title) changes.push("title");
      if (oldSlide.subtitle !== updatedSlide.subtitle) changes.push("subtitle");
      if (JSON.stringify(oldSlide.sections) !== JSON.stringify(updatedSlide.sections)) changes.push("content");
      if (JSON.stringify(oldSlide.style) !== JSON.stringify(updatedSlide.style)) changes.push("styling");
      if (oldSlide.gap !== updatedSlide.gap) changes.push("spacing");
      const changeDesc = changes.length > 0 ? `Changed: ${changes.join(", ")}` : "Applied your changes";
      return `✓ Slide ${updatedSlide.number} updated — ${changeDesc}`;
    } finally {
      setIsEditing(false);
    }
  }, [config, currentSlideIndex]);

  if (!config) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: "var(--slide-bg)" }}>
        <p style={{ color: "var(--slide-text-muted)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden" style={{ display: "grid", gridTemplateRows: "auto 1fr", gridTemplateColumns: "1fr 350px", backgroundColor: "var(--slide-bg)" }}>
      {/* Workspace toolbar -- spans both columns */}
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ gridColumn: "1 / -1", borderColor: "var(--slide-card-border)" }}>
        <div className="flex items-center gap-3">
          <PenLine size={16} style={{ color: "var(--slide-primary)" }} />
          <span className="text-sm font-bold" style={{ fontFamily: "var(--slide-font-heading)" }}>
            {config.title}
          </span>
          <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: "var(--slide-card-bg)", color: "var(--slide-text-muted)" }}>
            Workspace
          </span>
        </div>
        <SlideControls config={config} currentSlideIndex={currentSlideIndex} onConfigUpdate={handleConfigUpdate} />
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setShowPalette(!showPalette)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
              style={{ color: showPalette ? "var(--slide-primary)" : "var(--slide-text-muted)", border: "1px solid var(--slide-card-border)" }}
            >
              <Palette size={14} /> Theme
            </button>
            {showPalette && (
              <div className="absolute top-full right-0 mt-2 p-3 rounded-xl shadow-2xl z-50 w-72" style={{ backgroundColor: "var(--slide-bg)", border: "1px solid var(--slide-card-border)" }}>
                <p className="text-xs font-bold mb-2" style={{ color: "var(--slide-text-muted)" }}>Switch palette</p>
                <PaletteSelector
                  selectedId={PALETTES.find((p) => p.theme.primaryColor === config.theme.primaryColor && p.theme.backgroundColor === config.theme.backgroundColor)?.id}
                  onSelect={(palette: PaletteType) => {
                    handleConfigUpdate({ ...config, theme: palette.theme });
                    setShowPalette(false);
                  }}
                  compact
                />
              </div>
            )}
          </div>
          <Link
            href="/help"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors"
            style={{ color: "var(--slide-text-muted)", border: "1px solid var(--slide-card-border)" }}
          >
            <HelpCircle size={14} /> Docs
          </Link>
          <Link
            href={`/p/${id}/present`}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-transform hover:scale-105"
            style={{ backgroundColor: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <Presentation size={14} /> Present
          </Link>
        </div>
      </div>

      {/* Preview -- row 2, col 1 */}
      <div className="relative overflow-hidden" style={{ minHeight: 0 }}>
        <PresentationRenderer config={config} onSlideChange={setCurrentSlideIndex} workspaceMode={true} />
      </div>

      {/* Chat Panel -- row 2, col 2 */}
      <ChatPanel
        onSendMessage={handleChatMessage}
        isLoading={isEditing}
        slideNumber={config.slides[currentSlideIndex]?.number || 1}
      />
      <WelcomeHints />
    </div>
  );
}
