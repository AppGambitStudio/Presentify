"use client";

import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ title, message, confirmLabel = "Delete", onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <>
      <div className="fixed inset-0 z-[200]" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={onCancel} />
      <div
        className="fixed z-[210] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm p-6 rounded-2xl shadow-2xl"
        style={{ backgroundColor: "var(--slide-bg)", border: "1px solid var(--slide-card-border)" }}
      >
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(239,68,68,0.15)" }}>
            <AlertTriangle size={20} style={{ color: "#EF4444" }} />
          </div>
          <div>
            <h3 className="font-bold text-base" style={{ fontFamily: "var(--slide-font-heading)" }}>{title}</h3>
            <p className="text-sm mt-1" style={{ color: "var(--slide-text-muted)" }}>{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm transition-colors"
            style={{ color: "var(--slide-text-muted)", border: "1px solid var(--slide-card-border)" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            style={{ backgroundColor: "#EF4444", color: "#fff" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </>
  );
}
