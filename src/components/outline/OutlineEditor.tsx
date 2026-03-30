"use client";
import { useState } from "react";
import { Plus, Sparkles } from "lucide-react";
import type { OutlineItem } from "@/lib/types";
import { OutlineItemRow } from "./OutlineItem";

interface Props {
  outline: OutlineItem[];
  onApprove: (outline: OutlineItem[]) => void;
  onRegenerate: () => void;
}

export function OutlineEditor({ outline: initialOutline, onApprove, onRegenerate }: Props) {
  const [outline, setOutline] = useState<OutlineItem[]>(initialOutline);
  const [newSummary, setNewSummary] = useState("");

  const handleDelete = (index: number) => {
    setOutline((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      return updated.map((item, i) => ({ ...item, number: i + 1 }));
    });
  };

  const handleAdd = () => {
    if (!newSummary.trim()) return;
    setOutline((prev) => [...prev, { number: prev.length + 1, summary: newSummary.trim() }]);
    setNewSummary("");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--slide-font-heading)" }}>Your Outline</h2>
      <p className="mb-8" style={{ color: "var(--slide-text-muted)" }}>Review, reorder, add or remove slides. Then generate.</p>
      <div className="space-y-3 mb-8">
        {outline.map((item, i) => (
          <OutlineItemRow key={`${item.number}-${item.summary.slice(0, 20)}`} item={item} onDelete={() => handleDelete(i)} />
        ))}
      </div>
      <div className="flex gap-3 mb-12">
        <input type="text" value={newSummary} onChange={(e) => setNewSummary(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} placeholder="Add a slide... (e.g. 'Key takeaways and next steps')" className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--slide-primary)] transition-colors" />
        <button onClick={handleAdd} disabled={!newSummary.trim()} className="px-4 py-3 rounded-xl border transition-all disabled:opacity-30" style={{ borderColor: "var(--slide-card-border)" }}><Plus size={18} /></button>
      </div>
      <div className="flex justify-between">
        <button onClick={onRegenerate} className="px-6 py-3 rounded-xl border transition-all" style={{ borderColor: "var(--slide-card-border)", color: "var(--slide-text-muted)" }}>Regenerate Outline</button>
        <button onClick={() => onApprove(outline)} disabled={outline.length === 0} className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-30" style={{ backgroundColor: "var(--slide-primary)", color: "var(--slide-bg)" }}><Sparkles size={18} /> Generate {outline.length} Slides</button>
      </div>
    </div>
  );
}
