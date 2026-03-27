export default function GobernanzaSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 space-y-8 lg:space-y-10 animate-pulse">
      <div className="bg-slate-100 border border-slate-200 rounded-3xl p-10 space-y-4">
        <div className="h-8 w-72 bg-slate-200 rounded-xl" />
        <div className="h-4 w-full max-w-2xl bg-slate-200 rounded-lg" />
        <div className="flex gap-3 mt-2">
          <div className="h-7 w-40 bg-slate-200 rounded-full" />
          <div className="h-7 w-32 bg-slate-200 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-50 border rounded-2xl p-6 space-y-3">
            <div className="h-3 w-28 bg-slate-200 rounded" />
            <div className="h-8 w-20 bg-slate-200 rounded-lg" />
            <div className="h-3 w-24 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white border rounded-3xl p-8 space-y-4">
            <div className="h-6 w-44 bg-slate-200 rounded" />
            <div className="h-48 bg-slate-100 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
