"use client";
import { useState } from "react";
import { GripVertical, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import type { OutlineItem as OutlineItemType, SlideType, SLIDE_TYPES } from "@/lib/types";

// Import the array directly since we need it at runtime
const SLIDE_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "title", label: "Title" },
  { value: "agenda", label: "Agenda" },
  { value: "context", label: "Context" },
  { value: "content", label: "Content" },
  { value: "comparison", label: "Comparison" },
  { value: "data", label: "Data" },
  { value: "demo", label: "Demo" },
  { value: "story", label: "Story" },
  { value: "quote", label: "Quote" },
  { value: "action", label: "Action" },
  { value: "closing", label: "Closing" },
  { value: "thankyou", label: "Thank You" },
];

interface Props {
  item: OutlineItemType;
  onDelete: () => void;
  onUpdate: (updated: OutlineItemType) => void;
}

export function OutlineItemRow({ item, onDelete, onUpdate }: Props) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = item.keyMessage || (item.talkingPoints && item.talkingPoints.length > 0) || item.suggestedComponents;

  const handleFieldChange = (field: keyof OutlineItemType, value: any) => {
    onUpdate({ ...item, [field]: value });
  };

  const typeLabel = SLIDE_TYPE_OPTIONS.find((t) => t.value === item.slideType)?.label || item.slideType;

  return (
    <div className="rounded-xl group transition-colors" style={{ backgroundColor: "var(--slide-card-bg)", border: "1px solid var(--slide-card-border)" }}>
      <div className="flex items-center gap-3 p-4">
        <GripVertical size={18} className="shrink-0 cursor-grab opacity-30 group-hover:opacity-70 transition-opacity" style={{ color: "var(--slide-text-muted)" }} />
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ backgroundColor: "var(--slide-primary)", color: "var(--slide-bg)" }}>{item.number}</div>

        {/* Slide type badge */}
        <select
          value={item.slideType || "content"}
          onChange={(e) => handleFieldChange("slideType", e.target.value as SlideType)}
          className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-transparent cursor-pointer focus:outline-none"
          style={{ color: "var(--slide-primary)", border: "1px solid var(--slide-card-border)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {SLIDE_TYPE_OPTIONS.map((t) => (
            <option key={t.value} value={t.value} style={{ backgroundColor: "var(--slide-bg)", color: "var(--slide-text)" }}>
              {t.label}
            </option>
          ))}
        </select>

        {/* Editable summary */}
        <input
          type="text"
          value={item.summary}
          onChange={(e) => handleFieldChange("summary", e.target.value)}
          className="flex-1 text-base bg-transparent focus:outline-none focus:border-b"
          style={{ borderBottom: "1px dashed transparent", color: "var(--slide-text)" }}
          onFocus={(e) => { e.currentTarget.style.borderBottomColor = "var(--slide-primary)"; }}
          onBlur={(e) => { e.currentTarget.style.borderBottomColor = "transparent"; }}
          onKeyDown={(e) => e.stopPropagation()}
        />

        {hasDetails && (
          <button onClick={() => setExpanded(!expanded)} className="p-1 opacity-50 hover:opacity-100 transition-opacity" style={{ color: "var(--slide-text-muted)" }}>
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
        <button onClick={onDelete} className="opacity-0 group-hover:opacity-70 hover:!opacity-100 transition-opacity p-1" style={{ color: "var(--slide-text-muted)" }}>
          <Trash2 size={16} />
        </button>
      </div>

      {/* Expanded editable details */}
      {expanded && (
        <div className="px-4 pb-4 ml-16 space-y-3 text-sm">
          {/* Key Message */}
          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: "var(--slide-primary)" }}>Key Message</label>
            <input
              type="text"
              value={item.keyMessage || ""}
              onChange={(e) => handleFieldChange("keyMessage", e.target.value)}
              placeholder="The ONE thing the audience should remember"
              className="w-full bg-transparent px-2 py-1.5 rounded-lg text-sm focus:outline-none"
              style={{ border: "1px solid var(--slide-card-border)", color: "var(--slide-text)" }}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>

          {/* Talking Points */}
          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: "var(--slide-text-muted)" }}>Talking Points</label>
            {(item.talkingPoints || []).map((tp, i) => (
              <div key={i} className="flex items-center gap-2 mb-1">
                <span className="text-xs" style={{ color: "var(--slide-text-muted)" }}>•</span>
                <input
                  type="text"
                  value={tp}
                  onChange={(e) => {
                    const newTps = [...(item.talkingPoints || [])];
                    newTps[i] = e.target.value;
                    handleFieldChange("talkingPoints", newTps);
                  }}
                  className="flex-1 bg-transparent px-2 py-1 rounded text-sm focus:outline-none"
                  style={{ border: "1px solid var(--slide-card-border)", color: "var(--slide-text)" }}
                  onKeyDown={(e) => e.stopPropagation()}
                />
                <button
                  onClick={() => {
                    const newTps = (item.talkingPoints || []).filter((_, j) => j !== i);
                    handleFieldChange("talkingPoints", newTps);
                  }}
                  className="text-xs px-1" style={{ color: "var(--slide-text-muted)" }}
                >×</button>
              </div>
            ))}
            <button
              onClick={() => handleFieldChange("talkingPoints", [...(item.talkingPoints || []), ""])}
              className="text-xs px-2 py-1 rounded-lg mt-1"
              style={{ color: "var(--slide-primary)", border: "1px solid var(--slide-card-border)" }}
            >+ Add point</button>
          </div>

          {/* Suggested Components */}
          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: "var(--slide-text-muted)" }}>Suggested Structure</label>
            <input
              type="text"
              value={item.suggestedComponents || ""}
              onChange={(e) => handleFieldChange("suggestedComponents", e.target.value)}
              placeholder="e.g. two-column BulletList, StatCallout + CardGrid"
              className="w-full bg-transparent px-2 py-1.5 rounded-lg text-sm focus:outline-none"
              style={{ border: "1px solid var(--slide-card-border)", color: "var(--slide-text)" }}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>

          {/* Tone */}
          <div>
            <label className="text-xs font-bold block mb-1" style={{ color: "var(--slide-text-muted)" }}>Tone</label>
            <input
              type="text"
              value={item.tone || ""}
              onChange={(e) => handleFieldChange("tone", e.target.value)}
              placeholder="e.g. humorous, inspiring, data-driven"
              className="w-full bg-transparent px-2 py-1.5 rounded-lg text-sm focus:outline-none"
              style={{ border: "1px solid var(--slide-card-border)", color: "var(--slide-text)" }}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
