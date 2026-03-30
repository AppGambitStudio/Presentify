"use client";
import { IntakeWizard } from "@/components/intake/IntakeWizard";
import type { IntakeFormData } from "@/lib/types";

export default function CreatePage() {
  const handleSubmit = (data: IntakeFormData) => {
    console.log("Intake submitted:", data);
  };
  return (
    <div className="min-h-screen flex flex-col justify-center px-6 py-16" style={{ backgroundColor: "var(--slide-bg)" }}>
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: "var(--slide-font-heading)" }}>Create a Presentation</h1>
        <p style={{ color: "var(--slide-text-muted)" }}>Tell us about your talk and AI will generate a beautiful presentation</p>
      </div>
      <IntakeWizard onSubmit={handleSubmit} />
    </div>
  );
}
