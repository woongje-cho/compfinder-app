import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllSeries, getSeriesBySlug, getSeriesEditions } from "@/lib/data";
import { TierBadge } from "@/components/shared/TierBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CategoryTag } from "@/components/shared/CategoryTag";
import { formatPrizeShort, formatDateRange } from "@/lib/utils";

export async function generateStaticParams() {
  return getAllSeries().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) return { title: "Not Found" };
  return {
    title: `${series.name} — Series History`,
    description: series.description,
  };
}

export default async function SeriesDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("seriesDetail");

  const series = getSeriesBySlug(slug);
  if (!series) notFound();

  const editions = getSeriesEditions(series.seriesId);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/series"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("allSeries")}
      </Link>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-zinc-50">{series.name}</h1>
        <p className="mb-4 text-zinc-400">{series.organizer}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {series.categories.map((cat) => (
            <CategoryTag key={cat} category={cat} />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
          <span className="capitalize">{series.recurrence}</span>
          {series.firstYear && <span>Since {series.firstYear}</span>}
          <a
            href={series.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-zinc-400 transition-colors hover:text-zinc-50"
          >
            {t("officialWebsite")} <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <p className="mb-8 text-zinc-300 leading-relaxed">{series.description}</p>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-zinc-50">{t("editions")}</h2>
        <div className="space-y-3">
          {editions.map((ed) => (
            <Link
              key={ed.id}
              href={`/competitions/${ed.slug}`}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-zinc-600"
            >
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-zinc-300 font-mono w-12">
                  {ed.year || "—"}
                </span>
                <div>
                  <p className="text-sm font-medium text-zinc-200">
                    {ed.location || "TBD"}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatDateRange(ed.startDate, ed.endDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {ed.prizeAmount && (
                  <span className="text-xs text-zinc-500">
                    {formatPrizeShort(ed.prizeAmount)}
                  </span>
                )}
                <TierBadge tier={ed.tier} />
                <StatusBadge status={ed.status} />
              </div>
            </Link>
          ))}
        </div>

        {editions.length === 0 && (
          <p className="text-sm text-zinc-500">{t("noEditions")}</p>
        )}
      </section>
    </div>
  );
}
