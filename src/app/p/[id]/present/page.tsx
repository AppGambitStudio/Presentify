"use client";

import { PresentationRenderer } from "@/components/renderer/PresentationRenderer";
import type { PresentationConfig } from "@/lib/types";
import sampleData from "@/lib/sample-presentation.json";

export default function PresentPage() {
  const config = sampleData as unknown as PresentationConfig;
  return <PresentationRenderer config={config} />;
}
