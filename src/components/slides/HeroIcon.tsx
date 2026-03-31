"use client";
import { resolveIcon } from "@/lib/iconResolver";
import { motion } from "motion/react";

interface HeroIconProps { icon: string; size?: number; caption: string; subcaption?: string; glowColor?: string; }


export function HeroIcon({ icon, size = 96, caption, subcaption, glowColor }: HeroIconProps) {
  const Icon = resolveIcon(icon);
  const color = glowColor || "var(--slide-primary)";
  return (
    <div className="flex flex-col items-center text-center relative">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute w-48 h-48 rounded-full blur-3xl" style={{ backgroundColor: `${color}20` }} />
      <div className="relative z-10 mb-6"><Icon size={size} style={{ color }} /></div>
      <p className="text-2xl font-bold relative z-10" style={{ fontFamily: "var(--slide-font-heading)" }}>{caption}</p>
      {subcaption && <p className="mt-2 relative z-10" style={{ color: "var(--slide-text-muted)" }}>{subcaption}</p>}
    </div>
  );
}
