"use client";
import { GripVertical, Trash2 } from "lucide-react";
import type { OutlineItem as OutlineItemType } from "@/lib/types";

interface Props {
  item: OutlineItemType;
  onDelete: () => void;
}

export function OutlineItemRow({ item, onDelete }: Props) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl group transition-colors" style={{ backgroundColor: "var(--slide-card-bg)", border: "1px solid var(--slide-card-border)" }}>
      <GripVertical size={18} className="shrink-0 cursor-grab opacity-30 group-hover:opacity-70 transition-opacity" style={{ color: "var(--slide-text-muted)" }} />
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0" style={{ backgroundColor: "var(--slide-primary)", color: "var(--slide-bg)" }}>{item.number}</div>
      <p className="flex-1 text-base">{item.summary}</p>
      <button onClick={onDelete} className="opacity-0 group-hover:opacity-70 hover:!opacity-100 transition-opacity p-1" style={{ color: "var(--slide-text-muted)" }}>
        <Trash2 size={16} />
      </button>
    </div>
  );
}
