"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check } from "lucide-react";

const COMPONENTS = [
  {
    name: "BulletList",
    desc: "List of short items with variants for different visual styles",
    example: {
      component: "BulletList",
      props: {
        items: ["First point", "Second point", "Third point"],
        icon: "check-circle",
        variant: "highlighted",
        color: "#10B981"
      }
    },
    notes: 'variant: "default" (dots/icons), "muted" (gray dashes, dimmed), "highlighted" (bright text, colored icons), "numbered" (numbered circles). color: hex for icon/bullet color.'
  },
  {
    name: "BulletList (muted)",
    desc: "Dimmed list for 'before' or negative comparisons",
    example: {
      component: "BulletList",
      props: {
        items: ["Watched 50 hours of tutorials", "Can list 200 AWS services", "Has zero live deployments"],
        variant: "muted"
      }
    },
    notes: 'Use variant "muted" for grayed-out lists (e.g. "The Tutorial Trap" side of a comparison).'
  },
  {
    name: "Body",
    desc: "Paragraph text with inline markdown and optional callout style",
    example: {
      component: "Body",
      props: {
        markdown: "The boring parts got automated.\n**The creative parts got amplified.**",
        variant: "callout",
        accentColor: "#FF9900"
      }
    },
    notes: 'variant: "default" (plain), "callout" (dark bg + left accent border), "quote" (italic + muted border). accentColor: hex for callout border.'
  },
  {
    name: "IconCard",
    desc: "Feature card with icon, title, desc, action, tags, footer",
    example: {
      component: "IconCard",
      props: {
        icon: "code",
        title: "Developer",
        desc: "Build AI-native apps from day one",
        color: "#FF9900",
        action: "Try this week: Build a chat app with Bedrock",
        tags: ["KIRO IDE", "BEDROCK", "AMPLIFY"],
        footer: "\"I went from tutorial hell to building real apps\""
      }
    },
    notes: 'action: highlighted CTA text. tags: array of badge strings. footer: muted italic note. color: tints icon AND title. layout: "vertical"/"horizontal". align: "left"/"center"/"right".'
  },
  {
    name: "CardGrid",
    desc: "Grid of IconCards",
    example: {
      component: "CardGrid",
      props: {
        cards: [
          { icon: "zap", title: "Fast", desc: "Lightning speed" },
          { icon: "shield", title: "Secure", desc: "Enterprise ready" },
          { icon: "globe", title: "Global", desc: "Works everywhere" }
        ],
        columns: 3
      }
    },
    notes: "Each card follows IconCard props. columns: number of columns (default 3)."
  },
  {
    name: "ComparisonTable",
    desc: "Side-by-side comparison table",
    example: {
      component: "ComparisonTable",
      props: {
        headers: ["Before", "After", "Impact"],
        rows: [
          ["Manual deploys", "CI/CD pipeline", "10x faster"],
          ["Monolith", "Microservices", "Scale independently"]
        ]
      }
    },
    notes: "Last column is highlighted in primary color by default."
  },
  {
    name: "StatCallout",
    desc: "Big number/stat with label",
    example: {
      component: "StatCallout",
      props: {
        value: "$200",
        label: "Free Credits",
        color: "#10B981"
      }
    },
    notes: "color: optional hex. Defaults to theme primary."
  },
  {
    name: "QuoteBlock",
    desc: "Styled quote with optional attribution",
    example: {
      component: "QuoteBlock",
      props: {
        text: "The best time to start was yesterday. The second best time is now.",
        attribution: "Chinese Proverb"
      }
    },
    notes: "Auto-wraps in quotation marks. Strips any quotes you include in text."
  },
  {
    name: "CTABox",
    desc: "Call-to-action highlighted box",
    example: {
      component: "CTABox",
      props: {
        text: "Ready to build?\nStart your free trial today",
        color: "#FF9900"
      }
    },
    notes: "Use \\n for line break. First line renders bold, rest italic. color: optional hex for background."
  },
  {
    name: "NumberedSteps",
    desc: "Step-by-step process",
    example: {
      component: "NumberedSteps",
      props: {
        steps: [
          { title: "Sign Up", desc: "Create your free account" },
          { title: "Build", desc: "Use AI to create your project" },
          { title: "Ship", desc: "Deploy with one click" }
        ],
        style: "hero"
      }
    },
    notes: 'style: "compact" (default, vertical list) or "hero" (horizontal cards with big numbers).'
  },
  {
    name: "CodeBlock",
    desc: "Code snippet display",
    example: {
      component: "CodeBlock",
      props: {
        code: "const app = new App();\napp.deploy();",
        language: "typescript"
      }
    },
    notes: "language: optional label shown above the code."
  },
  {
    name: "ChartBlock",
    desc: "Bar, pie, or line chart",
    example: {
      component: "ChartBlock",
      props: {
        type: "bar",
        data: [
          { label: "Q1", value: 40 },
          { label: "Q2", value: 65 },
          { label: "Q3", value: 85 }
        ]
      }
    },
    notes: 'type: "bar", "pie", or "line".'
  },
  {
    name: "TagList",
    desc: "Row of tag badges",
    example: {
      component: "TagList",
      props: {
        tags: ["AWS", "Serverless", "AI", "Cloud"],
        color: "#FF9900"
      }
    },
    notes: "color: optional hex for badge color."
  },
  {
    name: "Divider",
    desc: "Horizontal line separator",
    example: {
      component: "Divider",
      props: { style: "gradient" }
    },
    notes: 'style: "solid" (default), "dashed", or "gradient".'
  },
  {
    name: "HeroIcon",
    desc: "Large decorative icon with caption",
    example: {
      component: "HeroIcon",
      props: {
        icon: "brain-circuit",
        caption: "AI-Powered",
        subcaption: "Built for the future",
        glowColor: "#FF9900"
      }
    },
    notes: "size: optional number (default 96). glowColor: optional hex for glow effect."
  },
];

