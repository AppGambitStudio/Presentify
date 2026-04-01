import type { ThemeConfig } from "./types";

export interface Palette {
  id: string;
  name: string;
  preview: [string, string, string]; // [bg, primary, accent] for visual swatch
  theme: ThemeConfig;
}

export const PALETTES: Palette[] = [
  {
    id: "midnight",
    name: "Midnight",
    preview: ["#0f1115", "#FF9900", "#0073BB"],
    theme: {
      name: "Midnight",
      primaryColor: "#FF9900",
      accentColor: "#0073BB",
      backgroundColor: "#0f1115",
      textColor: "#ffffff",
      fontHeading: "Space Grotesk",
      fontBody: "Inter",
      style: "glass-morphism",
      darkMode: true,
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    preview: ["#0a192f", "#64ffda", "#8892b0"],
    theme: {
      name: "Ocean",
      primaryColor: "#64ffda",
      accentColor: "#8892b0",
      backgroundColor: "#0a192f",
      textColor: "#ccd6f6",
      fontHeading: "Space Grotesk",
      fontBody: "Inter",
      style: "glass-morphism",
      darkMode: true,
    },
  },
  {
    id: "sunset",
    name: "Sunset",
    preview: ["#1a1423", "#ff6b6b", "#ffd93d"],
    theme: {
      name: "Sunset",
      primaryColor: "#ff6b6b",
      accentColor: "#ffd93d",
      backgroundColor: "#1a1423",
      textColor: "#f0e6ff",
      fontHeading: "Space Grotesk",
      fontBody: "Inter",
      style: "glass-morphism",
      darkMode: true,
    },
  },
  {
    id: "forest",
    name: "Forest",
    preview: ["#0d1b0e", "#4ade80", "#86efac"],
    theme: {
      name: "Forest",
      primaryColor: "#4ade80",
      accentColor: "#86efac",
      backgroundColor: "#0d1b0e",
      textColor: "#dcfce7",
      fontHeading: "Space Grotesk",
      fontBody: "Inter",
      style: "glass-morphism",
      darkMode: true,
    },
  },
  {
    id: "royal",
    name: "Royal",
    preview: ["#1b1040", "#a78bfa", "#818cf8"],
    theme: {
      name: "Royal",
      primaryColor: "#a78bfa",
      accentColor: "#818cf8",
      backgroundColor: "#1b1040",
      textColor: "#e0e7ff",
      fontHeading: "Space Grotesk",
      fontBody: "Inter",
      style: "glass-morphism",
      darkMode: true,
    },
  },
  {
    id: "ember",
    name: "Ember",
    preview: ["#18100e", "#f97316", "#fb923c"],
    theme: {
      name: "Ember",
      primaryColor: "#f97316",
      accentColor: "#fb923c",
      backgroundColor: "#18100e",
      textColor: "#fff7ed",
      fontHeading: "Space Grotesk",
      fontBody: "Inter",
      style: "glass-morphism",
      darkMode: true,
    },
  },
  {
    id: "slate",
    name: "Slate",
    preview: ["#f8fafc", "#0f172a", "#3b82f6"],
    theme: {
      name: "Slate",
      primaryColor: "#0f172a",
      accentColor: "#3b82f6",
      backgroundColor: "#f8fafc",
      textColor: "#1e293b",
      fontHeading: "Space Grotesk",
      fontBody: "Inter",
      style: "clean",
      darkMode: false,
    },
  },
  {
    id: "cream",
    name: "Cream",
    preview: ["#faf7f2", "#b45309", "#92400e"],
    theme: {
      name: "Cream",
      primaryColor: "#b45309",
      accentColor: "#92400e",
      backgroundColor: "#faf7f2",
      textColor: "#292524",
      fontHeading: "Playfair Display",
      fontBody: "Inter",
      style: "clean",
      darkMode: false,
    },
  },
  {
    id: "arctic",
    name: "Arctic",
    preview: ["#f0f9ff", "#0284c7", "#0369a1"],
    theme: {
      name: "Arctic",
      primaryColor: "#0284c7",
      accentColor: "#0369a1",
      backgroundColor: "#f0f9ff",
      textColor: "#0c4a6e",
      fontHeading: "Space Grotesk",
      fontBody: "Inter",
      style: "clean",
      darkMode: false,
    },
  },
  {
    id: "neon",
    name: "Neon",
    preview: ["#0a0a0a", "#00ff88", "#00ccff"],
    theme: {
      name: "Neon",
      primaryColor: "#00ff88",
      accentColor: "#00ccff",
      backgroundColor: "#0a0a0a",
      textColor: "#e0ffe0",
      fontHeading: "Space Grotesk",
      fontBody: "Inter",
      style: "glass-morphism",
      darkMode: true,
    },
  },
];

export function getPaletteById(id: string): Palette | undefined {
  return PALETTES.find((p) => p.id === id);
}
