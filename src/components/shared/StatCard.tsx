import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3",
        className
      )}
    >
      <p className="text-2xl font-bold text-zinc-50">{value}</p>
      <p className="text-sm text-zinc-400">{label}</p>
    </div>
  );
}
