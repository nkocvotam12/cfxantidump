// src/components/skeletons/DashboardSkeleton.tsx
import { Skeleton } from '@/components/ui/Skeleton';

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex overflow-hidden select-none">
      <aside className="hidden lg:flex w-60 flex-col bg-black/40 backdrop-blur-md border-r border-white/5 p-4 shrink-0 justify-between">
        <div>
          <div className="flex items-center gap-3 px-2 py-3 mb-6">
            <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
            <div className="space-y-1.5 flex-1 min-w-0">
              <Skeleton className="h-3.5 w-24 rounded" />
              <Skeleton className="h-2.5 w-16 rounded opacity-40" />
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/[0.02] mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-2 w-16 rounded opacity-40" />
              </div>
            </div>
            <Skeleton className="w-3.5 h-3.5 rounded shrink-0 opacity-30" />
          </div>
          <div className="space-y-1.5">
            {['w-24', 'w-20', 'w-28', 'w-24', 'w-20', 'w-32', 'w-24'].map((w, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
                <Skeleton className="w-4 h-4 rounded shrink-0 opacity-50" />
                <Skeleton className={`h-3 ${w} rounded`} />
              </div>
            ))}
          </div>
        </div>
        <div className="pt-4 border-t border-white/5 flex items-center gap-3 px-2">
          <Skeleton className="w-9 h-9 rounded-full shrink-0" />
          <div className="space-y-1.5 flex-1 min-w-0">
            <Skeleton className="h-3 w-20 rounded" />
            <Skeleton className="h-2.5 w-14 rounded opacity-40" />
          </div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-black/25 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Skeleton className="lg:hidden w-11 h-11 rounded-xl shrink-0" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4 rounded-full shrink-0 opacity-40" />
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-28 rounded" />
                <Skeleton className="h-2 w-20 rounded opacity-40" />
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 bg-black/10 overflow-y-auto space-y-6">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <Skeleton className="w-6 h-6 rounded-md opacity-60" />
              <Skeleton className="h-7 w-36 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="card p-4 flex flex-col justify-between h-32">
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <Skeleton className="h-3.5 w-24 rounded" />
                    <Skeleton className="h-2.5 w-32 rounded opacity-50" />
                  </div>
                  <Skeleton className="w-10 h-10 rounded-lg shrink-0 opacity-60" />
                </div>
                <Skeleton className="h-9 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}