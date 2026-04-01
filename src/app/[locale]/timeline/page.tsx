import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllCompetitions } from "@/lib/data";
import { TierBadge } from "@/components/shared/TierBadge";
import { DdayBadge } from "@/components/shared/DdayBadge";
import { CategoryTag } from "@/components/shared/CategoryTag";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Timeline",
  description: "See all upcoming competition deadlines on a timeline.",
};

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("timeline");

  const all = getAllCompetitions();
  const withDates = all
    .filter((c) => c.registrationDeadline || c.startDate)
    .map((c) => ({
      ...c,
      sortDate: c.registrationDeadline || c.startDate || "",
    }))
    .sort((a, b) => a.sortDate.localeCompare(b.sortDate));

  const grouped = new Map<string, typeof withDates>();
  for (const c of withDates) {
    const date = new Date(c.sortDate);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(c);
  }

  const dateLocale = locale === "ko" ? "ko-KR" : "en-US";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">{t("title")}</h1>
      <p className="mb-8 text-zinc-400">{t("description")}</p>

      <div className="space-y-8">
        {Array.from(grouped.entries()).map(([month, comps]) => {
          const date = new Date(month + "-01");
          const label = date.toLocaleDateString(dateLocale, {
            month: "long",
            year: "numeric",
          });

          return (
            <section key={month}>
              <h2 className="mb-4 text-lg font-semibold text-zinc-300">{label}</h2>
              <div className="space-y-2">
                {comps.map((c) => (
                  <Link
                    key={c.id}
                    href={`/competitions/${c.slug}`}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 transition-colors hover:border-zinc-600"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-20 shrink-0 font-mono text-xs text-zinc-500">
                        {formatDate(c.sortDate)}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-zinc-200">{c.name}</p>
                        <div className="mt-1 flex gap-1.5">
                          {c.categories.slice(0, 2).map((cat) => (
                            <CategoryTag key={cat} category={cat} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TierBadge tier={c.tier} />
                      <DdayBadge deadline={c.registrationDeadline} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
