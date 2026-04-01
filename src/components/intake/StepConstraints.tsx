"use client";
import type { IntakeFormData } from "@/lib/types";
import { PaletteSelector } from "@/components/workspace/PaletteSelector";
import { PALETTES, type Palette } from "@/lib/palettes";

interface Props { data: IntakeFormData; onChange: (data: Partial<IntakeFormData>) => void; }

export function StepConstraints({ data, onChange }: Props) {
  const selectedPalette = PALETTES.find(
    (p) => p.theme.primaryColor === data.primaryColor && p.theme.accentColor === data.accentColor
  );

  const handlePaletteSelect = (palette: Palette) => {
    onChange({
      primaryColor: palette.theme.primaryColor,
      accentColor: palette.theme.accentColor,
      // Store palette ID for later use during generation
      paletteId: palette.id,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-base font-medium mb-2" style={{ color: "var(--slide-text-muted)" }}>Dos (things to emphasize)</label>
          <textarea value={data.dos} onChange={(e) => onChange({ dos: e.target.value })} placeholder="e.g. Focus on positive side of AI, encourage experimentation" rows={3} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--slide-primary)] transition-colors resize-none" />
        </div>
        <div>
          <label className="block text-base font-medium mb-2" style={{ color: "var(--slide-text-muted)" }}>Don'ts (things to avoid)</label>
          <textarea value={data.donts} onChange={(e) => onChange({ donts: e.target.value })} placeholder="e.g. Don't fear-monger about AI" rows={3} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--slide-primary)] transition-colors resize-none" />
        </div>
      </div>
      <div>
        <label className="block text-base font-medium mb-3" style={{ color: "var(--slide-text-muted)" }}>
          Color Theme
        </label>
        <p className="text-sm mb-4" style={{ color: "var(--slide-text-muted)" }}>
          Pick a palette or let AI choose based on your topic
        </p>
        <PaletteSelector
          selectedId={selectedPalette?.id}
          onSelect={handlePaletteSelect}
        />
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => onChange({ primaryColor: "", accentColor: "", paletteId: "" })}
            className="text-sm px-4 py-2 rounded-lg transition-colors"
            style={{
              backgroundColor: !data.primaryColor ? "var(--slide-primary)" : "var(--slide-card-bg)",
              color: !data.primaryColor ? "var(--slide-bg)" : "var(--slide-text-muted)",
              border: "1px solid var(--slide-card-border)",
            }}
          >
            Let AI decide
          </button>
        </div>
      </div>
    </div>
  );
}
