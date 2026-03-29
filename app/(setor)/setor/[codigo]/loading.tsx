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

      {/* Cells heading skeleton */}
      <div className="mt-15 space-y-2">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-4 w-64" />
      </div>

      <Skeleton className="h-px w-full rounded-none" />

      {/* Cell cards skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="rounded-[24px] border border-border-default bg-white p-5 sm:p-6"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Skeleton className="h-16 w-16 shrink-0 rounded-2xl" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-36" />
                <div className="flex flex-wrap gap-2 pt-1">
                  <Skeleton className="h-7 w-32 rounded-full" />
                  <Skeleton className="h-7 w-36 rounded-full" />
                  <Skeleton className="h-7 w-24 rounded-full" />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Skeleton className="h-9 w-28 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
