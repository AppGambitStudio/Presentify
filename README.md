# Presentify

Open-source AI-powered presentation builder. Describe your talk, AI generates beautiful animated slides. Edit with chat, click, or visual controls.

> **⚠️ IMPORTANT: No authentication is included.** This app uses your Anthropic API key on the backend (`ANTHROPIC_API_KEY`). Every presentation generation and chat edit makes real API calls — Opus for planning, Sonnet for each slide and edit. **Do NOT deploy publicly without adding authentication**, or anyone can use your API key and run up costs. This is designed for **local use or private/internal deployments only**.

![alt text](screenshots/2.png)
![alt text](screenshots/1.png)

## Quick Start

```bash
npm install
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## What It Does

1. **Describe your talk** — 4-step intake form: topic, audience, tone, duration, max slides, dos/don'ts
2. **Pick a color palette** — 10 curated palettes (6 dark + 4 light) or let AI choose
3. **AI plans the structure** — Claude Opus generates a rich outline with key messages, talking points, and suggested layouts per slide
4. **AI creates slides** — Claude Sonnet generates each slide using the detailed outline context
5. **Edit 5 ways** — Chat, click-to-edit text, visual toolbar, JSON editor, or AImprovise with Opus
6. **Manage slides** — Add (with AI generation), duplicate, delete (with confirmation), and reorder
7. **Present** — Full-screen animated presentation with keyboard navigation

## Features

### Generation
- 4-step intake wizard (Identity, Context, Structure, Constraints)
- **12 slide types** — title, agenda, context, content, comparison, data, demo, story, quote, action, closing, thankyou
- **Max slides limit** — control deck length (Auto / 8 / 12 / 16 / 20 / 25)
- **10 curated color palettes** — Midnight, Ocean, Sunset, Forest, Royal, Ember, Neon (dark) + Slate, Cream, Arctic (light)
- **Rich outlines** — each slide gets slide type, key message, talking points, suggested components, and tone
- **Editable outlines** — modify every field (summary, type, key message, talking points) before generating
- **Web search enrichment** — Tavily API enriches slides with real facts/stats (optional, free tier: 1,000/month)
- **Image search** — Unsplash API finds relevant images for visual slides (optional, free tier: 50 req/hr)
- AI-generated custom themes (or use a palette — skips AI call, saves cost)
- SSE streaming — watch slides appear one by one as they generate
- Saved presentations list on landing page with edit/present/delete
- **Form draft persistence** — intake form saves to localStorage, survives page refresh

### Editing (Workspace Mode)
- **AImprovise ✨** — Opus-powered slide redesign. Click the wand button, describe what to improve (or pick from 6 quick suggestions), and Opus rethinks the entire slide structure and content
- **Chat-based editing** — "make S2 more concise", "add a comparison table", "change the tone" (powered by Sonnet)
- **Click-to-edit** — Click any text (titles, bullets, body, quotes) to edit directly — no AI needed
- **Section toolbar** — Focus a section to get visual controls: alignment, font size, spacing, glass panel, color
- **JSON editor** — Press `E` for full control over slide data
- **AI-powered slide addition** — Click +, describe what the slide should cover, AI generates it with full presentation context
- **Slide management** — Duplicate, delete (with confirmation), move up/down
- **Palette switcher** — Change the entire theme instantly from the toolbar
- **Section IDs** — Each section labeled (S1, S2, S3) for easy reference in chat
- **Per-slide style overrides** — Background color, text color, accent color, font, background image, overlay
- **Per-section styles** — Alignment, font scaling (zoom), glass panels, accent borders, spacing, color
- **Per-column styles** — Style individual columns independently
- **Confirmation dialogs** — All destructive operations (slide delete, presentation delete) require confirmation
- **Welcome hints** — First-time overlay explaining all editing methods

### Components (21)
- **Text**: Body (with callout/quote variants), BulletList (muted/highlighted/numbered variants), QuoteBlock, CTABox
- **Cards**: IconCard (vertical/horizontal, with action text, tags, footer), CardGrid, ShowcaseCard
- **Data**: ComparisonTable, StatCallout, MetricRow, ChartBlock (bar/pie/line)
- **Steps**: NumberedSteps (compact/hero style)
- **Media**: ImageBlock, CodeBlock, HeroIcon
- **Utility**: Divider, TagList, PromptBlock, Spacer, Heading, TwoColumn

### Presentation Mode
- Spring-physics slide transitions (Motion/React)
- Keyboard navigation (arrows, space, F for fullscreen)
- Background decorations (glow-pulse, gradient-blob, shimmer)
- Toggle between Workspace and Present mode from nav bar

## Tech Stack

- **Next.js** (App Router) + **TypeScript**
- **Multi-provider AI** — Anthropic, OpenRouter, or Ollama (configurable via env)
- **Tailwind CSS v4** + **Motion/React** (spring animations)
- **Lucide React** (icons, 60+ brand fallback mappings) + **Recharts** (charts) + **react-qr-code**
- **localStorage** for persistence (no database)
- **10 curated color palettes** with guaranteed readability

## AI Provider Configuration

Presentify supports 3 AI providers. Configure in `.env.local`:

### Anthropic (default)
```env
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
```

### OpenRouter (access 100+ models)
```env
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-...
AI_MODEL_PLANNING=anthropic/claude-opus-4.6
AI_MODEL_GENERATION=anthropic/claude-sonnet-4.6
```

### Ollama (local, free)
```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
AI_MODEL_PLANNING=llama3.3
AI_MODEL_GENERATION=llama3.3
```

**Model roles:**
- `AI_MODEL_PLANNING` — used for outline generation and AImprovise (needs strong reasoning)
- `AI_MODEL_GENERATION` — used for slide content, theme, and chat edits (needs fast JSON output)

You can mix providers by setting different models per role. Check current config at `/api/provider-info`.

## Content Enrichment (Optional)

Add real-world facts and images to your presentations. Both are **optional** -- if keys aren't set, generation works fine without them.

### Web Search (Tavily)
```env
TAVILY_API_KEY=tvly-...
```
- **Free tier:** 1,000 searches/month (no credit card required)
- **Sign up:** [tavily.com](https://tavily.com)
- **What it does:** During generation, searches for real facts/stats related to each slide topic and injects them into the AI prompt. Results in more specific, grounded content instead of generic AI filler.

### Image Search (Unsplash)
```env
UNSPLASH_ACCESS_KEY=...
```
- **Free tier:** 50 requests/hour (demo), unlimited with approval
- **Sign up:** [unsplash.com/developers](https://unsplash.com/developers)
- **What it does:** Finds relevant high-quality photos for visual slides (title, context, story, quote, closing). Images include proper attribution.

## Routes

| Route | What |
|-------|------|
| `/` | Landing page with saved presentations list |
| `/create` | Intake form → outline approval → AI generation |
| `/p/[id]` | Workspace: preview + chat + slide controls + section toolbar |
| `/p/[id]/present` | Full-screen presentation mode |
| `/p/sample/present` | Built-in sample presentation |
| `/help` | Component reference with JSON examples |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` / `Space` | Next slide |
| `←` | Previous slide |
| `F` | Fullscreen |
| `E` | JSON editor |

