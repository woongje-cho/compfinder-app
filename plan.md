# CompFinder — Global Engineering Competition Dashboard

> Engineering competitions/hackathons aggregator with size-tier classification
> Target: Engineering students worldwide (Robotics, AD, AI/ML, EE, ME, Aero, CS)
> Repo: `comp-finder` | License: MIT | Deploy: Vercel (free)

---

## 1. Core Concept

A web dashboard that **automatically crawls** global engineering competitions and classifies them by **size tier** based on prize money + participant scale + organizer prestige.

### Size Tier System

| Tier | Label | Criteria (any 2 of 3) | Example |
|------|-------|----------------------|---------|
| **S** | Flagship | Prize $100K+ / 1000+ participants / Top-tier org (IEEE, Google, NVIDIA) | AGIBOT ($530K), ARC Prize ($425K), RoboCup |
| **A** | Major | Prize $10K~100K / 200~1000 participants / Well-known org | OpenAI Hackathon, USAII, CVPR Challenges |
| **B** | Mid | Prize $1K~10K / 50~200 participants / Regional org | Ignite64, DevNetwork, University contests |
| **C** | Starter | Prize <$1K or no prize / <50 participants / Community/local | lablab.ai weekly, MLH local, DACON small |

### Engineering Categories (enum)

```typescript
type Category =
  | 'robotics'      // manipulation, navigation, humanoid, surgical, industrial
  | 'ad'            // autonomous driving — perception, planning, simulation, V2X
  | 'ai-ml'         // LLM, CV, RL, NLP, generative AI
  | 'electrical'    // firmware, IoT, FPGA, signal processing, embedded
  | 'mechanical'    // CAD, FEA, design challenges, manufacturing
  | 'aerospace'     // drone, satellite, space robotics, defense
  | 'general';      // multidisciplinary, sustainability, biomedical
```

### Region Classification

```typescript
type Region = 'korea' | 'global' | 'online';
// Derived at merge time:
// - korea:  country === "KR"
// - online: format === "online"
// - global: everything else (country !== "KR" && format !== "online")
// - hybrid: appears in multiple regions
```

---

## 2. Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| **Frontend** | Next.js 15 (App Router) + Tailwind CSS v4 + shadcn/ui | Latest SSG, modern UI |
| **Data** | JSON files in repo (MVP) → Supabase (v2.0+) | No DB overhead initially |
| **Crawlers** | Python 3.12 (requests + BeautifulSoup + Playwright) | Handles static + JS-rendered |
| **Dedup** | RapidFuzz (fuzzy matching) | 10-100x faster than FuzzyWuzzy |
| **Scheduler** | GitHub Actions (cron) | Free for public repos |
| **Deploy** | Vercel (free tier) | Zero-config Next.js |
| **Analytics** | Vercel Analytics (free) | Built-in, no setup |
| **AI (v2.1)** | Claude API | Auto-tagging, discovery agent |

---

## 3. Data Sources (Crawl Targets)

### Layer 1: Platform Crawlers (daily)

| # | Source | Method | Region | Notes |
|---|--------|--------|--------|-------|
| 1 | **Devpost** | Hidden API (`/api/hackathons`) | Global | No auth, JSON response |
| 2 | **Kaggle** | Official API (`kaggle.api`) | Global | Needs `kaggle.json` token |
| 3 | **MLContests** | Read `competitions.json` from GitHub | Global | Already curated |
| 4 | **EvalAI** | REST API (`/api/challenges/`) | Global | Django-based |
| 5 | **DrivenData** | HTML scraping | Global | No API |
| 6 | **HuggingFace** | Hub API | Global | Spaces-based competitions |
| 7 | **Linkareer** | HTML scraping (Playwright) | Korea | JS-rendered |
| 8 | **DACON** | HTML scraping | Korea | Korean AI competitions |
| 9 | **ThinkGood** | HTML scraping | Korea | Korean contest aggregator |

### Layer 2: AI Discovery Agent (weekly)

