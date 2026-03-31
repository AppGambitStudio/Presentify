"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { PresentationRenderer } from "@/components/renderer/PresentationRenderer";
import { ChatPanel } from "@/components/workspace/ChatPanel";
import type { PresentationConfig } from "@/lib/types";
import { getPresentation, savePresentation } from "@/lib/store";
import sampleData from "@/lib/sample-presentation.json";

export default function WorkspacePage() {
  const params = useParams();
  const id = params.id as string;
  const [config, setConfig] = useState<PresentationConfig | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id === "sample") {
      setConfig(sampleData as unknown as PresentationConfig);
    } else {
      const saved = getPresentation(id);
      if (saved) setConfig(saved);
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

      return `Updated slide ${updatedSlide.number}: "${updatedSlide.title}"`;
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
    <div className="w-screen h-screen overflow-hidden" style={{ display: "grid", gridTemplateColumns: "1fr 350px", backgroundColor: "var(--slide-bg)" }}>
      {/* Preview */}
      <div className="relative overflow-hidden">
        <PresentationRenderer config={config} onSlideChange={setCurrentSlideIndex} />
      </div>

      {/* Chat Panel */}
      <ChatPanel
        onSendMessage={handleChatMessage}
        isLoading={isEditing}
        slideNumber={config.slides[currentSlideIndex]?.number || 1}
      />
    </div>
  );
}
