"use client";
import { useState } from "react";
import { GripVertical, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import type { OutlineItem as OutlineItemType } from "@/lib/types";

interface Props {
  item: OutlineItemType;
  onDelete: () => void;
}

export function OutlineItemRow({ item, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const hasDetails = item.keyMessage || (item.talkingPoints && item.talkingPoints.length > 0) || item.suggestedComponents;

  return (
    <div className="rounded-xl group transition-colors" style={{ backgroundColor: "var(--slide-card-bg)", border: "1px solid var(--slide-card-border)" }}>
      <div className="flex items-center gap-4 p-4">
        <GripVertical size={18} className="shrink-0 cursor-grab opacity-30 group-hover:opacity-70 transition-opacity" style={{ color: "var(--slide-text-muted)" }} />
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ backgroundColor: "var(--slide-primary)", color: "var(--slide-bg)" }}>{item.number}</div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium">{item.summary}</p>
          {item.keyMessage && !expanded && (
            <p className="text-xs mt-1 truncate" style={{ color: "var(--slide-text-muted)" }}>{item.keyMessage}</p>
          )}
        </div>
        {hasDetails && (
          <button onClick={() => setExpanded(!expanded)} className="p-1 opacity-50 hover:opacity-100 transition-opacity" style={{ color: "var(--slide-text-muted)" }}>
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
        <button onClick={onDelete} className="opacity-0 group-hover:opacity-70 hover:!opacity-100 transition-opacity p-1" style={{ color: "var(--slide-text-muted)" }}>
          <Trash2 size={16} />
        </button>
      </div>

      {/* Expanded details */}
      {expanded && hasDetails && (
        <div className="px-4 pb-4 ml-16 space-y-2 text-sm" style={{ color: "var(--slide-text-muted)" }}>
          {item.keyMessage && (
            <p><span className="font-bold" style={{ color: "var(--slide-primary)" }}>Key message:</span> {item.keyMessage}</p>
          )}
          {item.talkingPoints && item.talkingPoints.length > 0 && (
            <div>
              <span className="font-bold">Talking points:</span>
              <ul className="ml-4 mt-1 space-y-0.5">
                {item.talkingPoints.map((tp, i) => (
                  <li key={i} className="list-disc">{tp}</li>
                ))}
              </ul>
            </div>
          )}
          {item.suggestedComponents && (
            <p><span className="font-bold">Structure:</span> {item.suggestedComponents}</p>
          )}
          {item.tone && (
            <p><span className="font-bold">Tone:</span> {item.tone}</p>
          )}
        </div>
      )}
    </div>
  );
}
