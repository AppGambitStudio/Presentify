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
  "MetricRow",
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
  fontSize?: string;        // CSS font-size (e.g. "1.2em", "120%", "24px"). Inherits to all children.
  color?: string;           // text color override (hex)
}

// --- Section (content block within a slide) ---
export type SectionDetailLevel = "summary" | "standard" | "deep";

interface SectionMeta {
  style?: SectionStyle;
  detailLevel?: SectionDetailLevel;
  audienceTags?: string[];
  dynamicLayout?: "auto" | "stack" | "grid";
}

export interface SectionItem extends SectionMeta {
  component: ComponentType;
  props: Record<string, any>;
}

export type Section =
  | ({ type: "full"; component: ComponentType; props: Record<string, any> } & SectionMeta)
  | ({ type: "columns"; columns: SectionItem[] } & SectionMeta);

// --- Slide Style (per-slide overrides) ---
export interface SlideStyle {
  backgroundColor?: string;   // override theme bg (hex or CSS gradient)
  textColor?: string;          // override text color
  primaryColor?: string;       // override accent/primary color
  fontFamily?: string;         // override heading font (Google Font name)
  backgroundImage?: string;    // CSS background-image (url or gradient)
  overlay?: string;            // overlay color with opacity (e.g. "rgba(0,0,0,0.5)")
}

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
  style?: SlideStyle;       // per-slide visual overrides
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
