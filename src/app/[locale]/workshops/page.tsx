import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllWorkshops } from "@/lib/data";
import { WorkshopCard } from "@/components/workshop/WorkshopCard";
import { SearchBar } from "@/components/competition/SearchBar";
import { CATEGORY_CONFIG, STATUS_CONFIG } from "@/lib/constants";
import type { Category, Status } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Academic Workshops",
  description: "Browse academic workshops with open calls for papers — ICRA, CVPR, NeurIPS, IROS, and more.",
};

export default function WorkshopsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  return <WorkshopsContent paramsPromise={params} searchParamsPromise={searchParams} />;
}

async function WorkshopsContent({
  paramsPromise,
  searchParamsPromise,
}: {
  paramsPromise: Promise<{ locale: string }>;
  searchParamsPromise: Promise<{ [key: string]: string | undefined }>;
}) {
  const { locale } = await paramsPromise;
  setRequestLocale(locale);
  const t = await getTranslations("workshops");

  const params = await searchParamsPromise;
  const all = getAllWorkshops();

  const activeCategories = params.category
    ? (params.category.split(",") as Category[])
    : undefined;
  const activeStatuses = params.status
    ? (params.status.split(",") as Status[])
    : undefined;
  const activeConference = params.conference || undefined;
  const search = params.search || "";

  let filtered = [...all];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.parentConference.toLowerCase().includes(q) ||
        w.parentAcronym.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        w.topics.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (activeConference) {
    filtered = filtered.filter((w) => w.parentAcronym === activeConference);
  }

  if (activeCategories && activeCategories.length > 0) {
    filtered = filtered.filter((w) =>
      w.categories.some((cat) => activeCategories.includes(cat))
    );
  }

  if (activeStatuses && activeStatuses.length > 0) {
    filtered = filtered.filter((w) => activeStatuses.includes(w.status));
  }

  const sort = params.sort || "deadline";
  filtered.sort((a, b) => {
    switch (sort) {
      case "deadline": {
        const aDate = a.submissionDeadline || "9999";
        const bDate = b.submissionDeadline || "9999";
        return aDate.localeCompare(bDate);
      }
      case "date": {
        const aDate = a.workshopDate || "9999";
        const bDate = b.workshopDate || "9999";
        return aDate.localeCompare(bDate);
      }
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Collect unique conferences for tabs
  const conferences = [...new Set(all.map((w) => w.parentAcronym))].sort();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">{t("title")}</h1>
      <p className="mb-6 text-zinc-400">{t("description")}</p>

      <Suspense fallback={<div className="mb-6 h-11 w-full animate-pulse rounded-lg bg-zinc-800" />}>
        <SearchBar />
      </Suspense>

      {/* Conference Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <ConferenceTab conference={undefined} label={t("all")} count={all.length} active={!activeConference} params={params} />
        {conferences.map((conf) => (
          <ConferenceTab
            key={conf}
            conference={conf}
            label={conf}
            count={all.filter((w) => w.parentAcronym === conf).length}
            active={activeConference === conf}
            params={params}
          />
        ))}
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-56 shrink-0 space-y-6 lg:block">
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
              {filtered.map((w) => (
                <WorkshopCard key={w.id} workshop={w} />
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
  return `/workshops${qs ? `?${qs}` : ""}`;
}

function ConferenceTab({
  conference, label, count, active, params,
}: {
  conference: string | undefined; label: string; count: number; active: boolean;
  params: Record<string, string | undefined>;
}) {
  const href = buildUrl(params, { conference: conference || undefined });
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
    { value: "date", label: t("sortDate") },
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