Finds niche competitions not on any platform:
- Google/Bing search with 50+ keyword combos (KR + EN + JP)
- Organization website monitoring (TRON Forum, SAE, IEEE, RoboNation, VDI, HeroX, DARPA, 과기부 IITP)
- Reddit: r/robotics, r/MachineLearning, r/embedded, r/ECE
- AI classifies: is it real? → extract fields → auto-assign tier
- Output: `data/sources/discovered.json` → human review flag → merge
- Cost: ~$0.50/week (Claude API)

### Layer 3: Community Submissions (async)

- `/submit` page with form (name, URL, deadline, category, description)
- Auto-creates GitHub Issue → maintainer reviews → merge into data

---

## 4. Data Schema

```typescript
// ─── Enums ───
type Category = 'robotics' | 'ad' | 'ai-ml' | 'electrical' | 'mechanical' | 'aerospace' | 'general';
type Region = 'korea' | 'global' | 'online';
type Tier = 'S' | 'A' | 'B' | 'C';
type Format = 'online' | 'offline' | 'hybrid';
type Status = 'upcoming' | 'open' | 'closing_soon' | 'closed' | 'archived';
type Recurrence = 'annual' | 'biannual' | 'irregular' | 'one-time';
type Difficulty = 1 | 2 | 3 | 4 | 5;  // 1=beginner, 5=expert
type EntryBarrier = 'laptop-only' | 'gpu-needed' | 'hardware-required' | 'team-required' | 'invitation-only';

// ─── Competition (single edition / one-time event) ───
interface Competition {
  // Identity
  id: string;                       // auto-generated UUID
  seriesId?: string;                // links to parent series (null if one-time)
  name: string;                     // "RoboCup 2026"
  slug: string;                     // "robocup-2026" (URL-friendly)
  year?: number;                    // 2026

  // Classification
  tier: Tier;
  categories: Category[];           // multi-select, at least 1
  format: Format;
  region: Region;                   // derived from country + format

  // Details
  organizer: string;
  description: string;              // 1-3 sentence summary
  url: string;                      // official competition page
  imageUrl?: string;                // logo or banner

  // Prize & Scale
  prizeAmount?: number;             // USD (converted if other currency)
  prizeCurrency?: string;           // original currency code
  prizeDescription?: string;        // "Robot arm + $5,000 + cloud credits"
  estimatedParticipants?: number;

  // Dates
  registrationOpen?: string;        // ISO date
  registrationDeadline?: string;    // ISO date
  startDate?: string;               // ISO date
  endDate?: string;                 // ISO date

  // Location
  location?: string;                // "Incheon, Korea" or "Online"
  country?: string;                 // ISO 3166-1 alpha-2 ("KR", "US", "AT")

  // Eligibility
  language: string;                 // "en", "ko", "ja", "multi"
  studentOnly: boolean;
  requiresDegree?: 'any' | 'undergrad' | 'masters' | 'phd';
  teamSize?: { min: number; max: number };

  // Difficulty (v1.1, optional for MVP)
  difficulty?: Difficulty;
  entryBarriers?: EntryBarrier[];

  // History (past editions only)
  winners?: string[];               // ["MIT Team Alpha (1st)", "ETH Zurich (2nd)"]
  highlightUrl?: string;            // recap video / blog post

  // Meta
  source: string;                   // "devpost" | "kaggle" | "discovered" | "manual"
  sourceUrl?: string;               // original listing URL on the platform
  lastUpdated: string;              // ISO datetime
  status: Status;                   // computed from dates
  featured?: boolean;               // manually curated for homepage
}

// ─── Series (recurring competition across years) ───
interface CompetitionSeries {
  seriesId: string;                 // "robocup"
  name: string;                     // "RoboCup"
  slug: string;                     // "robocup"
  description: string;
  organizer: string;
  website: string;                  // official homepage
  categories: Category[];
  recurrence: Recurrence;
  firstYear?: number;               // 1997
  editionIds: string[];             // references to Competition.id (newest first)
}
```

