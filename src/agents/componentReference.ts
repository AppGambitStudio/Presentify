export const COMPONENT_REFERENCE = `
## Available Slide Components

Each slide is a CSS grid of cells. Each cell has a \`component\` type and \`props\`.

### Components:

| Component | Props | Use For |
|-----------|-------|---------|
| Heading | text, level (1/2/3), align (left/center/right), accentText? | Slide titles, section headers |
| Body | markdown (supports **bold**, *italic*, \\\`code\\\`) | Paragraphs, descriptions |
| BulletList | items[], icon? (lucide name e.g. "check-circle", "zap") | Lists of points |
| NumberedSteps | steps[{title, desc}], style? ("compact"/"hero") | Step-by-step processes |
| ComparisonTable | headers[], rows[][] | Side-by-side comparisons |
| StatCallout | value, label, color? | Big numbers, stats |
| QuoteBlock | text, attribution? | Quotes, key messages |
| IconCard | icon (lucide name), title, desc, color? | Feature cards |
| CardGrid | cards[{icon, title, desc, color?}], columns? | Grid of feature cards |
| CTABox | text (supports newline for multi-line), color? | Call-to-action, punchlines |
| CodeBlock | code, language? | Code samples |
| ChartBlock | type (bar/pie/line), data[{label, value}] | Data visualizations |
| ImageBlock | url, alt, fit? (cover/contain) | Photos, illustrations |
| TagList | tags[], color? | Tag badges |
| ShowcaseCard | title, desc, icon, url, qrCode?, tags[] | Product showcase with QR |
| HeroIcon | icon, size?, caption, subcaption?, glowColor? | Large decorative icon |
| PromptBlock | label, code, result, variant? (before/after) | Prompt input/output |
| Divider | style? (solid/dashed/gradient) | Visual separator |
| Spacer | size? (sm/md/lg) | Vertical space |
| TwoColumn | left (ReactNode), right (ReactNode) | Nested two-column |

### Cell Decoration (optional per cell):

| Property | Values | Effect |
|----------|--------|--------|
| fontSize | "sm", "base", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl", "7xl", "8xl" | Responsive font size |
| align | "left", "center", "right" | Text alignment |
| textColor | CSS color string | Text color override |
| fontWeight | "normal", "medium", "semibold", "bold", "extrabold", "black" | Font weight |
| variant | "default", "elevated", "outlined", "filled", "ghost" | Container visual treatment |
| borderAccent | CSS color string | Left border accent |
| background | CSS color or gradient | Background override |
| glow | boolean | Subtle glow effect |
| icon | lucide icon name | Decorative background icon (low opacity) |
| animate | "fade-in", "slide-up", "scale", "none" | Entrance animation |
| padding | CSS value | Padding override |
| rounded | CSS value | Border radius override |

### Slide Decorations (background effects):
"glow-pulse", "rotating-icon", "gradient-blob", "shimmer"

### Grid Layout:
- columns: CSS grid-template-columns (e.g. "1fr", "1fr 1fr", "1fr 2fr")
- rows: CSS grid-template-rows (e.g. "auto 1fr", "auto auto auto")
- gap: CSS gap (e.g. "1.5rem", "2rem")
- gridArea per cell: "row-start/col-start/row-end/col-end"

### Design Guidelines:
- Title slides: Heading with fontSize "6xl" or "7xl", center aligned
- Body text: fontSize "lg" or "xl" for readability
- Always include CellDecoration with fontSize for proper sizing
- Use "elevated" variant for glass-panel cards
- Use borderAccent for visual emphasis
- Use animate "slide-up" or "fade-in" for reveals
- Use glow-pulse decoration on title and closing slides
- Keep slides balanced and not overloaded
`;
