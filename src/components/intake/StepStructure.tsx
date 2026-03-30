"use client";
import type { IntakeFormData } from "@/lib/types";

interface Props { data: IntakeFormData; onChange: (data: Partial<IntakeFormData>) => void; }

const DURATION_OPTIONS = [10, 15, 20, 25, 30] as const;
const TONE_OPTIONS = ["Professional", "Casual", "Humorous", "Inspirational", "Technical", "Storytelling"];

export function StepStructure({ data, onChange }: Props) {
  const toggleTone = (tone: string) => {
    const current = data.tone;
    onChange({ tone: current.includes(tone) ? current.filter((t) => t !== tone) : [...current, tone] });
  };
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-base font-medium mb-3" style={{ color: "var(--slide-text-muted)" }}>Duration *</label>
        <div className="flex gap-3">
          {DURATION_OPTIONS.map((d) => (
            <button key={d} onClick={() => onChange({ duration: d })} className="px-5 py-2.5 rounded-xl border transition-all text-base font-medium" style={{ backgroundColor: data.duration === d ? "var(--slide-primary)" : "transparent", borderColor: data.duration === d ? "var(--slide-primary)" : "var(--slide-card-border)", color: data.duration === d ? "var(--slide-bg)" : "var(--slide-text)" }}>
              {d} min
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-base font-medium mb-3" style={{ color: "var(--slide-text-muted)" }}>Tone (select multiple) *</label>
        <div className="flex flex-wrap gap-2">
          {TONE_OPTIONS.map((tone) => (
            <button key={tone} onClick={() => toggleTone(tone)} className="px-4 py-2 rounded-xl border transition-all text-base" style={{ backgroundColor: data.tone.includes(tone) ? "var(--slide-primary)" : "transparent", borderColor: data.tone.includes(tone) ? "var(--slide-primary)" : "var(--slide-card-border)", color: data.tone.includes(tone) ? "var(--slide-bg)" : "var(--slide-text)" }}>
              {tone}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-base font-medium mb-2" style={{ color: "var(--slide-text-muted)" }}>Key points to cover</label>
        <textarea value={data.keyPoints} onChange={(e) => onChange({ keyPoints: e.target.value })} placeholder="e.g. AI integration patterns, AWS Free Tier, building vs learning" rows={3} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--slide-primary)] transition-colors resize-none" />
      </div>
    </div>
  );
}