### Status Computation Logic
```typescript
function computeStatus(comp: Competition, now: Date): Status {
  if (comp.endDate && new Date(comp.endDate) < now) return 'closed';
  if (comp.registrationDeadline) {
    const deadline = new Date(comp.registrationDeadline);
    const daysLeft = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (daysLeft < 0) return 'closed';
    if (daysLeft <= 7) return 'closing_soon';
  }
  if (comp.registrationOpen && new Date(comp.registrationOpen) > now) return 'upcoming';
  return 'open';
}
```

---

## 5. MVP Features (Phase 1)

### Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero + stat cards + featured + closing soon |
| `/competitions` | Browse | Card grid + filter sidebar + sort + region tabs |
| `/competitions/[slug]` | Detail | Full competition info + related competitions |
| `/series` | Series List | All recurring competitions |
| `/series/[slug]` | Series Detail | History timeline + past editions + stats |
| `/timeline` | Timeline | Calendar view of deadlines (FullCalendar, month view) |
| `/submit` | Submit | Form to suggest a new competition |

### Filters (left sidebar, collapsible on mobile)
- **Search**: Full-text search on name + organizer + description
- **Region**: Korea / Global / Online (radio buttons)
- **Tier**: S / A / B / C (checkboxes)
- **Category**: 7 categories (checkboxes)
- **Format**: Online / Offline / Hybrid (checkboxes)
- **Status**: Open / Closing Soon / Upcoming / Closed (checkboxes)
- **Prize range**: Slider ($0 ~ $500K+)
- **Student only**: Toggle
- **[Reset All]** button

### Sort Options (dropdown, top-right of card grid)
- Deadline (soonest first) — **default**
- Prize (highest first)
- Tier (S → C)
- Recently added
- Name (A-Z)

### Pagination
- **Infinite scroll** with "Load more" button fallback
- 24 cards per page (8 rows × 3 columns)
- URL state preserved via `nuqs` (shareable filtered URLs)

### Series Detail Page (`/series/[slug]`)
```
RoboCup
Official: robocup.org | Annual since 1997 | S-Tier

[Edition Timeline — newest first]
2026 — Incheon, Korea (6/30~7/6)         [OPEN →]
2025 — Salvador, Brazil                   1st: CMU, 2nd: TU Darmstadt
2024 — Eindhoven, Netherlands             1st: TU Darmstadt
2023 — Bordeaux, France                   1st: NimbRo (Bonn)
...

[Prize Trend Chart — line graph if data available]
[Related Series — same category]
```

Historical data population strategy:
- **MVP**: Manually seed top ~20 series with 3-5 past editions each
- **v1.1**: Crawl Wikipedia/official sites for historical data
- **v2.0**: Community contributes past edition data

### Submit Page (`/submit`)
Simple form (no auth required for MVP):
- Competition name (required)
- URL (required)
- Registration deadline
- Category (dropdown)
- Description (textarea)
- Submitter email (optional, for follow-up)
- → Creates GitHub Issue via API → maintainer reviews

---

## 6. Crawler Architecture

