// ─── Enums ───
export type Category =
  | "robotics"
  | "ad"
  | "ai-ml"
  | "electrical"
  | "mechanical"
  | "aerospace"
  | "general";

export type Region = "korea" | "global" | "online";
export type Tier = "S" | "A" | "B" | "C";
export type Format = "online" | "offline" | "hybrid";
export type Status = "upcoming" | "open" | "closing_soon" | "closed";
export type Recurrence = "annual" | "biannual" | "irregular" | "one-time";
export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type EntryBarrier =
  | "laptop-only"
  | "gpu-needed"
  | "hardware-required"
  | "team-required"
  | "invitation-only";

// ─── Competition ───
export interface Competition {
  id: string;
  seriesId?: string;
  name: string;
  slug: string;
  year?: number;

  tier: Tier;
  categories: Category[];
  format: Format;
  region: Region;

  organizer: string;
  description: string;
  url: string;
  imageUrl?: string;

  prizeAmount?: number;
  prizeCurrency?: string;
  prizeDescription?: string;
  estimatedParticipants?: number;

  registrationOpen?: string;
  registrationDeadline?: string;
  startDate?: string;
  endDate?: string;

  location?: string;
  country?: string;

  language: string;
  studentOnly: boolean;
  requiresDegree?: "any" | "undergrad" | "masters" | "phd";
  teamSize?: { min: number; max: number };

  difficulty?: Difficulty;
  entryBarriers?: EntryBarrier[];

  winners?: string[];
  highlightUrl?: string;

  source: string;
  sourceUrl?: string;
  lastUpdated: string;
  status: Status;
  featured?: boolean;
}

// ─── Series ───
export interface CompetitionSeries {
  seriesId: string;
  name: string;
  slug: string;
  description: string;
  organizer: string;
  website: string;
  categories: Category[];
  recurrence: Recurrence;
  firstYear?: number;
  editionIds: string[];
}
