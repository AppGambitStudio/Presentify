// --- Theme ---
export interface ThemeConfig {
  name: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontHeading: string;
  fontBody: string;
  style: "glass-morphism" | "minimal" | "bold" | "gradient" | "clean";
  darkMode: boolean;
}

// --- Grid Layout ---
export interface GridLayout {
  columns: string;
  rows: string;
  gap: string;
}

// --- Components ---
export const COMPONENT_TYPES = [
  "Heading",
  "Body",
  "BulletList",
  "NumberedSteps",
  "ComparisonTable",
  "TwoColumn",
  "StatCallout",
  "QuoteBlock",
  "IconCard",
  "CardGrid",
  "CodeBlock",
  "ChartBlock",
  "ImageBlock",
  "TagList",
  "Spacer",
  "Divider",
  "CTABox",
  "ShowcaseCard",
  "HeroIcon",
  "PromptBlock",
] as const;

export type ComponentType = (typeof COMPONENT_TYPES)[number];

export function isValidComponentType(type: string): type is ComponentType {
  return COMPONENT_TYPES.includes(type as ComponentType);
}

// --- Cell ---
export interface Cell {
  id: string;
  gridArea: string;
  component: ComponentType;
  props: Record<string, any>;
}

// --- Slide ---
export type SlideAnimation = "fade" | "slide-left" | "slide-right" | "scale" | "stagger";
export type SlideDecoration = "glow-pulse" | "rotating-icon" | "gradient-blob" | "shimmer";

export interface Slide {
  id: string;
  number: number;
  summary: string;
  layout: GridLayout;
  cells: Cell[];
  speakerNotes: string;
  animations: SlideAnimation;
  decorations: SlideDecoration[];
}

// --- Presentation Config ---
export interface Speaker {
  name: string;
  role: string;
  organization: string;
}

export interface PresentationConfig {
  id: string;
  createdAt: string;
  lastModified: string;
  title: string;
  speaker: Speaker;
  audience: string;
  purpose: string;
  duration: number;
  tone: string[];
  keyPoints: string[];
  dos: string[];
  donts: string[];
  theme: ThemeConfig;
  slides: Slide[];
}
