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

1. **Describe your talk** — 4-step intake form: topic, audience, tone, duration, dos/don'ts
2. **AI plans the structure** — Claude Opus generates an outline you can review, reorder, add/remove slides
3. **AI creates slides** — Claude Sonnet generates each slide with components, styling, and animations
4. **Edit 4 ways** — Chat, click-to-edit text, visual toolbar, or raw JSON editor
5. **Manage slides** — Add, duplicate, delete, and reorder slides from the toolbar
6. **Present** — Full-screen animated presentation with keyboard navigation

## Features

### Generation
- 4-step intake wizard (Identity, Context, Structure, Constraints)
- AI-generated outline with approval checkpoint (reorder, add, delete before generating)
- AI-generated custom themes (colors, fonts, style based on topic/tone)
- SSE streaming — watch slides appear one by one as they generate
- Saved presentations list on landing page

### Editing (Workspace Mode)
- **Chat-based editing** — "make S2 more concise", "add a comparison table", "change the tone"
- **Click-to-edit** — Click any text (titles, bullets, body, quotes) to edit directly
- **Section toolbar** — Focus a section to get visual controls: alignment, font size, spacing, glass panel, color
- **JSON editor** — Press `E` for full control over slide data
- **Slide management** — Add, duplicate, delete, move up/down from the toolbar
- **Section IDs** — Each section labeled (S1, S2, S3) for easy reference in chat
- **Per-slide style overrides** — Background color, text color, accent color, font, background image, overlay
- **Per-section styles** — Alignment, font scaling (zoom), glass panels, accent borders, spacing, color
- **Per-column styles** — Style individual columns independently
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
- **Anthropic Claude** — Opus for planning, Sonnet for content generation and editing
- **Tailwind CSS v4** + **Motion/React** (spring animations)
- **Lucide React** (icons, 60+ brand fallback mappings) + **Recharts** (charts) + **react-qr-code**
- **localStorage** for persistence (no database)

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
    generateOutline.ts  # Outline (Opus)
    generateTheme.ts    # Theme (Sonnet)
    generateSlideContent.ts  # Slides (Sonnet)
    editSlide.ts        # Chat editing (Sonnet)
    orchestrator.ts     # Batch generation
  components/
    slides/             # 21 slide components
    renderer/           # SlideRenderer, PresentationRenderer, ThemeProvider, SectionToolbar
    workspace/          # ChatPanel, SlideControls, WelcomeHints
    intake/             # IntakeWizard (4 steps)
    outline/            # OutlineEditor
    generation/         # GenerationView, GenerationProgress
  lib/                  # Types, store, icon resolver, markdown parser
  styles/               # Global CSS + theme variables
```

## Roadmap

- [ ] Authentication (protect API routes)
- [ ] BYOK (Bring Your Own Key) per user
- [ ] Export as standalone HTML
- [ ] Export as downloadable project
- [ ] MCP integration (web search, images)
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
