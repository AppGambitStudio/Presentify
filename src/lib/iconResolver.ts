import * as LucideIcons from "lucide-react";

/**
 * Maps icon names (including ones AI commonly generates) to actual Lucide components.
 * Handles: kebab-case, camelCase, PascalCase, and brand names that don't exist in Lucide.
 */

// Fallback map for icons that don't exist in Lucide (brand icons, common AI hallucinations)
const ICON_FALLBACKS: Record<string, string> = {
  // Social / Brand icons -> closest Lucide equivalent
  linkedin: "Link",
  github: "GitBranch",
  discord: "MessageSquare",
  twitter: "AtSign",
  facebook: "Share2",
  instagram: "Camera",
  youtube: "Play",
  slack: "Hash",
  reddit: "MessageCircle",
  medium: "BookOpen",
  devto: "Code",
  hashnode: "Hash",
  stackoverflow: "HelpCircle",

  // Common AI-generated names that need mapping
  email: "Mail",
  website: "Globe",
  phone: "Smartphone",
  calendar: "Calendar",
  settings: "Settings",
  search: "Search",
  home: "Home",
  user: "User",
  team: "Users",
  chat: "MessageCircle",
  money: "DollarSign",
  dollar: "DollarSign",
  rupee: "IndianRupee",
  database: "Database",
  cloud: "Cloud",
  security: "Shield",
  lock: "Lock",
  key: "Key",
  fire: "Flame",
  warning: "AlertTriangle",
  error: "AlertCircle",
  success: "CheckCircle",
  info: "Info",
  ai: "BrainCircuit",
  brain: "BrainCircuit",
  robot: "Bot",
  api: "Plug",
  server: "Server",
  deploy: "Rocket",
  launch: "Rocket",
  build: "Hammer",
  tool: "Wrench",
  tools: "Wrench",
  code: "Code",
  terminal: "Terminal",
  file: "FileText",
  folder: "Folder",
  image: "Image",
  video: "Video",
  music: "Music",
  download: "Download",
  upload: "Upload",
  link: "Link",
  share: "Share2",
  bookmark: "Bookmark",
  heart: "Heart",
  star: "Star",
  trophy: "Trophy",
  gift: "Gift",
  certification: "Award",
  certificate: "Award",
  education: "GraduationCap",
  school: "GraduationCap",
  learning: "BookOpen",
  book: "BookOpen",
  chart: "BarChart3",
  graph: "TrendingUp",
  analytics: "BarChart3",
  growth: "TrendingUp",
  target: "Target",
  goal: "Target",
  idea: "Lightbulb",
  innovation: "Lightbulb",
  speed: "Zap",
  fast: "Zap",
  lightning: "Zap",
  time: "Clock",
  clock: "Clock",
  timer: "Timer",
  world: "Globe",
  global: "Globe",
  map: "MapPin",
  location: "MapPin",
  pin: "MapPin",
  network: "Network",
  workflow: "GitBranch",
  pipeline: "ArrowRightLeft",
  layers: "Layers",
  stack: "Layers",
  component: "Component",
  puzzle: "Puzzle",
  shield: "Shield",
  check: "CheckCircle",
  verified: "BadgeCheck",
};

/**
 * Convert any icon name format to PascalCase for Lucide lookup
 */
function toPascalCase(name: string): string {
  return name
    .replace(/-./g, (m) => m[1].toUpperCase())
    .replace(/^./, (m) => m.toUpperCase());
}

/**
 * Resolve an icon name to a Lucide React component.
 * Handles kebab-case, camelCase, PascalCase, and unknown names via fallback map.
 */
export function resolveIcon(name: string): React.ComponentType<any> {
  // 1. Try direct PascalCase lookup
  const pascalName = toPascalCase(name);
  if ((LucideIcons as any)[pascalName]) {
    return (LucideIcons as any)[pascalName];
  }

  // 2. Try lowercase fallback map
  const lower = name.toLowerCase().replace(/-/g, "");
  const fallbackName = ICON_FALLBACKS[lower];
  if (fallbackName && (LucideIcons as any)[fallbackName]) {
    return (LucideIcons as any)[fallbackName];
  }

  // 3. Try the raw name as-is
  if ((LucideIcons as any)[name]) {
    return (LucideIcons as any)[name];
  }

  // 4. Default fallback
  return LucideIcons.Circle;
}
