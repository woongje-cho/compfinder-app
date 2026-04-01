import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink, MapPin, Calendar, Trophy, Users, Globe } from "lucide-react";
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comp = getCompetitionBySlug(slug);
  if (!comp) notFound();

  const related = getRelatedCompetitions(comp);
  const series = comp.seriesId ? getSeriesBySlug(comp.seriesId) : undefined;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Back link */}
      <Link
        href="/competitions"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to competitions
      </Link>

      {/* Header */}
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

      {/* Info Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <InfoCard icon={<Trophy className="h-5 w-5 text-amber-400" />} label="Prize" value={comp.prizeDescription || formatPrize(comp.prizeAmount, comp.prizeCurrency) || "—"} />
        <InfoCard icon={<MapPin className="h-5 w-5 text-blue-400" />} label="Location" value={comp.location || "—"} />
        <InfoCard icon={<Calendar className="h-5 w-5 text-emerald-400" />} label="Dates" value={formatDateRange(comp.startDate, comp.endDate) || "—"} />
        <InfoCard icon={<Calendar className="h-5 w-5 text-red-400" />} label="Registration Deadline" value={comp.registrationDeadline ? formatDate(comp.registrationDeadline) : "—"} />
        <InfoCard icon={<Users className="h-5 w-5 text-violet-400" />} label="Format" value={comp.format.charAt(0).toUpperCase() + comp.format.slice(1)} />
        <InfoCard icon={<Globe className="h-5 w-5 text-cyan-400" />} label="Language" value={comp.language.toUpperCase()} />
      </div>

      {/* Description */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-zinc-50">About</h2>
        <p className="text-zinc-300 leading-relaxed">{comp.description}</p>
      </section>

      {/* Eligibility */}
      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-zinc-50">Eligibility</h2>
        <div className="space-y-1 text-sm text-zinc-400">
          <p>Student only: {comp.studentOnly ? "Yes" : "No"}</p>
          {comp.requiresDegree && <p>Requires: {comp.requiresDegree}</p>}
          {comp.teamSize && (
            <p>
              Team size: {comp.teamSize.min}–{comp.teamSize.max}
            </p>
          )}
          {comp.entryBarriers && comp.entryBarriers.length > 0 && (
            <p>Entry barriers: {comp.entryBarriers.join(", ")}</p>
          )}
        </div>
      </section>

      {/* Series link */}
      {series && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-zinc-50">Series</h2>
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

      {/* CTA */}
      <div className="mb-12">
        <a
          href={comp.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-50 px-6 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
        >
          Visit Official Page
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold text-zinc-50">Related Competitions</h2>
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