const SECTION_STYLE_DOCS = {
  align: '"left" | "center" | "right" — aligns content block',
  fontSize: '"125%" — scales everything (text, icons, spacing) using CSS zoom',
  glass: "true | false — wraps in glass panel",
  accent: '"#FF9900" — left border accent color',
  spacing: '"none" | "tight" | "normal" | "loose" — vertical padding',
  maxWidth: '"600px" | "80%" — constrain section width',
  padding: '"1rem 2rem" — CSS padding override',
  color: '"#FFFFFF" — text color override',
};

const SLIDE_FIELDS = {
  title: "string — slide heading (required)",
  titleAccent: "string — portion at END of title to highlight in primary color",
  subtitle: "string — one-line subheading",
  gap: '"1rem" | "2rem" — vertical spacing between sections',
  decorations: '["glow-pulse", "gradient-blob", "shimmer"] — background effects',
  speakerNotes: "string — delivery hints (not shown on slide)",
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1.5 rounded-lg transition-colors"
      style={{ backgroundColor: "var(--slide-card-bg)" }}
    >
      {copied ? <Check size={14} style={{ color: "var(--slide-primary)" }} /> : <Copy size={14} style={{ color: "var(--slide-text-muted)" }} />}
    </button>
  );
}

export default function HelpPage() {
  return (
    <div className="min-h-screen py-12 px-6" style={{ backgroundColor: "var(--slide-bg)" }}>
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 mb-8 text-sm" style={{ color: "var(--slide-text-muted)" }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "var(--slide-font-heading)" }}>
          Component Reference
        </h1>
        <p className="mb-12" style={{ color: "var(--slide-text-muted)" }}>
          JSON structure for all slide components. Use in the JSON editor (press E) or reference when chatting with AI.
        </p>

        {/* Slide Structure */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--slide-font-heading)", color: "var(--slide-primary)" }}>
            Slide Structure
          </h2>
          <div className="glass-panel mb-6">
            <pre className="text-sm overflow-x-auto" style={{ fontFamily: "var(--slide-font-mono)", color: "var(--slide-text-muted)" }}>
{`{
  "title": "Your Slide Title",
  "titleAccent": "Title",          // highlights "Title" in primary color
  "subtitle": "Optional subtitle",
  "gap": "1.5rem",                 // spacing between sections
  "sections": [ ... ],             // array of sections (see below)
  "decorations": ["glow-pulse"],   // background effects
  "speakerNotes": "What to say"
}`}
            </pre>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(SLIDE_FIELDS).map(([field, desc]) => (
              <div key={field} className="flex gap-3 p-3 rounded-lg" style={{ backgroundColor: "var(--slide-card-bg)" }}>
                <code className="text-sm font-bold shrink-0" style={{ color: "var(--slide-primary)", fontFamily: "var(--slide-font-mono)" }}>{field}</code>
                <span className="text-sm" style={{ color: "var(--slide-text-muted)" }}>{desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section Types */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--slide-font-heading)", color: "var(--slide-primary)" }}>
            Section Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel">
              <h3 className="font-bold mb-3">Full Width</h3>
              <pre className="text-sm" style={{ fontFamily: "var(--slide-font-mono)", color: "var(--slide-text-muted)" }}>
{`{
  "type": "full",
  "component": "BulletList",
  "props": { "items": [...] },
  "style": { "align": "center" }
}`}
              </pre>
            </div>
            <div className="glass-panel">
              <h3 className="font-bold mb-3">Multi-Column</h3>
              <pre className="text-sm" style={{ fontFamily: "var(--slide-font-mono)", color: "var(--slide-text-muted)" }}>
{`{
  "type": "columns",
  "columns": [
    { "component": "...", "props": {...} },
    { "component": "...", "props": {...} }
  ],
  "style": { "fontSize": "110%" }
}`}
              </pre>
            </div>
          </div>
        </section>

        {/* Section Style */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--slide-font-heading)", color: "var(--slide-primary)" }}>
            Section Style
          </h2>
          <p className="mb-4 text-sm" style={{ color: "var(--slide-text-muted)" }}>
            Optional on any section or individual column. Controls alignment, sizing, and visual treatment.
          </p>
          <div className="space-y-3">
            {Object.entries(SECTION_STYLE_DOCS).map(([prop, desc]) => (
              <div key={prop} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: "var(--slide-card-bg)" }}>
                <code className="text-sm font-bold shrink-0 mt-0.5" style={{ color: "var(--slide-primary)", fontFamily: "var(--slide-font-mono)" }}>{prop}</code>
                <span className="text-sm" style={{ color: "var(--slide-text-muted)" }}>{desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Components */}
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--slide-font-heading)", color: "var(--slide-primary)" }}>
            Components
          </h2>
          <div className="space-y-8">
            {COMPONENTS.map((comp) => {
              const jsonStr = JSON.stringify(comp.example, null, 2);
              return (
                <div key={comp.name} className="glass-panel" id={comp.name.toLowerCase()}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold" style={{ fontFamily: "var(--slide-font-heading)" }}>{comp.name}</h3>
                      <p className="text-sm" style={{ color: "var(--slide-text-muted)" }}>{comp.desc}</p>
                    </div>
                    <CopyButton text={jsonStr} />
                  </div>
                  <pre className="text-sm p-4 rounded-lg overflow-x-auto mb-3" style={{ backgroundColor: "rgba(0,0,0,0.3)", fontFamily: "var(--slide-font-mono)", color: "var(--slide-text-muted)" }}>
                    {jsonStr}
                  </pre>
                  <p className="text-xs" style={{ color: "var(--slide-text-muted)" }}>{comp.notes}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