```
┌─── Layer 1: Platform Crawlers (daily 09:00 KST) ────────────────┐
│  GitHub Actions: .github/workflows/crawl-daily.yml                │
│                                                                    │
│  crawlers/                                                         │
│    ├─ devpost.py       → data/sources/devpost.json                 │
│    ├─ kaggle_crawl.py  → data/sources/kaggle.json                  │
│    ├─ mlcontests.py    → data/sources/mlcontests.json              │
│    ├─ evalai.py        → data/sources/evalai.json                  │
│    ├─ drivendata.py    → data/sources/drivendata.json              │
│    ├─ huggingface.py   → data/sources/huggingface.json             │
│    ├─ linkareer.py     → data/sources/linkareer.json               │
│    ├─ dacon.py         → data/sources/dacon.json                   │
│    └─ thinkgood.py     → data/sources/thinkgood.json               │
└────────────────────────────────────────────────────────────────────┘
                                ↓
┌─── Layer 2: AI Discovery (weekly, Sunday 09:00 KST) ────────────┐
│  GitHub Actions: .github/workflows/discover-weekly.yml            │
│                                                                    │
│  crawlers/discover.py                                              │
│    ├─ Web search (50+ keyword combos, KR+EN+JP)                   │
│    ├─ Organization website checks                                  │
│    ├─ Reddit/community monitoring                                  │
│    ├─ AI classification + field extraction                         │
│    └─ → data/sources/discovered.json                               │
└────────────────────────────────────────────────────────────────────┘
                                ↓
┌─── Layer 3: Merge Pipeline (runs after L1 or L2) ───────────────┐
│  crawlers/merge.py                                                │
│                                                                    │
│  Step 1: Load all sources/*.json                                  │
│  Step 2: Normalize fields (currency → USD, dates → ISO)           │
│  Step 3: Validate (required fields check, URL format, date range) │
│  Step 4: Dedup                                                    │
│    ├─ URL exact match                                              │
│    ├─ RapidFuzz name similarity ≥ 85%                             │
│    └─ Name similar + deadline ±3 days = confirmed duplicate       │
│  Step 5: Tier auto-assignment (score-based)                       │
│  Step 6: Region classification (country + format → region)        │
│  Step 7: Status computation (dates → status)                      │
│  Step 8: Series linking (match to existing or flag for review)    │
│  Step 9: Write final output                                       │
│    ├─ → data/competitions.json                                     │
│    └─ → data/series.json                                           │
└────────────────────────────────────────────────────────────────────┘
                                ↓
┌─── Layer 4: Deploy ──────────────────────────────────────────────┐
│  git commit + push (only if data changed)                         │
│  → Vercel detects push → Next.js SSG rebuild → site live          │
└──────────────────────────────────────────────────────────────────┘
```

### Tier Auto-Assignment Logic
```python
TIER_S_ORGS = {"IEEE", "Google", "NVIDIA", "Meta", "RoboCup Federation",
               "CVPR", "NeurIPS", "ICML", "SAE", "NASA", "DARPA", "XPRIZE"}
TIER_A_ORGS = {"OpenAI", "HuggingFace", "Kaggle", "RoboNation",
               "Microsoft", "Amazon", "TRON Forum", "VDI"}

def assign_tier(comp) -> str:
    score = 0
    if comp.prize >= 100_000: score += 3
    elif comp.prize >= 10_000: score += 2
    elif comp.prize >= 1_000: score += 1

    if comp.participants >= 1000: score += 3
    elif comp.participants >= 200: score += 2
    elif comp.participants >= 50: score += 1

    if comp.organizer in TIER_S_ORGS: score += 3
    elif comp.organizer in TIER_A_ORGS: score += 2

    if score >= 6: return 'S'
    if score >= 4: return 'A'
    if score >= 2: return 'B'
    return 'C'
```

### Crawler Error Handling
- Each crawler wrapped in try/except → logs error, returns empty list (never crashes pipeline)
- `merge.py` validates all fields → rejects entries missing required fields (name, url)
- GitHub Actions sends notification on crawler failure (via Actions built-in alerts)
- Stale data detection: if a source returns 0 results for 3 consecutive days → flag for review
- Rate limiting: 1-2 req/sec for scraping, respect `robots.txt`, 10s delay between pages

---

## 7. File Structure

