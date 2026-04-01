import type { Category, Tier, Status, Region } from "./types";

// ─── Category Config ───
export const CATEGORY_CONFIG: Record<
  Category,
  { label: string; icon: string; color: string }
> = {
  robotics: { label: "Robotics", icon: "🤖", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  ad: { label: "Autonomous Driving", icon: "🚗", color: "text-violet-400 bg-violet-400/10 border-violet-400/20" },
  "ai-ml": { label: "AI / ML", icon: "🧠", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  electrical: { label: "Electrical", icon: "⚡", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  mechanical: { label: "Mechanical", icon: "⚙️", color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
  aerospace: { label: "Aerospace", icon: "🚀", color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" },
  general: { label: "General", icon: "🔬", color: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20" },
};

// ─── Tier Config ───
export const TIER_CONFIG: Record<
  Tier,
  { label: string; color: string }
> = {
  S: { label: "Flagship", color: "text-amber-400 bg-amber-900/50 border-amber-600/50" },
  A: { label: "Major", color: "text-slate-300 bg-slate-700/50 border-slate-400/50" },
  B: { label: "Mid", color: "text-stone-300 bg-stone-700/50 border-stone-400/50" },
  C: { label: "Starter", color: "text-zinc-400 bg-zinc-700/50 border-zinc-600/50" },
};

// ─── Status Config ───
export const STATUS_CONFIG: Record<
  Status,
  { label: string; color: string; dotColor: string }
> = {
  open: { label: "Open", color: "text-emerald-400", dotColor: "bg-emerald-400" },
  closing_soon: { label: "Closing Soon", color: "text-red-400", dotColor: "bg-red-400" },
  ongoing: { label: "Ongoing", color: "text-amber-400", dotColor: "bg-amber-400" },
  upcoming: { label: "Upcoming", color: "text-blue-400", dotColor: "bg-blue-400" },
  closed: { label: "Closed", color: "text-zinc-500", dotColor: "bg-zinc-500" },
};

// ─── Region Config ───
export const REGION_CONFIG: Record<
  Region,
  { label: string; icon: string }
> = {
  korea: { label: "Korea", icon: "🇰🇷" },
  global: { label: "Global", icon: "🌍" },
  online: { label: "Online", icon: "🌐" },
};

// ─── Sort Options ───
export const SORT_OPTIONS = [
  { value: "deadline", label: "Deadline (soonest)" },
  { value: "prize-desc", label: "Prize (highest)" },
  { value: "tier", label: "Tier (S → C)" },
  { value: "recent", label: "Recently added" },
  { value: "name", label: "Name (A-Z)" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];
