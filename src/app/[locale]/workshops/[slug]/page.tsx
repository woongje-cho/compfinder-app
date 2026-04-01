import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink, MapPin, Calendar, FileText, Globe, Users } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllWorkshops, getWorkshopBySlug, getRelatedWorkshops } from "@/lib/data";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DdayBadge } from "@/components/shared/DdayBadge";
import { CategoryTag } from "@/components/shared/CategoryTag";
import { WorkshopCard } from "@/components/workshop/WorkshopCard";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  return getAllWorkshops().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const w = getWorkshopBySlug(slug);
  if (!w) return { title: "Not Found" };
  return {
    title: `${w.name} — ${w.parentAcronym}`,
    description: w.description,
  };
}

const SUBMISSION_LABELS: Record<string, string> = {
  "full-paper": "Full Paper",
  "extended-abstract": "Extended Abstract",
  both: "Full Paper / Extended Abstract",
  poster: "Poster",
};

export default async function WorkshopDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("workshopDetail");

  const w = getWorkshopBySlug(slug);
  if (!w) notFound();

  const related = getRelatedWorkshops(w);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/workshops"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-zinc-50"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToList")}
      </Link>

      <div className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-400">
            {w.parentAcronym}
          </span>
          <StatusBadge status={w.status} />
          <DdayBadge deadline={w.submissionDeadline} />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-zinc-50">{w.name}</h1>
        <p className="mb-4 text-lg text-zinc-400">{w.parentConference}</p>
        <div className="flex flex-wrap gap-2">
          {w.categories.map((cat) => (
            <CategoryTag key={cat} category={cat} />
          ))}
        </div>
      </div>

      {/* Key dates */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <InfoCard icon={<Calendar className="h-5 w-5 text-red-400" />} label={t("submissionDeadline")} value={w.submissionDeadline ? formatDate(w.submissionDeadline) : "TBA"} />
        <InfoCard icon={<Calendar className="h-5 w-5 text-amber-400" />} label={t("notification")} value={w.notificationDate ? formatDate(w.notificationDate) : "TBA"} />
        <InfoCard icon={<Calendar className="h-5 w-5 text-blue-400" />} label={t("cameraReady")} value={w.cameraReadyDate ? formatDate(w.cameraReadyDate) : "TBA"} />
        <InfoCard icon={<Calendar className="h-5 w-5 text-emerald-400" />} label={t("workshopDate")} value={w.workshopDate ? formatDate(w.workshopDate) : "TBA"} />
        <InfoCard icon={<MapPin className="h-5 w-5 text-violet-400" />} label={t("location")} value={w.location || "TBA"} />
        <InfoCard icon={<FileText className="h-5 w-5 text-cyan-400" />} label={t("submissionType")} value={SUBMISSION_LABELS[w.submissionType] || w.submissionType} />
      </div>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-zinc-50">{t("about")}</h2>
        <p className="text-zinc-300 leading-relaxed">{w.description}</p>
      </section>

      {w.topics.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold text-zinc-50">{t("topics")}</h2>
          <div className="flex flex-wrap gap-2">
            {w.topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-sm text-zinc-300"
              >
                {topic}
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="mb-12">
        <a
          href={w.url}
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
          <h2 className="mb-4 text-lg font-semibold text-zinc-50">{t("relatedWorkshops")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {related.map((rw) => (
              <WorkshopCard key={rw.id} workshop={rw} />
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
