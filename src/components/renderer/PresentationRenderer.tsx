"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Maximize, Minimize } from "lucide-react";
import type { PresentationConfig } from "@/lib/types";
import { ThemeProvider } from "./ThemeProvider";
import { SlideRenderer } from "./SlideRenderer";
import { SlideDecorations } from "./SlideDecorations";
import { ProgressBar } from "./ProgressBar";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 1.05,
  }),
};

interface PresentationRendererProps { config: PresentationConfig; }

export function PresentationRenderer({ config }: PresentationRendererProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const totalSlides = config.slides.length;

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) { setDirection(1); setCurrentSlide((s) => s + 1); }
  }, [currentSlide, totalSlides]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) { setDirection(-1); setCurrentSlide((s) => s - 1); }
  }, [currentSlide]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); setIsFullscreen(true); }
    else { document.exitFullscreen(); setIsFullscreen(false); }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") nextSlide();
      if (e.key === "ArrowLeft" || e.key === "PageUp") prevSlide();
      if (e.key === "f") toggleFullscreen();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, toggleFullscreen]);

  const slide = config.slides[currentSlide];

  return (
    <ThemeProvider theme={config.theme}>
      <div className="w-screen h-screen overflow-hidden" style={{ display: "grid", gridTemplateRows: "auto 1fr auto auto" }}>
        {/* Header -- row 1 */}
        <header className="px-6 py-4 flex justify-between items-center z-50">
          <span className="font-bold text-lg" style={{ fontFamily: "var(--slide-font-heading)" }}>{config.title}</span>
          <span className="text-sm" style={{ color: "var(--slide-text-muted)" }}>{currentSlide + 1} / {totalSlides}</span>
        </header>

        {/* Slide content -- row 2 (takes all remaining space) */}
        <main className="relative overflow-hidden">
          <AnimatePresence custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial={direction === 0 ? false : "enter"}
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
                scale: { duration: 0.5 },
              }}
              className="absolute inset-0 w-full h-full"
            >
              <SlideDecorations decorations={slide.decorations} />
              <SlideRenderer slide={slide} />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Navigation -- row 3 */}
        <nav className="flex justify-center items-center gap-4 py-3 z-50">
          <button onClick={prevSlide} disabled={currentSlide === 0} className="p-3 rounded-full disabled:opacity-20 transition-all" style={{ backgroundColor: "var(--slide-card-bg)", border: "1px solid var(--slide-card-border)" }}>
            <ChevronLeft size={20} />
          </button>
          <div className="px-6 py-2 rounded-full font-mono text-sm" style={{ backgroundColor: "var(--slide-card-bg)", border: "1px solid var(--slide-card-border)" }}>
            {currentSlide + 1} / {totalSlides}
          </div>
          <button onClick={nextSlide} disabled={currentSlide === totalSlides - 1} className="p-3 rounded-full disabled:opacity-20 transition-all" style={{ backgroundColor: "var(--slide-card-bg)", border: "1px solid var(--slide-card-border)" }}>
            <ChevronRight size={20} />
          </button>
          <div className="w-px h-6 mx-2" style={{ backgroundColor: "var(--slide-card-border)" }} />
          <button onClick={toggleFullscreen} className="p-3 rounded-full transition-all" style={{ backgroundColor: "var(--slide-card-bg)", border: "1px solid var(--slide-card-border)" }}>
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </nav>

        {/* Progress bar -- row 4 */}
        <ProgressBar current={currentSlide} total={totalSlides} />
      </div>
    </ThemeProvider>
  );
}
