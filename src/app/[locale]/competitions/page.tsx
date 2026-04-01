import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllCompetitions } from "@/lib/data";
import { CompetitionCard } from "@/components/competition/CompetitionCard";
import { MobileFilterToggle } from "@/components/competition/MobileFilterToggle";
import { SearchBar } from "@/components/competition/SearchBar";
import { CATEGORY_CONFIG, TIER_CONFIG, STATUS_CONFIG, REGION_CONFIG } from "@/lib/constants";
import type { Category, Tier, Status, Region } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Competitions",
  description: "Browse all engineering competitions worldwide — filter by tier, category, region, and more.",
};

export default function CompetitionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  return <CompetitionsContent paramsPromise={params} searchParamsPromise={searchParams} />;
}

async function CompetitionsContent({
  paramsPromise,
  searchParamsPromise,
}: {
  paramsPromise: Promise<{ locale: string }>;
  searchParamsPromise: Promise<{ [key: string]: string | undefined }>;
}) {
  const { locale } = await paramsPromise;
  setRequestLocale(locale);
  const t = await getTranslations("competitions");
  const tRegion = await getTranslations("region");

  const params = await searchParamsPromise;
  const all = getAllCompetitions();

  const activeRegion = (params.region as Region) || undefined;
  const activeTiers = params.tier ? (params.tier.split(",") as Tier[]) : undefined;
  const activeCategories = params.category
    ? (params.category.split(",") as Category[])
    : undefined;
  const activeStatuses = params.status
    ? (params.status.split(",") as Status[])
    : undefined;
  const search = params.search || "";

  let filtered = [...all];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.organizer.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }

  if (activeRegion) {
    filtered = filtered.filter((c) => {
      if (c.format === "hybrid") return true;
      return c.region === activeRegion;
    });
  }

  if (activeTiers && activeTiers.length > 0) {
    filtered = filtered.filter((c) => activeTiers.includes(c.tier));
  }

  if (activeCategories && activeCategories.length > 0) {
    filtered = filtered.filter((c) =>
      c.categories.some((cat) => activeCategories.includes(cat))
    );
  }

  if (activeStatuses && activeStatuses.length > 0) {
    filtered = filtered.filter((c) => activeStatuses.includes(c.status));
  }

  const sort = params.sort || "deadline";
  filtered.sort((a, b) => {
    switch (sort) {
      case "deadline": {
        const aDate = a.registrationDeadline || a.startDate || "9999";
        const bDate = b.registrationDeadline || b.startDate || "9999";
        return aDate.localeCompare(bDate);
      }
      case "prize-desc":
        return (b.prizeAmount || 0) - (a.prizeAmount || 0);
      case "tier": {
        const tierOrder: Record<string, number> = { S: 0, A: 1, B: 2, C: 3 };
        return (tierOrder[a.tier] || 9) - (tierOrder[b.tier] || 9);
      }
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const regionLabels: Record<string, string> = {
    korea: tRegion("korea"),
    global: tRegion("global"),
    online: tRegion("online"),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-zinc-50">{t("title")}</h1>

      <Suspense fallback={<div className="mb-6 h-11 w-full animate-pulse rounded-lg bg-zinc-800" />}>
        <SearchBar />
      </Suspense>

      {/* Region Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <RegionTab region={undefined} label={t("all")} count={all.length} active={!activeRegion} params={params} />
        {(Object.keys(REGION_CONFIG) as Region[]).map((r) => (
          <RegionTab
            key={r}
            region={r}
            label={regionLabels[r]}
            count={all.filter((c) => c.region === r || c.format === "hybrid").length}
            active={activeRegion === r}
            params={params}
          />
        ))}
      </div>

      {/* Mobile Filters */}
      <MobileFilterToggle>
        <FilterSection title={t("filterTier")}>
          {(Object.keys(TIER_CONFIG) as Tier[]).map((tier) => (
            <FilterItem key={tier} label={`${tier}-${TIER_CONFIG[tier].label}`} paramKey="tier" paramValue={tier} active={activeTiers?.includes(tier) || false} params={params} />
          ))}
        </FilterSection>
        <FilterSection title={t("filterCategory")}>
          {(Object.keys(CATEGORY_CONFIG) as Category[]).map((cat) => (
            <FilterItem key={cat} label={`${CATEGORY_CONFIG[cat].icon} ${CATEGORY_CONFIG[cat].label}`} paramKey="category" paramValue={cat} active={activeCategories?.includes(cat) || false} params={params} />
          ))}
        </FilterSection>
        <FilterSection title={t("filterStatus")}>
          {(Object.keys(STATUS_CONFIG) as Status[]).map((s) => (
            <FilterItem key={s} label={STATUS_CONFIG[s].label} paramKey="status" paramValue={s} active={activeStatuses?.includes(s) || false} params={params} />
          ))}
        </FilterSection>
      </MobileFilterToggle>

      <div className="flex gap-8">
        <aside className="hidden w-56 shrink-0 space-y-6 lg:block">
          <FilterSection title={t("filterTier")}>
            {(Object.keys(TIER_CONFIG) as Tier[]).map((tier) => (
              <FilterItem key={tier} label={`${tier}-${TIER_CONFIG[tier].label}`} paramKey="tier" paramValue={tier} active={activeTiers?.includes(tier) || false} params={params} />
            ))}
          </FilterSection>
          <FilterSection title={t("filterCategory")}>
            {(Object.keys(CATEGORY_CONFIG) as Category[]).map((cat) => (
              <FilterItem key={cat} label={`${CATEGORY_CONFIG[cat].icon} ${CATEGORY_CONFIG[cat].label}`} paramKey="category" paramValue={cat} active={activeCategories?.includes(cat) || false} params={params} />
            ))}
          </FilterSection>
          <FilterSection title={t("filterStatus")}>
            {(Object.keys(STATUS_CONFIG) as Status[]).map((s) => (
              <FilterItem key={s} label={STATUS_CONFIG[s].label} paramKey="status" paramValue={s} active={activeStatuses?.includes(s) || false} params={params} />
            ))}
          </FilterSection>
        </aside>

        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-zinc-400">{t("count", { count: filtered.length })}</p>
            <SortSelect current={sort} params={params} t={t} />
          </div>
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-12 text-center">
              <p className="text-zinc-400">{t("noResults")}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((c) => (
                <CompetitionCard key={c.id} competition={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Helper Components ───

function buildUrl(params: Record<string, string | undefined>, overrides: Record<string, string | undefined>) {
  const merged = { ...params, ...overrides };
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(merged)) {
    if (value) searchParams.set(key, value);
  }
  const qs = searchParams.toString();
  return `/competitions${qs ? `?${qs}` : ""}`;
}

function RegionTab({
  region, label, count, active, params,
}: {
  region: Region | undefined; label: string; count: number; active: boolean;
  params: Record<string, string | undefined>;
}) {
  const href = buildUrl(params, { region: region || undefined });
  return (
    <Link
      href={href}
      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-zinc-600 bg-zinc-800 text-zinc-50"
          : "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
      }`}
    >
      {label} <span className="text-zinc-500">({count})</span>
    </Link>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function toggleParam(current: string | undefined, value: string): string | undefined {
  if (!current) return value;
  const arr = current.split(",");
  if (arr.includes(value)) {
    const filtered = arr.filter((v) => v !== value);
    return filtered.length > 0 ? filtered.join(",") : undefined;
  }
  return [...arr, value].join(",");
}

function FilterItem({
  label, paramKey, paramValue, active, params,
}: {
  label: string; paramKey: string; paramValue: string; active: boolean;
  params: Record<string, string | undefined>;
}) {
  const newValue = toggleParam(params[paramKey], paramValue);
  const href = buildUrl(params, { [paramKey]: newValue });
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors ${
        active ? "bg-zinc-800 text-zinc-50" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
      }`}
    >
      <span className={`h-3.5 w-3.5 rounded-sm border ${active ? "border-zinc-50 bg-zinc-50" : "border-zinc-600"}`} />
      {label}
    </Link>
  );
}

function SortSelect({
  current, params, t,
}: {
  current: string;
  params: Record<string, string | undefined>;
  t: (key: string) => string;
}) {
  const options = [
    { value: "deadline", label: t("sortDeadline") },
    { value: "prize-desc", label: t("sortPrize") },
    { value: "tier", label: t("sortTier") },
    { value: "name", label: t("sortName") },
  ];
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-400">
      <span>{t("sort")}:</span>
      <div className="flex gap-1">
        {options.map((opt) => (
          <Link
            key={opt.value}
            href={buildUrl(params, { sort: opt.value })}
            className={`rounded-md px-2 py-1 text-xs transition-colors ${
              current === opt.value ? "bg-zinc-800 text-zinc-50" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {opt.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
