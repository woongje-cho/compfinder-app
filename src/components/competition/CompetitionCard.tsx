import { Link } from "@/i18n/navigation";
import type { Competition } from "@/lib/types";
import { TierBadge } from "@/components/shared/TierBadge";
import { DdayBadge } from "@/components/shared/DdayBadge";
import { CategoryTag } from "@/components/shared/CategoryTag";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatPrizeShort, formatDate } from "@/lib/utils";
import { MapPin, Calendar, Trophy } from "lucide-react";

export function CompetitionCard({ competition: c }: { competition: Competition }) {
  return (
    <Link href={`/competitions/${c.slug}`}>
      <article className="group flex h-full flex-col rounded-lg border border-zinc-800 bg-zinc-900 p-5 transition-colors duration-200 hover:border-zinc-600">
        {/* Top row: tier + status + D-day */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <TierBadge tier={c.tier} />
          <div className="flex items-center gap-2">
            <StatusBadge status={c.status} />
            <DdayBadge deadline={c.registrationDeadline} />
          </div>
        </div>

        {/* Title + Organizer */}
        <h3 className="mb-1 text-base font-semibold text-zinc-50 group-hover:text-white">
          {c.name}
        </h3>
        <p className="mb-3 text-sm text-zinc-400">{c.organizer}</p>

        {/* Category tags */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          {c.categories.map((cat) => (
            <CategoryTag key={cat} category={cat} />
          ))}
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-2 flex-1 text-sm text-zinc-500">
          {c.description}
        </p>

        {/* Bottom meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-zinc-800 pt-3 text-xs text-zinc-400">
          {c.prizeAmount && (
            <span className="flex items-center gap-1">
              <Trophy className="h-3.5 w-3.5" />
              {formatPrizeShort(c.prizeAmount)}
            </span>
          )}
          {c.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {c.location}
            </span>
          )}
          {(c.registrationDeadline || c.startDate) && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(c.registrationDeadline || c.startDate)}
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}
