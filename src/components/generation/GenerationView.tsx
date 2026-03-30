"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { IntakeFormData, OutlineItem, PresentationConfig } from "@/lib/types";
import { IntakeWizard } from "@/components/intake/IntakeWizard";
import { OutlineEditor } from "@/components/outline/OutlineEditor";
import { GenerationProgress } from "./GenerationProgress";
import { savePresentation } from "@/lib/store";

type Phase = "intake" | "loading-outline" | "outline" | "generating" | "complete";

export function GenerationView() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intake");
  const [intake, setIntake] = useState<IntakeFormData | null>(null);
  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [genPhase, setGenPhase] = useState("");
  const [slidesCompleted, setSlidesCompleted] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleIntakeSubmit = useCallback(async (data: IntakeFormData) => {
    setIntake(data);
    setPhase("loading-outline");
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate outline");
      }
      const { outline: generatedOutline } = await res.json();
      setOutline(generatedOutline);
      setPhase("outline");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setPhase("intake");
    }
  }, []);

  const handleOutlineApprove = useCallback(async (approvedOutline: OutlineItem[]) => {
    if (!intake) return;
    setPhase("generating");
    setTotalSlides(approvedOutline.length);
    setSlidesCompleted(0);
    setGenPhase("");
    setError(null);
    try {
      const res = await fetch("/api/generate-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intake, outline: approvedOutline }),
      });
      if (!res.body) throw new Error("No response body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        let eventType = "";
        for (const line of lines) {
          if (line.startsWith("event: ")) {
            eventType = line.slice(7);
          } else if (line.startsWith("data: ") && eventType) {
            const data = JSON.parse(line.slice(6));
            switch (eventType) {
              case "status": setGenPhase(data.phase); break;
              case "theme": setGenPhase("generating-slide"); break;
              case "slide": setSlidesCompleted((prev) => prev + 1); break;
              case "config":
                savePresentation(data as PresentationConfig);
                setPhase("complete");
                router.push(`/p/${(data as PresentationConfig).id}/present`);
                break;
              case "error": throw new Error(data.message);
            }
            eventType = "";
          }
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setPhase("outline");
    }
  }, [intake, router]);

  const handleRegenerate = useCallback(() => {
    if (intake) handleIntakeSubmit(intake);
  }, [intake, handleIntakeSubmit]);

  return (
    <div className="min-h-screen px-6 py-16 overflow-y-auto" style={{ backgroundColor: "var(--slide-bg)" }}>
      {error && (
        <div className="max-w-3xl mx-auto mb-8 p-4 rounded-xl text-center" style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}>
          {error}
        </div>
      )}
      {phase === "intake" && (
        <>
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "var(--slide-font-heading)" }}>Create a Presentation</h1>
            <p style={{ color: "var(--slide-text-muted)" }}>Tell us about your talk and AI will generate a beautiful presentation</p>
          </div>
          <IntakeWizard onSubmit={handleIntakeSubmit} />
        </>
      )}
      {phase === "loading-outline" && (
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-white/10 border-t-[var(--slide-primary)] rounded-full mx-auto mb-4" />
          <p className="text-xl" style={{ fontFamily: "var(--slide-font-heading)" }}>Planning your presentation...</p>
          <p style={{ color: "var(--slide-text-muted)" }}>AI is designing the narrative arc</p>
        </div>
      )}
      {phase === "outline" && (
        <OutlineEditor outline={outline} onApprove={handleOutlineApprove} onRegenerate={handleRegenerate} />
      )}
      {phase === "generating" && (
        <GenerationProgress phase={genPhase} slidesCompleted={slidesCompleted} totalSlides={totalSlides} />
      )}
    </div>
  );
}
