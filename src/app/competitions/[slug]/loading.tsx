export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 h-5 w-40 animate-pulse rounded bg-zinc-800" />
      <div className="mb-3 flex gap-2">
        <div className="h-6 w-12 animate-pulse rounded bg-zinc-800" />
        <div className="h-6 w-16 animate-pulse rounded bg-zinc-800" />
      </div>
      <div className="mb-2 h-9 w-96 animate-pulse rounded-lg bg-zinc-800" />
      <div className="mb-4 h-5 w-48 animate-pulse rounded bg-zinc-800" />
      <div className="mb-8 flex gap-2">
        <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-800" />
        <div className="h-6 w-20 animate-pulse rounded-full bg-zinc-800" />
      </div>
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-lg border border-zinc-800 bg-zinc-900" />
        ))}
      </div>
    </div>
  );
}
