import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink, MapPin, Calendar, Trophy, Users, Globe } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllCompetitions, getCompetitionBySlug, getRelatedCompetitions, getSeriesBySlug } from "@/lib/data";
import { TierBadge } from "@/components/shared/TierBadge";
import { DdayBadge } from "@/components/shared/DdayBadge";
import { CategoryTag } from "@/components/shared/CategoryTag";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { CompetitionCard } from "@/components/competition/CompetitionCard";
import { formatPrize, formatDateRange, formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  return getAllCompetitions().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const comp = getCompetitionBySlug(slug);
  if (!comp) return { title: "Not Found" };
  return {
    title: comp.name,
    description: comp.description,
  };
}

export default async function CompetitionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("detail");

  const comp = getCompetitionBySlug(slug);
  if (!comp) notFound();

  const related = getRelatedCompetitions(comp);
  const series = comp.seriesId ? getSeriesBySlug(comp.seriesId) : undefined;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/competitions"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToList")}
      </Link>

      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <TierBadge tier={comp.tier} />
          <StatusBadge status={comp.status} />
          <DdayBadge deadline={comp.registrationDeadline} />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-zinc-50">{comp.name}</h1>
        <p className="mb-4 text-lg text-zinc-400">{comp.organizer}</p>
        <div className="flex flex-wrap gap-2">
          {comp.categories.map((cat) => (
            <CategoryTag key={cat} category={cat} />
          ))}
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <InfoCard icon={<Trophy className="h-5 w-5 text-amber-400" />} label={t("prize")} value={comp.prizeDescription || formatPrize(comp.prizeAmount, comp.prizeCurrency) || "—"} />
        <InfoCard icon={<MapPin className="h-5 w-5 text-blue-400" />} label={t("location")} value={comp.location || "—"} />
        <InfoCard icon={<Calendar className="h-5 w-5 text-emerald-400" />} label={t("dates")} value={formatDateRange(comp.startDate, comp.endDate) || "—"} />
        <InfoCard icon={<Calendar className="h-5 w-5 text-red-400" />} label={t("registrationDeadline")} value={comp.registrationDeadline ? formatDate(comp.registrationDeadline) : "—"} />
        <InfoCard icon={<Users className="h-5 w-5 text-violet-400" />} label={t("format")} value={comp.format.charAt(0).toUpperCase() + comp.format.slice(1)} />
        <InfoCard icon={<Globe className="h-5 w-5 text-cyan-400" />} label={t("language")} value={comp.language.toUpperCase()} />
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-zinc-50">{t("about")}</h2>
        <p className="text-zinc-300 leading-relaxed">{comp.description}</p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-zinc-50">{t("eligibility")}</h2>
        <div className="space-y-1 text-sm text-zinc-400">
          <p>{t("studentOnly")}: {comp.studentOnly ? t("yes") : t("no")}</p>
          {comp.requiresDegree && <p>{t("requires")}: {comp.requiresDegree}</p>}
          {comp.teamSize && (
            <p>{t("teamSize")}: {comp.teamSize.min}–{comp.teamSize.max}</p>
          )}
          {comp.entryBarriers && comp.entryBarriers.length > 0 && (
            <p>{t("entryBarriers")}: {comp.entryBarriers.join(", ")}</p>
          )}
        </div>
      </section>

      {series && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-zinc-50">{t("series")}</h2>
          <Link
            href={`/series/${series.slug}`}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm transition-colors hover:border-zinc-600"
          >
            <span className="text-zinc-50 font-medium">{series.name}</span>
            <span className="text-zinc-500">
              {series.recurrence} since {series.firstYear}
            </span>
          </Link>
        </section>
      )}

      <div className="mb-12">
        <a
          href={comp.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-50 px-6 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
        >
          {t("visitOfficial")}
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-zinc-50">{t("relatedCompetitions")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((c) => (
              <CompetitionCard key={c.id} competition={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="text-sm font-medium text-zinc-200">{value}</p>
      </div>
    </div>
  );
}
