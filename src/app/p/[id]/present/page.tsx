"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { PresentationRenderer } from "@/components/renderer/PresentationRenderer";
import type { PresentationConfig } from "@/lib/types";
import { getPresentation } from "@/lib/store";
import sampleData from "@/lib/sample-presentation.json";

export default function PresentPage() {
  const params = useParams();
  const id = params.id as string;
  const [config, setConfig] = useState<PresentationConfig | null>(null);

  useEffect(() => {
    if (id === "sample") {
      setConfig(sampleData as unknown as PresentationConfig);
    } else {
      const saved = getPresentation(id);
      if (saved) setConfig(saved);
    }
  }, [id]);

  if (!config) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: "var(--slide-bg)" }}>
        <p style={{ color: "var(--slide-text-muted)" }}>Loading presentation...</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen">
      <PresentationRenderer config={config} />
    </div>
  );
}
