"use client";
import type { IntakeFormData } from "@/lib/types";

interface Props { data: IntakeFormData; onChange: (data: Partial<IntakeFormData>) => void; }

export function StepContext({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-base font-medium mb-2" style={{ color: "var(--slide-text-muted)" }}>Who is your audience? *</label>
        <textarea value={data.audience} onChange={(e) => onChange({ audience: e.target.value })} placeholder="e.g. CS students, 2nd-4th year, at a university community day" rows={3} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--slide-primary)] transition-colors resize-none" />
      </div>
      <div>
        <label className="block text-base font-medium mb-2" style={{ color: "var(--slide-text-muted)" }}>What's the goal? *</label>
        <textarea value={data.purpose} onChange={(e) => onChange({ purpose: e.target.value })} placeholder="e.g. Inspire students to experiment with AI and cloud tools" rows={3} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--slide-primary)] transition-colors resize-none" />
      </div>
    </div>
  );
}
