export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 h-9 w-48 animate-pulse rounded-lg bg-zinc-800" />
      <div className="mb-6 h-11 w-full animate-pulse rounded-lg bg-zinc-800" />
      <div className="mb-6 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-24 animate-pulse rounded-lg bg-zinc-800" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-lg border border-zinc-800 bg-zinc-900" />
        ))}
      </div>
    </div>
  );
}
