"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import type { IntakeFormData } from "@/lib/types";
import { StepIdentity } from "./StepIdentity";
import { StepContext } from "./StepContext";
import { StepStructure } from "./StepStructure";
import { StepConstraints } from "./StepConstraints";

const STEPS = [
  { title: "Identity", subtitle: "Who's presenting?" },
  { title: "Context", subtitle: "Who's listening?" },
  { title: "Structure", subtitle: "How long and what tone?" },
  { title: "Constraints", subtitle: "Any do's and don'ts?" },
];

const DEFAULT_FORM: IntakeFormData = {
  title: "", speakerName: "", speakerRole: "", speakerOrganization: "",
  audience: "", purpose: "", duration: 20, tone: [], keyPoints: "",
  paletteId: "", maxSlides: 0,
  dos: "", donts: "", primaryColor: "", accentColor: "",
};

interface Props { onSubmit: (data: IntakeFormData) => void; }

const DRAFT_KEY = "presentify_intake_draft";

function loadDraft(): { step: number; data: IntakeFormData } {
  if (typeof window === "undefined") return { step: 0, data: DEFAULT_FORM };
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { step: 0, data: DEFAULT_FORM };
}

function saveDraft(step: number, data: IntakeFormData) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, data })); } catch {}
}

export function clearIntakeDraft() {
  try { localStorage.removeItem(DRAFT_KEY); } catch {}
}

export function IntakeWizard({ onSubmit }: Props) {
  const draft = loadDraft();
  const [step, setStep] = useState(draft.step);
  const [data, setData] = useState<IntakeFormData>(draft.data);

  const handleChange = (partial: Partial<IntakeFormData>) => {
    setData((prev) => {
      const next = { ...prev, ...partial };
      saveDraft(step, next);
      return next;
    });
  };

  const canProceed = () => {
    switch (step) {
      case 0: return data.title.trim() !== "" && data.speakerName.trim() !== "";
      case 1: return data.audience.trim() !== "" && data.purpose.trim() !== "";
      case 2: return data.tone.length > 0;
      case 3: return true;
      default: return false;
    }
  };

  const steps = [
    <StepIdentity key="identity" data={data} onChange={handleChange} />,
    <StepContext key="context" data={data} onChange={handleChange} />,
    <StepStructure key="structure" data={data} onChange={handleChange} />,
    <StepConstraints key="constraints" data={data} onChange={handleChange} />,
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-12">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors" style={{ backgroundColor: i <= step ? "var(--slide-primary)" : "var(--slide-card-bg)", color: i <= step ? "var(--slide-bg)" : "var(--slide-text-muted)" }}>{i + 1}</div>
            <span className="text-sm hidden md:block" style={{ color: i <= step ? "var(--slide-text)" : "var(--slide-text-muted)" }}>{s.title}</span>
            {i < STEPS.length - 1 && <div className="flex-1 h-px mx-2" style={{ backgroundColor: i < step ? "var(--slide-primary)" : "var(--slide-card-border)" }} />}
          </div>
        ))}
      </div>
      <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--slide-font-heading)" }}>{STEPS[step].title}</h2>
      <p className="mb-8" style={{ color: "var(--slide-text-muted)" }}>{STEPS[step].subtitle}</p>
      {steps[step]}
      <div className="flex justify-between mt-12">
        <button onClick={() => { const s = step - 1; setStep(s); saveDraft(s, data); }} disabled={step === 0} className="flex items-center gap-2 px-6 py-3 rounded-xl border transition-all disabled:opacity-20" style={{ borderColor: "var(--slide-card-border)" }}><ChevronLeft size={18} /> Back</button>
        {step < STEPS.length - 1 ? (
          <button onClick={() => { const s = step + 1; setStep(s); saveDraft(s, data); }} disabled={!canProceed()} className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-30" style={{ backgroundColor: "var(--slide-primary)", color: "var(--slide-bg)" }}>Next <ChevronRight size={18} /></button>
        ) : (
          <button onClick={() => { clearIntakeDraft(); onSubmit(data); }} disabled={!canProceed()} className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-30" style={{ backgroundColor: "var(--slide-primary)", color: "var(--slide-bg)" }}><Sparkles size={18} /> Generate Presentation</button>
        )}
      </div>
    </div>
  );
}
