interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-slate-850 rounded-xl ${className}`} />
  );
}

export function NovelCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-900 bg-[#0B0F19]/25 p-3 space-y-4 animate-pulse">
      <div className="aspect-[3/4] w-full bg-slate-900 rounded-xl" />
      <div className="space-y-2">
        <div className="h-3.5 bg-slate-900 rounded w-1/3" />
        <div className="h-4 bg-slate-900 rounded w-4/5" />
        <div className="h-3 bg-slate-900 rounded w-full" />
        <div className="h-3 bg-slate-900 rounded w-2/3" />
      </div>
      <div className="h-8 bg-slate-900 rounded-xl mt-4" />
    </div>
  );
}

export function NovelDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 aspect-[3/4] bg-slate-900 rounded-2xl" />
        <div className="md:col-span-2 space-y-4 py-4">
          <div className="h-8 bg-slate-900 rounded w-3/4" />
          <div className="h-4 bg-slate-900 rounded w-1/4" />
          <div className="h-20 bg-slate-900 rounded w-full" />
          <div className="flex gap-2 pt-4">
            <div className="h-10 bg-slate-900 rounded w-24" />
            <div className="h-10 bg-slate-900 rounded w-32" />
          </div>
        </div>
      </div>
      <div className="space-y-3 pt-6">
        <div className="h-6 bg-slate-900 rounded w-48" />
        <div className="h-10 bg-slate-900 rounded w-full" />
        <div className="h-10 bg-slate-900 rounded w-full" />
        <div className="h-10 bg-slate-900 rounded w-full" />
      </div>
    </div>
  );
}
