export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-5 animate-pulse">
            <div className="h-3 bg-white/5 rounded mb-3 w-2/3" />
            <div className="h-7 bg-white/5 rounded w-1/2" />
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card p-6 animate-pulse h-44">
            <div className="h-4 bg-white/5 rounded mb-3 w-3/4" />
            <div className="h-3 bg-white/5 rounded mb-2" />
            <div className="h-3 bg-white/5 rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
