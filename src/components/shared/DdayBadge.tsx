import { getDaysUntil, formatDday, cn } from "@/lib/utils";

export function DdayBadge({
  deadline,
  className,
}: {
  deadline?: string;
  className?: string;
}) {
  const days = getDaysUntil(deadline);
  if (days === null) return null;
  if (days < 0) return null;

  const label = formatDday(deadline);
  const color =
    days <= 3
      ? "text-red-400 bg-red-400/10 border-red-400/30"
      : days <= 7
        ? "text-orange-400 bg-orange-400/10 border-orange-400/30"
        : days <= 14
          ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/30"
          : "text-zinc-400 bg-zinc-400/10 border-zinc-400/30";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-mono font-medium",
        color,
        className
      )}
    >
      {label}
    </span>
  );
}
