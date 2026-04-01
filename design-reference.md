# CompFinder — Design Reference

> Dark theme, clean readability, sophisticated engineering vibe

---

## 1. Design Direction

**Keyword**: Linear meets Kaggle — minimal, dark, data-dense but breathable

**Inspiration sites**:
| Site | What to steal |
|------|---------------|
| [Linear.app](https://linear.app) | Clean dark UI, subtle borders, minimal color usage |
| [Kaggle competitions](https://www.kaggle.com/competitions) | Filter sidebar + card list, sort options |
| [Devpost hackathons](https://devpost.com/hackathons) | Card layout, category dropdown |
| [shadcn Dashboard](https://ui.shadcn.com/examples/dashboard) | Stat cards, sidebar, CSS variable theming |
| [ShadcnStore Listings](https://shadcnstore.com/blocks/marketing/listings) | Card grid + filter + search pattern |
| [Taxonomy](https://tx.shadcn.com/) | Feature card grid, generous whitespace |

**Tools to use**:
- [v0.dev](https://v0.app) — AI-generated shadcn UI prototypes
- [Realtime Colors](https://www.realtimecolors.com/dashboard) — live palette preview
- [shadcn/ui Colors](https://ui.shadcn.com/colors) — Tailwind color tokens

---

## 2. Color System (Dark Theme)

### Base Palette (Zinc scale)

| Element | Token | Hex | Usage |
|---------|-------|-----|-------|
| Page bg | `zinc-950` | `#09090b` | Main background |
| Card bg | `zinc-900` | `#18181b` | Cards, panels |
| Hover bg | `zinc-800` | `#27272a` | Hover states, modals |
| Border | `zinc-700` | `#3f3f46` | Dividers, card borders |
| Muted text | `zinc-500` | `#71717a` | Hints, timestamps |
| Secondary text | `zinc-400` | `#a1a1aa` | Subtitles, metadata |
| Primary text | `zinc-50` | `#fafafa` | Headings, body |
| Accent | — | `#58a6ff` | Links, CTAs |

**Rule**: Never use pure `#000000` — causes halation (text glowing effect).

### Tier Badge Colors

| Tier | Label | Background | Text | Border |
|------|-------|-----------|------|--------|
| **S** | 🏆 Flagship | `#78350f` | `#fbbf24` (amber-400) | `#d97706` |
| **A** | 🥇 Major | `#334155` | `#cbd5e1` (slate-300) | `#94a3b8` |
| **B** | 🥈 Mid | `#44403c` | `#d6d3d1` (stone-300) | `#a8a29e` |
| **C** | 🥉 Starter | `#3f3f46` | `#a1a1aa` (zinc-400) | `#52525b` |

### Category Tag Colors

| Category | Color Token | Hex |
|----------|-------------|-----|
| 🤖 Robotics | `blue-400` | `#60a5fa` |
| 🚗 Autonomous Driving | `violet-400` | `#a78bfa` |
| 🧠 AI/ML | `emerald-400` | `#34d399` |
| ⚡ Electrical | `yellow-400` | `#facc15` |
| ⚙️ Mechanical | `orange-400` | `#fb923c` |
| 🚀 Aerospace | `cyan-400` | `#22d3ee` |
| 🔬 General | `zinc-400` | `#a1a1aa` |

### Status Colors

| Status | Color | Hex |
|--------|-------|-----|
| Open | `emerald-400` | `#34d399` |
| Closing Soon (D-7) | `red-400` | `#f87171` |
| Upcoming | `blue-400` | `#60a5fa` |
| Closed | `zinc-500` | `#71717a` |

---

## 3. Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Page title | Inter | 700 (bold) | 2xl~3xl |
| Section heading | Inter | 600 (semibold) | xl |
| Card title | Inter | 600 | lg |
| Body text | Inter | 400 (regular) | sm~base |
| Metadata | Inter | 400 | xs~sm |
| Monospace (dates, codes) | JetBrains Mono | 400 | sm |

**Hierarchy**: 3 levels only — Primary (`zinc-50`) → Secondary (`zinc-400`) → Muted (`zinc-500`)

---

## 4. Component Specs

### Competition Card
```
┌─────────────────────────────────────────────┐
│ [S-Tier Badge]          [D-3 🔴]  [⭐ Save] │
│                                              │
│ AGIBOT World Challenge 2026                  │  ← zinc-50, semibold, lg
│ AGIBOT (Shanghai)                            │  ← zinc-400, regular, sm
│                                              │
│ [🤖 Robotics] [🧠 AI/ML]                    │  ← category tags
│                                              │
│ 💰 $530,000  📍 Vienna + Online  📅 ~4/20   │  ← zinc-400, sm
│                                              │
│ VLM+VLA, World Model, Whole-Body Control     │  ← zinc-500, xs, truncated
│ 3 tracks for embodied AI reasoning...        │
└─────────────────────────────────────────────┘

CSS:
- bg-zinc-900
- border border-zinc-700/50
- rounded-lg
- hover:border-zinc-600 transition-colors duration-200
- p-5
- gap-3 between elements
```

### Filter Sidebar
```
┌──────────────────┐
│ 🔍 Search...     │  ← input with zinc-800 bg
│                  │
│ REGION           │
│ ○ All            │
│ ● 🇰🇷 Korea     │
│ ○ 🌍 Global     │
│ ○ 🌐 Online     │
│                  │
│ TIER             │
│ ☑ S  ☑ A        │
│ ☑ B  ☐ C        │
│                  │
│ CATEGORY         │
│ ☑ Robotics      │
│ ☑ AD            │
│ ☑ AI/ML         │
│ ☐ Electrical    │
│ ...              │
│                  │
│ STATUS           │
│ ☑ Open          │
│ ☑ Closing Soon  │
│ ☐ Closed        │
│                  │
│ PRIZE            │
│ $0 ────●── $500K │
│                  │
│ [Reset Filters]  │
└──────────────────┘
```

### Page Layout
```
┌─ Navbar ─────────────────────────────────────────────┐
│ CompFinder    Competitions  Series  Timeline  Submit  │
└──────────────────────────────────────────────────────┘

┌─ Hero (Home only) ───────────────────────────────────┐
│                                                       │
│  Find your next engineering competition.              │
│  1,200+ competitions across 7 categories.             │
│                                                       │
│  [Browse All →]                                       │
│                                                       │
│  ┌─ Stat ─┐ ┌─ Stat ─┐ ┌─ Stat ─┐ ┌─ Stat ─┐      │
│  │ 1,234  │ │  42    │ │  18    │ │ $2.1M  │        │
│  │ Total  │ │ Open   │ │ D-7    │ │ Prizes │        │
│  └────────┘ └────────┘ └────────┘ └────────┘        │
└──────────────────────────────────────────────────────┘

┌─ Region Tabs ────────────────────────────────────────┐
│  [🇰🇷 Korea (24)]  [🌍 Global (186)]  [🌐 Online (93)] │
└──────────────────────────────────────────────────────┘

┌─ Sidebar ──┐ ┌─ Card Grid ──────────────────────────┐
│ Filters... │ │ ┌─ Card ─┐ ┌─ Card ─┐ ┌─ Card ─┐   │
│            │ │ │        │ │        │ │        │     │
│            │ │ └────────┘ └────────┘ └────────┘     │
│            │ │ ┌─ Card ─┐ ┌─ Card ─┐ ┌─ Card ─┐   │
│            │ │ │        │ │        │ │        │     │
│            │ │ └────────┘ └────────┘ └────────┘     │
└────────────┘ └──────────────────────────────────────┘

Grid: 1col (mobile) → 2col (tablet) → 3col (desktop)
Sidebar: collapsible on mobile (sheet/drawer)
```

---

## 5. Design Principles

1. **Borders over shadows** — dark mode에서 box-shadow 대신 `border-zinc-700/50` 사용
2. **Generous whitespace** — 카드 간 gap-4~6, 섹션 간 py-12~16
3. **3-level text hierarchy only** — primary / secondary / muted
4. **Subtle hover transitions** — `duration-200`, color shift only (no scale/transform)
5. **Desaturated accents** — neon 느낌 방지, 모든 accent에 -400 톤 사용
6. **Data-dense but scannable** — 카드에 정보 많되, visual grouping으로 정리
7. **Mobile-first** — 카드 스택, collapsible sidebar, sticky filter bar

---

## 6. Recommended Templates to Fork

| Template | Stars | Why |
|----------|-------|-----|
| [shadcn-admin](https://github.com/satnaing/shadcn-admin) | 6K+ | Next.js, TanStack Table, 6 themes, sidebar |
| [ShadcnStore Listings](https://shadcnstore.com/blocks/marketing/listings) | — | Card grid + filter + search, copy-paste ready |
| [v0 Dashboard Templates](https://v0.app/templates/dashboards) | — | AI-generated, shadcn native, fork instantly |

---

## 7. v0.dev Prompt (for prototyping)

Use this prompt on v0.dev to generate initial UI:

```
Create a dark-themed competition aggregator dashboard using shadcn/ui and Tailwind CSS.

Layout:
- Top navbar with logo "CompFinder", nav links (Competitions, Series, Timeline, Submit)
- Hero section with headline "Find your next engineering competition" and 4 stat cards (Total, Open, Closing Soon, Total Prize)
- Region tabs: Korea / Global / Online with counts
- Left filter sidebar (search, region, tier S/A/B/C checkboxes, category checkboxes, status, prize range slider)
- 3-column card grid on the right

Competition Card:
- Tier badge (gold S / silver A / bronze B / gray C) top-left
- D-day countdown badge top-right (red if D-3, orange if D-7)
- Competition name (semibold)
- Organizer name (muted)
- Category tags (colored pills: blue for Robotics, violet for AD, green for AI/ML)
- Bottom row: prize amount, location, deadline

Color scheme: zinc-950 background, zinc-900 cards, zinc-700 borders, amber for S-tier, slate for A-tier.
Font: Inter for text.
```
