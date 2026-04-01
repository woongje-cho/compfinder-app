import Link from "next/link";
import type { Metadata } from "next";
import { getAllSeries, getSeriesEditions } from "@/lib/data";
import { CATEGORY_CONFIG } from "@/lib/constants";
import { CategoryTag } from "@/components/shared/CategoryTag";

export const metadata: Metadata = {
  title: "Competition Series",
  description: "Browse recurring engineering competitions across years.",
};

export default function SeriesListPage() {
  const allSeries = getAllSeries();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold text-zinc-50">Competition Series</h1>
      <p className="mb-8 text-zinc-400">
        Recurring competitions that happen every year. See their full history.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allSeries.map((s) => {
          const editions = getSeriesEditions(s.seriesId);
          return (
            <Link
              key={s.seriesId}
              href={`/series/${s.slug}`}
              className="group flex flex-col rounded-lg border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-600"
            >
              <h3 className="mb-1 text-base font-semibold text-zinc-50 group-hover:text-white">
                {s.name}
              </h3>
              <p className="mb-2 text-sm text-zinc-400">{s.organizer}</p>
              <p className="mb-3 line-clamp-2 flex-1 text-sm text-zinc-500">
                {s.description}
              </p>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {s.categories.map((cat) => (
                  <CategoryTag key={cat} category={cat} />
                ))}
              </div>
              <div className="flex items-center gap-3 border-t border-zinc-800 pt-3 text-xs text-zinc-500">
                <span className="capitalize">{s.recurrence}</span>
                {s.firstYear && <span>Since {s.firstYear}</span>}
                <span>{editions.length} edition{editions.length !== 1 ? "s" : ""}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
