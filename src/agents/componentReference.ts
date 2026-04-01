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
- fontSize: percentage (e.g. "120%", "80%") -- scales EVERYTHING in section (text, icons, spacing). "125%" = 25% bigger.
- color: hex code -- override text color for entire section

## Available Components

| Component | Props | Use For |
|-----------|-------|---------|
| Body | markdown, variant? ("default"/"callout"/"quote"), accentColor? (hex) | Paragraphs. "callout" = dark bg + left border. "quote" = italic + muted border. |
| BulletList | items[], icon? (lucide), variant? ("default"/"muted"/"highlighted"/"numbered"), color? (hex) | Lists. "muted" = gray dashes, dimmed. "highlighted" = bright text. "numbered" = numbered circles. |
| NumberedSteps | steps[{title, desc}], style? ("compact"/"hero") | Step-by-step processes |
| ComparisonTable | headers[], rows[][] | Side-by-side comparisons |
| StatCallout | value, label, color? (hex only e.g. "#FF9900") | Big numbers, stats |
| QuoteBlock | text, attribution? | Quotes, key messages |
| IconCard | icon?, title, desc, color? (hex), layout? ("vertical"/"horizontal"), align?, action?, tags?[], footer? | Cards. action = highlighted CTA line. tags = badge array. footer = muted note. Color tints icon AND title. |
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
