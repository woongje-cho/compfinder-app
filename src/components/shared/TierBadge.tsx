import { TIER_CONFIG } from "@/lib/constants";
import type { Tier } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TierBadge({ tier, className }: { tier: Tier; className?: string }) {
  const config = TIER_CONFIG[tier];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-semibold",
        config.color,
        className
      )}
    >
      {tier === "S" && "🏆"} {tier}-{config.label}
    </span>
  );
}
