"use client";
import { motion } from "motion/react";
import type { SlideDecoration } from "@/lib/types";

interface SlideDecorationsProps { decorations: SlideDecoration[]; }

function GlowPulse() {
  return (
    <>
      <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 15, repeat: Infinity }} className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]" style={{ backgroundColor: "var(--slide-accent)" }} />
      <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 15, repeat: Infinity, delay: 7 }} className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[120px]" style={{ backgroundColor: "var(--slide-primary)" }} />
    </>
  );
}

function RotatingIcon() {
  return (
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
      <div className="w-64 h-64 border-2 rounded-3xl" style={{ borderColor: "var(--slide-primary)" }} />
    </motion.div>
  );
}

function GradientBlob() {
  return (
    <motion.div animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full blur-[150px] opacity-10" style={{ background: `radial-gradient(circle, var(--slide-primary), var(--slide-accent))` }} />
  );
}

function Shimmer() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-0 w-1/3 h-full" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.03), transparent)" }} />
    </div>
  );
}

const decorationMap: Record<SlideDecoration, React.ComponentType> = {
  "glow-pulse": GlowPulse,
  "rotating-icon": RotatingIcon,
  "gradient-blob": GradientBlob,
  "shimmer": Shimmer,
};

export function SlideDecorations({ decorations }: SlideDecorationsProps) {
  if (decorations.length === 0) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {decorations.map((d) => {
        const Decoration = decorationMap[d];
        return Decoration ? <Decoration key={d} /> : null;
      })}
    </div>
  );
}
