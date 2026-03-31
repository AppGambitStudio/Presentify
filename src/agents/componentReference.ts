export const COMPONENT_REFERENCE = `
## Slide Structure

Each slide has:
- title: string (required)
- titleAccent?: string (portion of title to highlight in primary color)
- subtitle?: string
- sections: array of content blocks
- decorations: ["glow-pulse", "gradient-blob", "shimmer"] (optional background effects)

IMPORTANT for titleAccent: the title should contain the FULL text. titleAccent highlights a PORTION of it.
Example: title="AI + You = Superpowers", titleAccent="Superpowers"

## Sections

Sections flow top-to-bottom. Each section is either:

**Full width:**
{ "type": "full", "component": "ComponentName", "props": { ... } }

**Multi-column:**
{ "type": "columns", "columns": [
  { "component": "ComponentName", "props": { ... } },
  { "component": "ComponentName", "props": { ... } }
] }

## Available Components

| Component | Props | Use For |
|-----------|-------|---------|
| Body | markdown (supports **bold**, *italic*) | Paragraphs, descriptions |
| BulletList | items[], icon? (lucide name) | Lists of points |
| NumberedSteps | steps[{title, desc}], style? ("compact"/"hero") | Step-by-step processes |
| ComparisonTable | headers[], rows[][] | Side-by-side comparisons |
| StatCallout | value, label, color? | Big numbers, stats |
| QuoteBlock | text, attribution? | Quotes, key messages |
| IconCard | icon (lucide name), title, desc, color? | Feature cards |
| CardGrid | cards[{icon, title, desc, color?}], columns? | Grid of cards |
| CTABox | text (newline for multi-line), color? | Call-to-action |
| CodeBlock | code, language? | Code samples |
| ChartBlock | type (bar/pie/line), data[{label, value}] | Charts |
| ImageBlock | url, alt, fit? | Images |
| TagList | tags[], color? | Tag badges |
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
`;
