"use client";
import type { IntakeFormData } from "@/lib/types";

interface Props { data: IntakeFormData; onChange: (data: Partial<IntakeFormData>) => void; }

export function StepIdentity({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-base font-medium mb-2" style={{ color: "var(--slide-text-muted)" }}>Presentation Title *</label>
        <input type="text" value={data.title} onChange={(e) => onChange({ title: e.target.value })} placeholder="e.g. Building in the Age of AI" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--slide-primary)] transition-colors text-lg" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-base font-medium mb-2" style={{ color: "var(--slide-text-muted)" }}>Your Name *</label>
          <input type="text" value={data.speakerName} onChange={(e) => onChange({ speakerName: e.target.value })} placeholder="Dhaval Nagar" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--slide-primary)] transition-colors" />
        </div>
        <div>
          <label className="block text-base font-medium mb-2" style={{ color: "var(--slide-text-muted)" }}>Role</label>
          <input type="text" value={data.speakerRole} onChange={(e) => onChange({ speakerRole: e.target.value })} placeholder="AWS Hero" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--slide-primary)] transition-colors" />
        </div>
        <div>
          <label className="block text-base font-medium mb-2" style={{ color: "var(--slide-text-muted)" }}>Organization</label>
          <input type="text" value={data.speakerOrganization} onChange={(e) => onChange({ speakerOrganization: e.target.value })} placeholder="AppGambit" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--slide-primary)] transition-colors" />
        </div>
      </div>
    </div>
  );
}