## Slide Data Model

Each slide is ~15 lines of JSON:

```json
{
  "title": "AI is Your Superpower",
  "titleAccent": "Superpower",
  "subtitle": "What AI handles vs what you do",
  "gap": "1.5rem",
  "style": { "backgroundColor": "#1a1a2e", "primaryColor": "#FF9900" },
  "sections": [
    {
      "type": "columns",
      "columns": [
        { "component": "BulletList", "props": { "items": ["Write S3 policies", "Scaffold CDK"], "icon": "check-circle", "variant": "highlighted" } },
        { "component": "IconCard", "props": { "title": "Ship Fast", "desc": "Days not months", "layout": "horizontal", "action": "Try it today", "tags": ["AWS", "AI"] } }
      ],
      "style": { "fontSize": "110%" }
    }
  ]
}
```

### Section Styles

```json
"style": {
  "align": "center",
  "fontSize": "125%",
  "glass": true,
  "accent": "#FF9900",
  "spacing": "tight",
  "color": "#FFFFFF",
  "maxWidth": "600px"
}
```

Per-column styles also supported for independent column styling.

### Slide Style Overrides

```json
"style": {
  "backgroundColor": "#1a1a2e",
  "textColor": "#e0e0e0",
  "primaryColor": "#e74c3c",
  "fontFamily": "Playfair Display",
  "backgroundImage": "linear-gradient(135deg, #0f0c29, #302b63)",
  "overlay": "rgba(0,0,0,0.5)"
}
```

## Project Structure

```
src/
  app/                  # Next.js routes + API
    create/             # Intake form + generation flow
    p/[id]/             # Workspace (chat editing)
    p/[id]/present/     # Full-screen presentation
    api/                # API routes (generate, edit-slide)
    help/               # Component reference docs
  agents/               # Claude AI agents
    generateOutline.ts  # Rich outline (Opus) — key messages + talking points
    generateTheme.ts    # Theme (Sonnet or palette bypass)
    generateSlideContent.ts  # Slides (Sonnet)
    editSlide.ts        # Chat editing (Sonnet)
    improviseSlide.ts   # AImprovise redesign (Opus)
    orchestrator.ts     # Batch generation
  components/
    slides/             # 21 slide components
    renderer/           # SlideRenderer, PresentationRenderer, ThemeProvider, SectionToolbar
    workspace/          # ChatPanel, SlideControls, WelcomeHints, ImproviseButton, PaletteSelector, ConfirmDialog
    intake/             # IntakeWizard (4 steps)
    outline/            # OutlineEditor
    generation/         # GenerationView, GenerationProgress
  lib/                  # Types, store, icon resolver, markdown parser, palettes
  styles/               # Global CSS + theme variables
```

## Roadmap

- [ ] Authentication (protect API routes)
- [ ] BYOK (Bring Your Own Key) per user
- [ ] Export as standalone HTML
- [ ] Export as downloadable project
- [x] Web search enrichment (Tavily)
- [x] Image search (Unsplash)
- [ ] MCP server support (Brave Search, Exa)
- [ ] Undo/redo for edits
- [ ] Drag-to-reorder slides
- [ ] Dark/light theme toggle
- [ ] Multiple theme presets
- [ ] Presentation sharing/hosting

## Deploy

Works on Vercel, Netlify, or any Node.js host. Set `ANTHROPIC_API_KEY` as environment variable.

**Before deploying publicly:** Add authentication (e.g. NextAuth, Clerk) to protect the API routes. Without auth, anyone can trigger API calls on your key. See the roadmap for planned auth support.

## License

MIT
