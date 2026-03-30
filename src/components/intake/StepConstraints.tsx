"use client";
import type { IntakeFormData } from "@/lib/types";

interface Props { data: IntakeFormData; onChange: (data: Partial<IntakeFormData>) => void; }

export function StepConstraints({ data, onChange }: Props) {
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
        <label className="block text-base font-medium mb-3" style={{ color: "var(--slide-text-muted)" }}>Brand Colors (optional)</label>
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-3">
            <label className="text-base" style={{ color: "var(--slide-text-muted)" }}>Primary</label>
            <input type="color" value={data.primaryColor || "#FF9900"} onChange={(e) => onChange({ primaryColor: e.target.value })} className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border border-white/10" />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-base" style={{ color: "var(--slide-text-muted)" }}>Accent</label>
            <input type="color" value={data.accentColor || "#0073BB"} onChange={(e) => onChange({ accentColor: e.target.value })} className="w-12 h-10 rounded-lg cursor-pointer bg-transparent border border-white/10" />
          </div>
          <button onClick={() => onChange({ primaryColor: "", accentColor: "" })} className="text-base underline underline-offset-4" style={{ color: "var(--slide-text-muted)" }}>Let AI decide</button>
        </div>
      </div>
    </div>
  );
}
