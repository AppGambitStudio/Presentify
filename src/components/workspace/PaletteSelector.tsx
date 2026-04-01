"use client";

import { Check } from "lucide-react";
import { PALETTES, type Palette } from "@/lib/palettes";

interface PaletteSelectorProps {
  selectedId?: string;
  onSelect: (palette: Palette) => void;
  compact?: boolean;
}

export function PaletteSelector({ selectedId, onSelect, compact = false }: PaletteSelectorProps) {
  if (compact) {
    return (
      <div className="flex gap-1.5 flex-wrap">
        {PALETTES.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            title={p.name}
            className="relative w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
            style={{
              background: `linear-gradient(135deg, ${p.preview[0]} 50%, ${p.preview[1]} 50%)`,
              borderColor: selectedId === p.id ? p.preview[1] : "transparent",
            }}
          >
            {selectedId === p.id && (
              <Check size={12} className="absolute inset-0 m-auto" style={{ color: p.theme.darkMode ? "#fff" : "#000" }} />
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {PALETTES.map((p) => {
        const isSelected = selectedId === p.id;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className="rounded-xl p-3 text-left transition-all hover:scale-[1.03]"
            style={{
              backgroundColor: p.preview[0],
              border: isSelected ? `2px solid ${p.preview[1]}` : "2px solid transparent",
              boxShadow: isSelected ? `0 0 12px ${p.preview[1]}40` : undefined,
            }}
          >
            {/* Color swatches */}
            <div className="flex gap-1.5 mb-2">
              {p.preview.map((color, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: color, border: "1px solid rgba(128,128,128,0.3)" }}
                />
              ))}
            </div>
            {/* Name */}
            <span
              className="text-xs font-bold"
              style={{ color: p.theme.textColor }}
            >
              {p.name}
            </span>
            {isSelected && (
              <Check size={14} className="inline ml-1" style={{ color: p.preview[1] }} />
            )}
          </button>
        );
      })}
    </div>
  );
}
