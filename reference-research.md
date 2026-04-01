# CompFinder — Foundation Research

> Researched 2026-04-01. 30+ web searches across 2 parallel agents.

---

## 1. Competitive Landscape

### Key Finding: NO dedicated aggregator exists for robotics/AD/engineering competitions.
- MLContests = ML only
- Devpost = hackathons only (hosting, not aggregation)
- CLIST = competitive programming only
- **This is CompFinder's core differentiator.**

### Direct Competitors / Similar Sites

| Site | URL | Focus | Tech | Good | Bad |
|------|-----|-------|------|------|-----|
| **MLContests** | [mlcontests.com](https://mlcontests.com/) | ML/DS/AI | GitHub Pages + `competitions.json` | Tag filtering (40+ tags), schema, community PRs | ML only, basic table UI, no search |
| **CLIST** | [clist.by](https://clist.by/) | Competitive programming | Django + Docker, [GitHub](https://github.com/aropan/clist) | **Auto-crawling** 50+ platforms, API, alerts | CP only, ugly UI |
| **Devpost** | [devpost.com](https://devpost.com) | Hackathons | Proprietary | Project submission workflow, hidden API | Hosting only, not aggregation |
| **Unstop** | [unstop.com](https://unstop.com) | India early talent | Proprietary | Multi-domain, 6M+ users, one-click apply | India-centric |
| **DoraHacks** | [dorahacks.io](https://dorahacks.io/) | Web3/AI | Proprietary | AI profiles (BUIDL Agent), $300M+ funding | Web3-biased |
| **MLH** | [mlh.io](https://mlh.io/) | Student hackathons | Proprietary | Season calendar, OAuth, 1M+ devs | Hackathons only, US-centric |
| **HackerEarth** | [hackerearth.com](https://www.hackerearth.com/) | Tech recruiting + hackathons | Proprietary | 2000+ participant events, coding + hackathons | Corporate recruiting focus |
| **Devfolio** | [devfolio.co](https://devfolio.co/) | India hackathons | Proprietary | 3 modes (offline/online/judged), auto-fill | India-only |
| **Kaggle** | [kaggle.com/competitions](https://www.kaggle.com/competitions) | Data science | Proprietary | Category filter, sort by prize/deadline/teams | Self-hosted only, not aggregation |

### Korean Platforms

| Site | URL | Focus |
|------|-----|-------|
| **Linkareer** | [linkareer.com](https://linkareer.com) | Korean student activities + contests |
| **CampusPick** | [campuspick.com](https://www.campuspick.com/) | Korean student community + contests |
| **ThinkGood** | [thinkcontest.com](https://www.thinkcontest.com/) | Korean contest media |
| **DACON** | [dacon.io](https://dacon.io/) | Korean AI competitions |
| **AI Factory** | [aifactory.space](https://aifactory.space/) | Korean AI contests |

### Engineering-Specific Platforms (fragmented, no single aggregator)

| Platform | URL | Focus |
|----------|-----|-------|
| **RoboNation** | [robonation.org](https://robonation.org/) | Autonomous marine/aerial robots (RoboBoat, SUAS, RobotX) |
| **SAE International** | [sae.org/attend/student-events](https://www.sae.org/attend/student-events) | Formula SAE, Baja SAE, AutoDrive, 8 competition styles |
| **FIRST Robotics** | [frc-events.firstinspires.org](https://frc-events.firstinspires.org/) | FRC events portal, **has API** |
| **IEEE ICRA** | [2026.ieee-icra.org/program/competitions](https://2026.ieee-icra.org/program/competitions/) | Academic robotics challenges |
| **OpenDriveLab** | [opendrivelab.com](https://opendrivelab.com/) | AD benchmark challenges |
| **VDI ADC** | [vdi-adc.de](https://www.vdi-adc.de/) | 1:8 scale autonomous driving (Germany) |
| **Ennomotive** | [ennomotive.com](https://www.ennomotive.com/) | Industrial engineering challenges |
| **HeroX** | heroX.com | XPRIZE co-founder's challenge platform |

---

## 2. Crawling Methods Per Platform

### Platforms with APIs (easy)

| Platform | Method | Auth | Notes |
|----------|--------|------|-------|
| **Devpost** | Hidden REST API: `GET https://devpost.com/api/hackathons?page=1&status[]=open&search=AI` | None | Returns JSON, undocumented but stable |
| **Kaggle** | Official API: `pip install kaggle`, `api.competitions_list()` | `kaggle.json` token | Well-documented |
| **EvalAI** | REST API: `/api/challenges/{time}/{approved}/{published}` | None | Django-based, [source](https://github.com/Cloud-CV/EvalAI) |
| **HuggingFace** | Hub API + `huggingface_hub` Python client | Optional | Competitions via Spaces API |
| **FIRST Robotics** | Official event API | API key | Season-based listing |

### Platforms requiring scraping (medium)

| Platform | Method | Notes |
|----------|--------|-------|
| **DrivenData** | BeautifulSoup on `/competitions/` | No API |
| **lablab.ai** | BeautifulSoup on `/ai-hackathons` | No API |
| **MLContests** | Read their `competitions.json` directly from GitHub | [Raw JSON](https://github.com/mlcontests/mlcontests.github.io) |
| **Linkareer** | BeautifulSoup or Playwright | Korean, JS-rendered |
| **DACON** | BeautifulSoup on competition listing | Korean |

### Conference pages (manual + annual update)

| Source | Frequency | Notes |
|--------|-----------|-------|
| ICRA competitions page | 1x/year | Page structure changes yearly |
| CVPR workshop challenges | 1x/year | Multiple workshop pages |
| NeurIPS/ICML competition tracks | 1x/year | Announced ~3 months before |
| RoboCup | 1x/year | League-specific deadlines |

### Devpost Scraper Code Example

```python
import requests

BASE_URL = "https://devpost.com/api/hackathons"
params = {"page": 1, "status[]": "open", "search": "robotics"}
response = requests.get(BASE_URL, params=params)
data = response.json()
# data["hackathons"] = list of hackathon objects
```

Existing repos:
- [aaravkhamar/devpost-scraper](https://github.com/aaravkhamar/devpost-scraper) — 10 lines
- [chrisk60331/devpost_scraper](https://github.com/chrisk60331/devpost_scraper) — MCP server integration (2026-03)

---

## 3. Architecture Model: Best References

### Model A: MLContests (JSON static site) — **closest to our MVP**

```
competitions.json (manually curated + community PRs)
  → GitHub Pages static site
  → Tag-based filtering in browser
```

- Schema: [schema.json](https://github.com/mlcontests/mlcontests.github.io/blob/master/schema.json)
- Fields: name, url, tags[], deadline, prize, platform, sponsor
- Tags: 120+ categories (robotics, driving, llm, agents, rl, etc.)

### Model B: CLIST (auto-crawling Django app) — **target for Phase 2**

```
50+ platform crawlers (Python)
  → Django ORM → PostgreSQL
  → Django templates (server-rendered)
  → REST API for external consumers
  → Email/Telegram alerts
```

### Model C: Git Scraping (Simon Willison) — **our chosen approach**

```
GitHub Actions cron (daily)
  → Python crawlers write JSON
  → git commit + push (auto version history)
  → Vercel detects change → rebuild Next.js SSG
  → Live site updated
```

- Reference: [simonwillison.net/tags/git-scraping](https://simonwillison.net/tags/git-scraping)
- Example: [swyxio/gh-action-data-scraping](https://github.com/swyxio/gh-action-data-scraping)
- Pros: $0 cost, auto version history, simple
- Cons: GitHub Actions cron ±15min accuracy, not for heavy scraping

---

## 4. Data Deduplication Strategy

### Recommended: RapidFuzz + URL normalization

```python
from rapidfuzz import process, fuzz

# Step 1: URL-based dedup (exact match)
seen_urls = set()

# Step 2: Name normalization
def normalize(name):
    name = name.lower()
    for word in ["hackathon", "challenge", "competition", "contest", "2026", "2025"]:
        name = name.replace(word, "")
    return name.strip()

# Step 3: Fuzzy matching on normalized names
# token_set_ratio >= 85 = candidate duplicate

# Step 4: Date cross-check
# Similar name + deadline ±3 days = confirmed duplicate
```

Library: [rapidfuzz/RapidFuzz](https://github.com/rapidfuzz/RapidFuzz) — 10-100x faster than FuzzyWuzzy

---

## 5. Frontend References

### Component Libraries

| Component | Library | Notes |
|-----------|---------|-------|
| Card grid + filters | **shadcn/ui** | Card, Badge, Select, Checkbox |
| Calendar view | **FullCalendar** or **Mina Scheduler** | [Mina](https://mina-scheduler.vercel.app/) = shadcn native |
| D-day countdown | Custom (JS Date) | `useEffect` + `setInterval(1000)` |
| Command palette search | **cmdk** | Fast fuzzy search |
| URL-based filter state | **nuqs** | Shareable filter URLs |
| Data table (alt view) | **shadcn DataTable** + TanStack Table | Sortable columns |

### UI/UX Best Practices

- **1 card, 1 concept** — don't overload cards
- **Sufficient whitespace** between cards for visual reset
- **Async filter updates** — filter results without page reload
- **Applied filters visible** — always show active filters
- **Mobile-first** — card stack on mobile, grid on desktop

### Design References

| Site | What to Copy |
|------|-------------|
| [Devpost hackathons](https://devpost.com/hackathons) | Card layout, status badges |
| [Kaggle competitions](https://www.kaggle.com/competitions) | Filter sidebar, sort options |
| [Product Hunt](https://www.producthunt.com/) | Upvote/ranking visual pattern |
| [Mobbin card patterns](https://mobbin.com/glossary/card) | Card UI design gallery |

---

## 6. Open Source Repos to Study

| Repo | Stars | What | Use For |
|------|-------|------|---------|
| [mlcontests/mlcontests.github.io](https://github.com/mlcontests/mlcontests.github.io) | Active | ML competition JSON + static site | **Data schema, tag system** |
| [aropan/clist](https://github.com/aropan/clist) | Active | CP contest aggregator (Django) | **Crawler architecture, API design** |
| [JaiAnshSB26/hackathon_Scraper](https://github.com/JaiAnshSB26/hackathon_Scraper) | Small | Flask + Selenium scraper | **Multi-site scraping pattern** |
| [aaravkhamar/devpost-scraper](https://github.com/aaravkhamar/devpost-scraper) | Small | Devpost API scraper | **Devpost crawling code** |
| [chrisk60331/devpost_scraper](https://github.com/chrisk60331/devpost_scraper) | New | Devpost MCP server | **Latest Devpost scraping** |
| [dribdat/awesome-hackathon](https://github.com/dribdat/awesome-hackathon) | Curated | Hackathon tools/platforms list | **Source discovery** |
| [mbiesiad/awesome-hackathons](https://github.com/mbiesiad/awesome-hackathons) | Curated | Hackathon list | **Platform sources** |
| [swyxio/gh-action-data-scraping](https://github.com/swyxio/gh-action-data-scraping) | Active | Git scraping template | **GitHub Actions cron pattern** |

---

## 7. Key Takeaways for CompFinder

### What to Copy
1. **MLContests** — JSON schema + tag system + static site architecture
2. **CLIST** — Auto-crawling + API + alert system
3. **Kaggle** — Filter/sort UI (prize, deadline, participants)
4. **Devpost** — Card layout + hidden API for scraping
5. **Git Scraping** — $0 cost data pipeline via GitHub Actions

### What Makes Us Different
1. **Engineering-wide** — not just ML, includes robotics/AD/EE/ME/aero
2. **Tier classification** — S/A/B/C based on prize + scale + organizer
3. **Multi-source auto-aggregation** — 13+ sources, not just one platform
4. **Korean + Global** — bilingual, covers Korean platforms too

### Estimated Coverage
- **Auto-crawlable (API)**: Devpost, Kaggle, EvalAI, HuggingFace = ~60% of competitions
- **Scrapable (HTML)**: DrivenData, lablab.ai, DACON, Linkareer = ~20%
- **Manual/annual**: ICRA, CVPR, NeurIPS, RoboCup, SAE = ~15%
- **Community-submitted**: Edge cases = ~5%
