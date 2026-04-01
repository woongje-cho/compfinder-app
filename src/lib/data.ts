import competitionsData from "../data/competitions.json";
import seriesData from "../data/series.json";
import workshopsData from "../data/workshops.json";
import type {
  Competition,
  CompetitionSeries,
  Workshop,
  Category,
  Region,
  Tier,
  Status,
} from "./types";
import type { SortOption } from "./constants";
import { computeStatus, computeWorkshopStatus } from "./utils";

// ─── Load & Hydrate ───
function hydrateCompetitions(): Competition[] {
  return (competitionsData as Competition[]).map((c) => ({
    ...c,
    status: computeStatus(c),
  }));
}

const competitions = hydrateCompetitions();
const series = seriesData as CompetitionSeries[];

function hydrateWorkshops(): Workshop[] {
  return (workshopsData as Workshop[]).map((w) => ({
    ...w,
    status: computeWorkshopStatus(w),
  }));
}

const workshops = hydrateWorkshops();

export function getAllCompetitions(): Competition[] {
  return competitions;
}

export function getAllSeries(): CompetitionSeries[] {
  return series;
}

export function getCompetitionBySlug(slug: string): Competition | undefined {
  return competitions.find((c) => c.slug === slug);
}

export function getSeriesBySlug(slug: string): CompetitionSeries | undefined {
  return series.find((s) => s.slug === slug);
}

export function getSeriesEditions(seriesId: string): Competition[] {
  return competitions
    .filter((c) => c.seriesId === seriesId)
    .sort((a, b) => (b.year || 0) - (a.year || 0));
}

export function getRelatedCompetitions(
  comp: Competition,
  limit: number = 4
): Competition[] {
  return competitions
    .filter(
      (c) =>
        c.id !== comp.id &&
        c.categories.some((cat) => comp.categories.includes(cat))
    )
    .slice(0, limit);
}

// ─── Workshop Accessors ───
export function getAllWorkshops(): Workshop[] {
  return workshops;
}

export function getWorkshopBySlug(slug: string): Workshop | undefined {
  return workshops.find((w) => w.slug === slug);
}

export function getRelatedWorkshops(
  workshop: Workshop,
  limit: number = 4
): Workshop[] {
  return workshops
    .filter(
      (w) =>
        w.id !== workshop.id &&
        (w.parentAcronym === workshop.parentAcronym ||
          w.categories.some((cat) => workshop.categories.includes(cat)))
    )
    .slice(0, limit);
}

export function getWorkshopStats() {
  const all = workshops;
  const open = all.filter((w) => w.status === "open" || w.status === "closing_soon");
  const closingSoon = all.filter((w) => w.status === "closing_soon");
  return {
    total: all.length,
    open: open.length,
    closingSoon: closingSoon.length,
  };
}

// ─── Filter & Sort ───
export interface FilterParams {
  search?: string;
  region?: Region;
  tiers?: Tier[];
  categories?: Category[];
  statuses?: Status[];
  minPrize?: number;
  maxPrize?: number;
  studentOnly?: boolean;
  sort?: SortOption;
}

export function filterCompetitions(params: FilterParams): Competition[] {
  let result = [...competitions];

  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.organizer.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }

  if (params.region) {
    result = result.filter((c) => {
      if (c.format === "hybrid") return true;
      return c.region === params.region;
    });
  }

  if (params.tiers && params.tiers.length > 0) {
    result = result.filter((c) => params.tiers!.includes(c.tier));
  }

  if (params.categories && params.categories.length > 0) {
    result = result.filter((c) =>
      c.categories.some((cat) => params.categories!.includes(cat))
    );
  }

  if (params.statuses && params.statuses.length > 0) {
    result = result.filter((c) => params.statuses!.includes(c.status));
  }

  if (params.minPrize !== undefined) {
    result = result.filter((c) => (c.prizeAmount || 0) >= params.minPrize!);
  }

  if (params.maxPrize !== undefined) {
    result = result.filter((c) => (c.prizeAmount || 0) <= params.maxPrize!);
  }

  if (params.studentOnly) {
    result = result.filter((c) => c.studentOnly);
  }

  // Sort
  const sort = params.sort || "deadline";
  result.sort((a, b) => {
    switch (sort) {
      case "deadline": {
        const aDate = a.registrationDeadline || a.startDate || "9999";
        const bDate = b.registrationDeadline || b.startDate || "9999";
        return aDate.localeCompare(bDate);
      }
      case "prize-desc":
        return (b.prizeAmount || 0) - (a.prizeAmount || 0);
      case "tier": {
        const tierOrder = { S: 0, A: 1, B: 2, C: 3 };
        return tierOrder[a.tier] - tierOrder[b.tier];
      }
      case "recent":
        return b.lastUpdated.localeCompare(a.lastUpdated);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return result;
}

// ─── Stats ───
export function getStats() {
  const all = competitions;
  const open = all.filter((c) => c.status === "open" || c.status === "closing_soon");
  const closingSoon = all.filter((c) => c.status === "closing_soon");
  const totalPrize = all.reduce((sum, c) => sum + (c.prizeAmount || 0), 0);
  const regionCounts = {
    korea: all.filter((c) => c.region === "korea").length,
    global: all.filter((c) => c.region === "global").length,
    online: all.filter((c) => c.region === "online").length,
  };
  return {
    total: all.length,
    open: open.length,
    closingSoon: closingSoon.length,
    totalPrize,
    regionCounts,
  };
}
