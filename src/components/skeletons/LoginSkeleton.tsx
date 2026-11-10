// src/components/skeletons/LoginSkeleton.tsx
import { Skeleton } from '@/components/ui/Skeleton';

export function LoginSkeleton() {
  return (
    <div className="min-h-screen bg-[#050505] text-white relative flex flex-col justify-between overflow-x-clip select-none">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_6%_6%,rgba(127,29,29,0.14),transparent_32%),radial-gradient(circle_at_88%_90%,rgba(127,29,29,0.14),transparent_32%)]" />
        <div className="absolute -left-32 -top-32 w-[22rem] h-[22rem] rounded-full bg-red-800/15 blur-[130px]" />
        <div className="absolute -right-24 -bottom-24 w-[24rem] h-[24rem] rounded-full bg-red-800/15 blur-[130px]" />
      </div>
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2">
        <section className="hidden lg:flex items-center justify-center border-r border-white/10 p-12">
          <div className="max-w-lg w-full">
            <div className="flex items-center gap-4 mb-7">
              <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48 rounded-lg" />
                <Skeleton className="h-4 w-64 rounded opacity-50" />
              </div>
            </div>
          </div>
        </section>
        <section className="flex flex-col items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md border border-white/10 bg-black/55 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
            <div className="flex flex-col items-center text-center gap-3 mb-6">
              <Skeleton className="w-12 h-12 rounded-xl lg:hidden mb-2" />
              <Skeleton className="h-7 w-24 rounded-lg" />
              <Skeleton className="h-3.5 w-60 rounded opacity-40" />
            </div>
            <Skeleton className="w-full h-12 rounded-xl mb-5" />
            <div className="flex justify-center">
              <Skeleton className="h-3 w-64 rounded opacity-30" />
            </div>
          </div>
        </section>
      </main>
      <footer className="relative z-10 border-t border-white/[0.08] bg-black/60 backdrop-blur-sm py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-20 rounded" />
            <span className="text-zinc-600">•</span>
            <Skeleton className="h-3 w-32 rounded opacity-40" />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Skeleton className="h-3 w-16 rounded opacity-40" />
            <span className="text-zinc-600">•</span>
            <Skeleton className="h-3 w-16 rounded opacity-40" />
            <span className="text-zinc-600">•</span>
            <Skeleton className="h-3 w-16 rounded opacity-40" />
          </div>
        </div>
      </footer>
    </div>
  );
}