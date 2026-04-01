"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, Type, MessageSquare, Code2, Maximize } from "lucide-react";

const HINTS = [
  { icon: ArrowRight, title: "Navigate slides", desc: "Use arrow keys or click the < > buttons" },
  { icon: Type, title: "Click to edit text", desc: "Click any text on the slide to edit it directly" },
  { icon: MessageSquare, title: "Chat for bigger changes", desc: "Use the chat panel to add sections, change layout, or restyle" },
  { icon: Code2, title: "JSON editor", desc: "Press E to toggle raw JSON editing for full control" },
  { icon: Maximize, title: "Present mode", desc: "Click Present button or use the toggle to go full-screen" },
];

const STORAGE_KEY = "presentify_hints_dismissed";

export function WelcomeHints() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "true");
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.7)" }}>
      <div className="max-w-lg w-full mx-4 rounded-2xl p-8" style={{ backgroundColor: "var(--slide-bg)", border: "1px solid var(--slide-card-border)" }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ fontFamily: "var(--slide-font-heading)" }}>Welcome to your workspace</h2>
            <p className="text-sm mt-1" style={{ color: "var(--slide-text-muted)" }}>Here's how to edit your presentation</p>
          </div>
          <button onClick={dismiss} className="p-2 rounded-lg" style={{ color: "var(--slide-text-muted)" }}>
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          {HINTS.map((hint, i) => (
            <div key={i} className="flex items-start gap-4 p-3 rounded-lg" style={{ backgroundColor: "var(--slide-card-bg)" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--slide-primary)", color: "var(--slide-bg)" }}>
                <hint.icon size={16} />
              </div>
              <div>
                <p className="font-bold text-sm">{hint.title}</p>
                <p className="text-sm" style={{ color: "var(--slide-text-muted)" }}>{hint.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={dismiss}
          className="w-full mt-6 py-3 rounded-xl font-bold text-center transition-transform hover:scale-[1.02]"
          style={{ backgroundColor: "var(--slide-primary)", color: "var(--slide-bg)" }}
        >
          Got it, let's go!
        </button>
      </div>
    </div>
  );
}
