import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllCompetitions, getStats } from "@/lib/data";
import { CompetitionCard } from "@/components/competition/CompetitionCard";
import { StatCard } from "@/components/shared/StatCard";
import { formatPrizeShort } from "@/lib/utils";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const stats = getStats();
  const all = getAllCompetitions();
  const featured = all.filter((c) => c.featured);
  const closingSoon = all
    .filter((c) => c.status === "closing_soon")
    .sort((a, b) => {
      const aDate = a.registrationDeadline || "9999";
      const bDate = b.registrationDeadline || "9999";
      return aDate.localeCompare(bDate);
    });
  const open = all
    .filter((c) => c.status === "open" && !c.featured)
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <section className="mb-12">
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-zinc-50 sm:text-5xl">
          {t("heroTitle1")}
          <br />
          <span className="text-zinc-400">{t("heroTitle2")}</span>
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-zinc-400">
          {t("heroDescription")}
        </p>
        <Link
          href="/competitions"
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-50 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200"
        >
          {t("browseAll")}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      <section className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label={t("totalCompetitions")} value={stats.total} />
        <StatCard label={t("currentlyOpen")} value={stats.open} />
        <StatCard label={t("closingSoon")} value={stats.closingSoon} />
        <StatCard label={t("totalPrizes")} value={formatPrizeShort(stats.totalPrize)} />
      </section>

      {closingSoon.length > 0 && (
        <section className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-50">{t("closingSoonTitle")}</h2>
            <Link href="/competitions" className="text-sm text-zinc-400 transition-colors hover:text-zinc-50">
              {t("viewAll")}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {closingSoon.map((c) => (
              <CompetitionCard key={c.id} competition={c} />
            ))}
          </div>
        </section>
      )}

      {featured.length > 0 && (
        <section className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-50">{t("featuredTitle")}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <CompetitionCard key={c.id} competition={c} />
            ))}
          </div>
        </section>
      )}

      {open.length > 0 && (
        <section className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-50">{t("openNowTitle")}</h2>
            <Link href="/competitions" className="text-sm text-zinc-400 transition-colors hover:text-zinc-50">
              {t("viewAll")}
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {open.map((c) => (
              <CompetitionCard key={c.id} competition={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
