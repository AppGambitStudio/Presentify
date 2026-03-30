"use client";
import { motion } from "motion/react";

interface ProgressBarProps { current: number; total: number; }

export function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="fixed bottom-0 left-0 w-full h-1 z-50" style={{ backgroundColor: "var(--slide-card-bg)" }}>
      <motion.div className="h-full" style={{ backgroundColor: "var(--slide-primary)" }} initial={false} animate={{ width: `${((current + 1) / total) * 100}%` }} transition={{ duration: 0.3 }} />
    </div>
  );
}
