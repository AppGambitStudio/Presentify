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

// --- Section Style (lightweight decoration on sections) ---
export interface SectionStyle {
  glass?: boolean;          // wrap in glass-panel
  align?: "left" | "center" | "right";
  accent?: string;          // left border accent color (hex)
  spacing?: "none" | "tight" | "normal" | "loose";
  maxWidth?: string;        // constrain section width (e.g. "600px", "80%")
  padding?: string;         // CSS padding override
}

// --- Section (content block within a slide) ---
export interface SectionItem {
  component: ComponentType;
  props: Record<string, any>;
}

export type Section =
  | { type: "full"; component: ComponentType; props: Record<string, any>; style?: SectionStyle }
  | { type: "columns"; columns: SectionItem[]; style?: SectionStyle };

// --- Slide ---
export type SlideDecoration = "glow-pulse" | "rotating-icon" | "gradient-blob" | "shimmer";

export interface Slide {
  id: string;
  number: number;
  summary: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  gap?: string;             // CSS gap between sections (e.g. "1rem", "2rem"). Default: auto
  sections: Section[];
  speakerNotes: string;
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

// --- Intake Form ---
export interface IntakeFormData {
  title: string;
  speakerName: string;
  speakerRole: string;
  speakerOrganization: string;
  audience: string;
  purpose: string;
  duration: 10 | 15 | 20 | 25 | 30;
  tone: string[];
  keyPoints: string;
  dos: string;
  donts: string;
  primaryColor: string;
  accentColor: string;
}

export interface OutlineItem {
  number: number;
  summary: string;
}

export type GenerationPhase =
  | "idle"
  | "generating-outline"
  | "outline-ready"
  | "generating-slides"
  | "complete"
  | "error";

export interface GenerationState {
  phase: GenerationPhase;
  outline: OutlineItem[];
  slidesCompleted: number;
  totalSlides: number;
  currentConfig: PresentationConfig | null;
  error: string | null;
}
