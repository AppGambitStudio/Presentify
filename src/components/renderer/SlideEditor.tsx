"use client";

import { useState, useEffect } from "react";
import { Code2, X, Save, Copy, Check } from "lucide-react";
import type { Slide } from "@/lib/types";

interface SlideEditorProps {
  slide: Slide;
  onSave: (updated: Slide) => void;
}

export function SlideEditor({ slide, onSave }: SlideEditorProps) {
  const [json, setJson] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setJson(JSON.stringify(slide, null, 2));
    setError(null);
  }, [slide.id]);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(json) as Slide;
      // Keep the original id
      parsed.id = slide.id;
      setError(null);
      onSave(parsed);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "var(--slide-card-border)" }}>
        <span className="text-sm font-bold" style={{ color: "var(--slide-text-muted)" }}>
          Slide {slide.number} — Raw JSON
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-2 py-1 rounded text-xs flex items-center gap-1"
            style={{ color: "var(--slide-text-muted)" }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 rounded text-xs font-bold flex items-center gap-1"
            style={{ backgroundColor: "var(--slide-primary)", color: "var(--slide-bg)" }}
          >
            <Save size={12} /> Apply
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-3 py-2 text-xs" style={{ color: "#ef4444", backgroundColor: "rgba(239,68,68,0.1)" }}>
          {error}
        </div>
      )}

      {/* Editor */}
      <textarea
        value={json}
        onChange={(e) => setJson(e.target.value)}
        spellCheck={false}
        className="flex-1 p-3 text-xs leading-relaxed resize-none focus:outline-none"
        style={{
          backgroundColor: "rgba(0,0,0,0.3)",
          color: "var(--slide-text)",
          fontFamily: "var(--slide-font-mono)",
          tabSize: 2,
        }}
      />
    </div>
  );
}