```
comp-finder/
├── plan.md                          # This file
├── design-reference.md              # Colors, typography, component specs
├── reference-research.md            # Competitive landscape research
├── CLAUDE.md                        # Project-specific Claude instructions
├── README.md                        # Public repo README
├── LICENSE                          # MIT
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── .env.example                     # KAGGLE_USERNAME, KAGGLE_KEY, etc.
│
├── crawlers/                        # Python crawlers (separate from Next.js)
│   ├── requirements.txt             # requests, beautifulsoup4, playwright, rapidfuzz, kaggle
│   ├── config.py                    # Source URLs, tier org lists, search keywords
│   ├── base.py                      # BaseCrawler class (shared logic)
│   ├── devpost.py
│   ├── kaggle_crawl.py
│   ├── mlcontests.py
│   ├── evalai.py
│   ├── drivendata.py
│   ├── huggingface.py
│   ├── linkareer.py
│   ├── dacon.py
│   ├── thinkgood.py
│   ├── discover.py                  # AI discovery agent
│   ├── merge.py                     # Dedup + tier + region + series + validate
│   └── tests/                       # Crawler unit tests
│       └── test_merge.py
│
├── data/                            # Crawled data (committed to repo)
│   ├── competitions.json            # Final merged — all current competitions
│   ├── series.json                  # Series metadata + edition references
│   └── sources/                     # Raw per-source data (gitignored in prod)
│       ├── devpost.json
│       ├── kaggle.json
│       └── ...
│
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout (dark theme, Inter font, navbar)
│   │   ├── page.tsx                 # Home
│   │   ├── competitions/
│   │   │   ├── page.tsx             # Browse (filters + card grid)
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # Competition detail
│   │   ├── series/
│   │   │   ├── page.tsx             # All series list
│   │   │   └── [slug]/
│   │   │       └── page.tsx         # Series history
│   │   ├── timeline/
│   │   │   └── page.tsx             # Calendar view
│   │   └── submit/
│   │       └── page.tsx             # Competition submission form
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileFilterSheet.tsx
│   │   ├── competition/
│   │   │   ├── CompetitionCard.tsx
│   │   │   ├── CompetitionDetail.tsx
│   │   │   └── CompetitionGrid.tsx
│   │   ├── filters/
│   │   │   ├── FilterSidebar.tsx
│   │   │   ├── RegionTabs.tsx
│   │   │   ├── SortDropdown.tsx
│   │   │   └── PrizeRangeSlider.tsx
│   │   ├── series/
│   │   │   ├── SeriesCard.tsx
│   │   │   └── EditionTimeline.tsx
│   │   ├── ui/                      # shadcn/ui components (auto-generated)
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── slider.tsx
│   │   │   └── ...
│   │   └── shared/
│   │       ├── TierBadge.tsx
│   │       ├── DdayBadge.tsx
│   │       ├── CategoryTag.tsx
│   │       ├── StatusBadge.tsx
│   │       └── StatCard.tsx
│   │
│   ├── lib/
│   │   ├── types.ts                 # All TypeScript interfaces + enums
│   │   ├── data.ts                  # Load, filter, sort competitions.json
│   │   ├── utils.ts                 # D-day calc, currency format, date format
│   │   ├── constants.ts             # Category labels, tier labels, color maps
│   │   └── seo.ts                   # Meta tag generators
│   │
│   └── styles/
│       └── globals.css              # Tailwind base + dark theme CSS variables
│
├── .github/
│   └── workflows/
│       ├── crawl-daily.yml          # Layer 1: daily 09:00 KST
│       └── discover-weekly.yml      # Layer 2: Sunday 09:00 KST
│
└── public/
    ├── og-image.png                 # Open Graph image for social sharing
    └── favicon.ico
```

---

## 8. SEO & Meta Strategy

- **Dynamic meta tags** per page via Next.js `generateMetadata()`
- **Open Graph**: title, description, image per competition
- **Sitemap**: Auto-generated `sitemap.xml` with all competition + series URLs
- **robots.txt**: Allow all crawlers
- **Structured data**: JSON-LD `Event` schema for competitions (Google rich results)
- **Page titles**: "CompFinder | {Competition Name}" or "CompFinder | Robotics Competitions"
- **Canonical URLs**: Prevent duplicate content from filter params

---

## 9. Implementation Order

### Step 1: Project Setup
- [ ] Create GitHub repo `comp-finder`
- [ ] `npx create-next-app@latest` with App Router + TypeScript + Tailwind
- [ ] Install shadcn/ui (`npx shadcn@latest init`)
- [ ] Configure dark theme in `globals.css`
- [ ] Install dependencies: `nuqs`, `@fullcalendar/react`, `lucide-react`
- [ ] Create CLAUDE.md
- [ ] Define TypeScript types (`src/lib/types.ts`)
- [ ] Define constants (`src/lib/constants.ts`)

