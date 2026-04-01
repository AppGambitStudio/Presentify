"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Maximize, Minimize, Code2, MessageSquare, Presentation } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { savePresentation } from "@/lib/store";
import type { PresentationConfig, Slide } from "@/lib/types";
import { SlideEditor } from "./SlideEditor";
import { ThemeProvider } from "./ThemeProvider";
import { SlideRenderer } from "./SlideRenderer";
import type { DensityMode } from "./SlideRenderer";
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

const DENSITY_STORAGE_KEY = "presentify:density-mode";
const DENSITY_OPTIONS: DensityMode[] = ["summary", "standard", "deep"];
const DENSITY_LABELS: Record<DensityMode, string> = {
  summary: "Summary",
  standard: "Standard",
  deep: "Deep Dive",
};

interface PresentationRendererProps {
  config: PresentationConfig;
  onSlideChange?: (index: number) => void;
  workspaceMode?: boolean;
}

export function PresentationRenderer({ config: initialConfig, onSlideChange, workspaceMode = false }: PresentationRendererProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [config, setConfig] = useState(initialConfig);
  useEffect(() => { setConfig(initialConfig); }, [initialConfig]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [densityMode, setDensityMode] = useState<DensityMode>("standard");
  const totalSlides = config.slides.length;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(DENSITY_STORAGE_KEY);
    if (stored && DENSITY_OPTIONS.includes(stored as DensityMode)) {
      setDensityMode(stored as DensityMode);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(DENSITY_STORAGE_KEY, densityMode);
  }, [densityMode]);

  const nextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setDirection(1);
      setCurrentSlide((s) => {
        const next = s + 1;
        onSlideChange?.(next);
        return next;
      });
    }
  }, [currentSlide, totalSlides, onSlideChange]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide((s) => {
        const prev = s - 1;
        onSlideChange?.(prev);
        return prev;
      });
    }
  }, [currentSlide, onSlideChange]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); setIsFullscreen(true); }
    else { document.exitFullscreen(); setIsFullscreen(false); }
  }, []);

  const toggleEditor = useCallback(() => setShowEditor((v) => !v), []);

  const handleSlideUpdate = useCallback((updated: Slide) => {
    setConfig((prev) => {
      const newConfig = {
        ...prev,
        lastModified: new Date().toISOString(),
        slides: prev.slides.map((s) => (s.id === updated.id ? updated : s)),
      };
      savePresentation(newConfig);
      return newConfig;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture keys when any input/textarea is focused
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") nextSlide();
      if (e.key === "ArrowLeft" || e.key === "PageUp") prevSlide();
      if (e.key === "f") toggleFullscreen();
      if (e.key === "e") toggleEditor();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, toggleFullscreen, toggleEditor, showEditor]);

  const slide = config.slides[currentSlide];

  return (
    <ThemeProvider theme={config.theme}>
      <div className="w-full h-full overflow-hidden" style={{ display: "grid", gridTemplateRows: "auto 1fr auto auto", gridTemplateColumns: showEditor ? "60fr 40fr" : "1fr" }}>
        {/* Header -- row 1 */}
        <header className="px-6 py-4 flex justify-between items-center z-50" style={{ gridColumn: "1 / -1" }}>
          <span className="font-bold text-lg" style={{ fontFamily: "var(--slide-font-heading)" }}>{config.title}</span>
          <span className="text-sm" style={{ color: "var(--slide-text-muted)" }}>{currentSlide + 1} / {totalSlides}</span>
        </header>

        {/* Slide content -- row 2, column 1 */}
        <main className="relative overflow-hidden" style={{ gridColumn: "1" }}>
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
              <SlideRenderer
                slide={slide}
                showSectionIds={workspaceMode}
                workspaceMode={workspaceMode}
                densityMode={densityMode}
                onSlideUpdate={handleSlideUpdate}
              />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Editor panel -- row 2, explicitly column 2 (only when open) */}
        {showEditor && (
          <div className="overflow-hidden" style={{ gridRow: "2 / 4", gridColumn: "2", borderLeft: "1px solid var(--slide-card-border)", backgroundColor: "var(--slide-bg)" }}>
            <SlideEditor slide={slide} onSave={handleSlideUpdate} />
          </div>
        )}

        {/* Navigation -- row 3 */}
        <nav className="flex flex-wrap justify-center items-center gap-4 py-3 z-50">
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-full border"
            style={{ borderColor: "var(--slide-card-border)", backgroundColor: "rgba(0,0,0,0.25)" }}
          >
            {DENSITY_OPTIONS.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setDensityMode(mode)}
                className="px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                style={{
                  backgroundColor: densityMode === mode ? "var(--slide-primary)" : "transparent",
                  color: densityMode === mode ? "var(--slide-bg)" : "var(--slide-text-muted)",
                }}
              >
                {DENSITY_LABELS[mode]}
              </button>
            ))}
          </div>
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
          <button onClick={toggleEditor} className="p-3 rounded-full transition-all" style={{ backgroundColor: showEditor ? "var(--slide-primary)" : "var(--slide-card-bg)", border: "1px solid var(--slide-card-border)", color: showEditor ? "var(--slide-bg)" : "var(--slide-text)" }} title="Toggle JSON Editor (E)">
            <Code2 size={20} />
          </button>
          <button
            onClick={() => {
              // Toggle between /p/[id] (workspace) and /p/[id]/present
              const isPresent = pathname.endsWith("/present");
              const base = isPresent ? pathname.replace(/\/present$/, "") : pathname;
              router.push(isPresent ? base : `${base}/present`);
            }}
            className="p-3 rounded-full transition-all"
            style={{
              backgroundColor: workspaceMode ? "var(--slide-card-bg)" : "var(--slide-primary)",
              border: "1px solid var(--slide-card-border)",
              color: workspaceMode ? "var(--slide-text)" : "var(--slide-bg)",
            }}
            title={workspaceMode ? "Switch to Present mode" : "Switch to Workspace (Chat)"}
          >
            {workspaceMode ? <Presentation size={20} /> : <MessageSquare size={20} />}
          </button>
        </nav>

        {/* Progress bar -- row 4 */}
        <ProgressBar current={currentSlide} total={totalSlides} />
      </div>
    </ThemeProvider>
  );
}
