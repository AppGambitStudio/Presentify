export const COMPONENT_REFERENCE = `
## Slide Structure

Each slide has:
- title: string (required)
- titleAccent?: string (portion of title to highlight in primary color)
- subtitle?: string
- sections: array of content blocks
- gap?: CSS gap between sections (e.g. "1rem", "2rem", "0.5rem"). Controls vertical spacing.
- decorations: ["glow-pulse", "gradient-blob", "shimmer"] (optional background effects)

IMPORTANT for titleAccent: the title should contain the FULL text. titleAccent highlights a PORTION of it.
Example: title="AI + You = Superpowers", titleAccent="Superpowers"

## Sections

Sections flow top-to-bottom. Each section is either:

**Full width:**
{ "type": "full", "component": "ComponentName", "props": { ... }, "style": { ... } }

**Multi-column:**
{ "type": "columns", "columns": [
  { "component": "ComponentName", "props": { ... } },
  { "component": "ComponentName", "props": { ... } }
], "style": { ... } }

**Section style (optional):**
- glass: boolean -- wrap in glass panel (auto-applied for ComparisonTable, NumberedSteps)
- align: "left" | "center" | "right" -- alignment (uses flexbox, works on all components including BulletList)
- accent: "#hex" -- left border accent color
- spacing: "none" | "tight" | "normal" | "loose" -- vertical padding around section
- maxWidth: CSS value (e.g. "600px", "80%") -- constrain section width
- padding: CSS value -- override padding
- fontSize: CSS value (e.g. "120%", "1.5em", "24px") -- scales all text in section. Use "120%" to increase by 20%.
- color: hex code -- override text color for entire section

## Available Components

| Component | Props | Use For |
|-----------|-------|---------|
| Body | markdown (supports **bold**, *italic*) | Paragraphs, descriptions |
| BulletList | items[], icon? (lucide name) | Lists of points |
| NumberedSteps | steps[{title, desc}], style? ("compact"/"hero") | Step-by-step processes |
| ComparisonTable | headers[], rows[][] | Side-by-side comparisons |
| StatCallout | value, label, color? (hex only e.g. "#FF9900") | Big numbers, stats |
| QuoteBlock | text, attribution? | Quotes, key messages |
| IconCard | icon? (lucide name), title, desc, color? (hex), layout? ("vertical"/"horizontal") | Feature cards. Omit icon for plain card. Use layout "horizontal" for compact side-by-side. |
| CardGrid | cards[{icon, title, desc, color? (hex)}], columns? | Grid of cards |
| CTABox | text (newline for multi-line), color? (hex only) | Call-to-action |
| CodeBlock | code, language? | Code samples |
| ChartBlock | type (bar/pie/line), data[{label, value}] | Charts |
| ImageBlock | url, alt, fit? | Images |
| TagList | tags[], color? (hex only) | Tag badges |
| ShowcaseCard | title, desc, icon, url, qrCode?, tags[] | Product showcase with QR |
| HeroIcon | icon, size?, caption, subcaption? | Large decorative icon |
| PromptBlock | label, code, result, variant? (before/after) | Prompt display |
| Divider | style? (solid/dashed/gradient) | Separator |

## Guidelines
- Keep slides concise: 2-4 sections max per slide
- Use "columns" for side-by-side content (2-3 columns)
- BulletList items should be short (under 10 words each)
- One CTABox per slide maximum
- Don't use Heading component in sections (title field handles headings)
- ALL color values MUST be hex codes (e.g. "#FF9900", "#0073BB"). Never use named colors like "red", "blue", "green". Omit the color prop to use the theme default.
`;
