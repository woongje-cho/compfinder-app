import { Link } from "@/i18n/navigation";
import type { Workshop } from "@/lib/types";
import { CategoryTag } from "@/components/shared/CategoryTag";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DdayBadge } from "@/components/shared/DdayBadge";
import { formatDate } from "@/lib/utils";
import { MapPin, Calendar, FileText } from "lucide-react";

const SUBMISSION_LABELS: Record<string, string> = {
  "full-paper": "Full Paper",
  "extended-abstract": "Extended Abstract",
  both: "Full / Abstract",
  poster: "Poster",
};

export function WorkshopCard({ workshop: w }: { workshop: Workshop }) {
  return (
    <Link href={`/workshops/${w.slug}`}>
      <article className="group flex h-full flex-col rounded-lg border border-zinc-800 bg-zinc-900 p-5 transition-colors duration-200 hover:border-zinc-600">
        {/* Top row */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-400">
            {w.parentAcronym}
          </span>
          <div className="flex items-center gap-2">
            <StatusBadge status={w.status} />
            <DdayBadge deadline={w.submissionDeadline} />
          </div>
        </div>

        {/* Title + Organizers */}
        <h3 className="mb-1 text-base font-semibold text-zinc-50 group-hover:text-white">
          {w.name}
        </h3>
        <p className="mb-3 text-sm text-zinc-400">{w.parentConference}</p>

        {/* Category tags */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {w.categories.map((cat) => (
            <CategoryTag key={cat} category={cat} />
          ))}
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-2 flex-1 text-sm text-zinc-500">
          {w.description}
        </p>

        {/* Bottom meta */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-zinc-800 pt-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <FileText className="h-3.5 w-3.5" />
            {SUBMISSION_LABELS[w.submissionType] || w.submissionType}
          </span>
          {w.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {w.location}
            </span>
          )}
          {w.submissionDeadline && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(w.submissionDeadline)}
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}
