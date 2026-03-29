function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-border-default ${className ?? ""}`}
    />
  );
}

export default function SetorPageLoading() {
  return (
    <div className="space-y-6">
      {/* Insights skeleton */}
      <div className="rounded-[28px] border border-border-default bg-white p-5 sm:p-6">
        <Skeleton className="h-5 w-40" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      </div>

      {/* List heading skeleton */}
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-72" />
      </div>

      <Skeleton className="h-px w-full rounded-none" />

      {/* Cards skeleton (cells or child units) */}
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="rounded-[24px] border border-border-default bg-white p-5 sm:p-6"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 shrink-0 rounded-full" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-16 rounded-full" />
                <Skeleton className="h-5 w-40" />
                <div className="flex gap-2 pt-1">
                  <Skeleton className="h-7 w-36 rounded-full" />
                  <Skeleton className="h-7 w-20 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-5 w-5 shrink-0 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
