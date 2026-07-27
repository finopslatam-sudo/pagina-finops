'use client';

export default function CostosSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12 animate-pulse">
      <div className="bg-slate-100 border border-slate-200 rounded-3xl p-8 space-y-4">
        <div className="h-8 w-56 bg-slate-200 rounded-xl" />
        <div className="h-4 w-full max-w-xl bg-slate-200 rounded-lg" />
      </div>
      <div className="h-10 w-48 bg-slate-100 rounded-xl" />
      {[...Array(3)].map((_, row) => (
        <div key={row} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, col) => (
            <div key={col} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
              <div className="h-3 w-40 bg-slate-200 rounded" />
              <div className="h-8 w-32 bg-slate-200 rounded-lg" />
            </div>
          ))}
        </div>
      ))}
      <div className="bg-white border border-slate-200 p-8 rounded-3xl">
        <div className="h-6 w-44 bg-slate-200 rounded mb-6" />
        <div className="h-48 bg-slate-100 rounded-xl" />
      </div>
    </div>
  );
}