### Step 2: Seed Data
- [ ] Manually create `data/competitions.json` with ~30 competitions from research
- [ ] Manually create `data/series.json` with ~10 series (3-5 past editions each)
- [ ] Create utility functions (`src/lib/data.ts`, `src/lib/utils.ts`)
- [ ] Validate data loads correctly

### Step 3: Core Components
- [ ] TierBadge, DdayBadge, CategoryTag, StatusBadge, StatCard
- [ ] CompetitionCard
- [ ] FilterSidebar + RegionTabs + SortDropdown
- [ ] CompetitionGrid (card grid + infinite scroll)
- [ ] Navbar + Footer

### Step 4: Pages
- [ ] Home page (hero + stats + featured + closing soon)
- [ ] Browse page (filters + grid + sort + region tabs)
- [ ] Detail page (full info + related)
- [ ] Series list + detail page (timeline + past editions)
- [ ] Timeline page (FullCalendar month view)
- [ ] Submit page (form → GitHub Issue)

### Step 5: Polish
- [ ] Responsive design (mobile sidebar → sheet/drawer)
- [ ] SEO (meta tags, sitemap, JSON-LD)
- [ ] Loading states + empty states
- [ ] 404 page
- [ ] OG image

### Step 6: Deploy
- [ ] Vercel deployment
- [ ] Vercel Analytics enable
- [ ] Custom domain (optional)
- [ ] GitHub repo → public

### Step 7: Crawlers
- [ ] `base.py` (shared crawler logic + error handling)
- [ ] `devpost.py` (highest volume, easiest API)
- [ ] `kaggle_crawl.py`
- [ ] `mlcontests.py`
- [ ] `merge.py` (dedup + tier + region + validate)
- [ ] `crawl-daily.yml` GitHub Actions workflow
- [ ] Test with real data → verify site updates

### Step 8: Korean Platforms + Discovery
- [ ] `linkareer.py`, `dacon.py`, `thinkgood.py`
- [ ] `discover.py` (AI discovery agent)
- [ ] `discover-weekly.yml` workflow

---

## 10. Post-MVP Roadmap

### v1.1 — Quick Wins
- [ ] Google Calendar export (`.ics` download per competition)
- [ ] Difficulty + entry barrier tags
- [ ] Bookmark/wishlist (localStorage, no auth)
- [ ] i18n: Korean + English toggle

### v1.2 — Visualization
- [ ] World map view (offline competitions on globe)
- [ ] Trend dashboard (category growth, prize trends YoY)
- [ ] Sponsor/organizer profiles ("all NVIDIA-sponsored competitions")

### v2.0 — User Accounts (Supabase)
- [ ] Personal dashboard (applied / interested / won)
- [ ] Public portfolio (shareable competition resume)
- [ ] Team building (skill tags, per-competition teammate search)
- [ ] Reviews/ratings (difficulty, organization quality, value)

### v2.1 — AI Features
- [ ] AI auto-tagging (Claude classifies new competitions)
- [ ] Profile matching (skills → match score)
- [ ] ROI score (time + cost + resume value + networking)
- [ ] Prep resources (auto-link past winners, starter kits)

### v2.2 — Alerts & Integrations
- [ ] Smart notifications (new S-tier, D-7 deadline, reopened series)
- [ ] Channels: Email digest / Discord bot / Slack webhook
- [ ] Public REST API (`/api/competitions?category=robotics&tier=S`)
- [ ] RSS feed (per-category subscription)

### v3.0 — Community
- [ ] User-submitted competitions (form → review → merge)
- [ ] Discussion threads (per-competition Q&A)
- [ ] Competition comparison (side-by-side 2-3 competitions)

---

## 11. Design

See `design-reference.md` for full details. Summary:

- **Theme**: Dark (zinc-950 bg, zinc-900 cards)
- **Font**: Inter (body) + JetBrains Mono (dates/codes)
- **Tier colors**: S=gold(amber), A=silver(slate), B=bronze(stone), C=gray(zinc)
- **Category colors**: Robotics=blue, AD=violet, AI=green, EE=yellow, ME=orange, Aero=cyan
- **Principles**: Borders over shadows, generous whitespace, 3-level text hierarchy, subtle hover transitions
