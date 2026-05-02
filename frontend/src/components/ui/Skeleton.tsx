// Skeleton shimmer components for YouTube-style loading states

export const SkeletonBlock = ({ className = '' }: { className?: string }) => (
  <div className={`skeleton-shimmer ${className}`} />
);

// Dashboard page skeleton — 4 stat cards + 6 campaign cards
export const DashboardSkeleton = () => (
  <div className="max-w-6xl mx-auto space-y-8">
    {/* Stats row */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="glass-card p-5 space-y-3">
          <SkeletonBlock className="h-3 w-24 rounded" />
          <SkeletonBlock className="h-7 w-16 rounded" />
        </div>
      ))}
    </div>

    {/* Header row */}
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <SkeletonBlock className="h-5 w-36 rounded" />
        <SkeletonBlock className="h-3 w-24 rounded" />
      </div>
      <SkeletonBlock className="h-10 w-36 rounded-xl" />
    </div>

    {/* Campaign cards grid */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="glass-card p-6 space-y-4">
          <div className="space-y-2">
            <SkeletonBlock className="h-4 w-3/4 rounded" />
            <div className="flex gap-2">
              <SkeletonBlock className="h-5 w-20 rounded-full" />
              <SkeletonBlock className="h-5 w-16 rounded-full" />
            </div>
          </div>
          <div className="space-y-2">
            <SkeletonBlock className="h-3 w-full rounded" />
            <SkeletonBlock className="h-3 w-full rounded" />
            <SkeletonBlock className="h-3 w-2/3 rounded" />
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <SkeletonBlock className="h-3 w-20 rounded" />
            <SkeletonBlock className="h-7 w-16 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Campaign detail view skeleton
export const CampaignViewSkeleton = () => (
  <div className="max-w-6xl mx-auto">
    {/* Back button */}
    <SkeletonBlock className="h-9 w-28 rounded-xl mb-6" />

    {/* Hero card */}
    <div className="glass-card p-8 mb-6 space-y-4">
      <SkeletonBlock className="h-7 w-2/3 rounded" />
      <div className="space-y-2">
        <SkeletonBlock className="h-4 w-full rounded" />
        <SkeletonBlock className="h-4 w-full rounded" />
        <SkeletonBlock className="h-4 w-3/4 rounded" />
      </div>
      <div className="flex gap-3 pt-2">
        <SkeletonBlock className="h-10 w-36 rounded-xl" />
        <SkeletonBlock className="h-10 w-28 rounded-xl" />
      </div>
    </div>

    {/* 3 metric boxes */}
    <div className="grid grid-cols-3 gap-4 mb-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="glass-card p-5 space-y-2">
          <SkeletonBlock className="h-3 w-16 rounded" />
          <SkeletonBlock className="h-6 w-24 rounded" />
          <SkeletonBlock className="h-3 w-full rounded" />
        </div>
      ))}
    </div>

    {/* Section cards */}
    {[...Array(4)].map((_, i) => (
      <div key={i} className="glass-card p-6 mb-4 space-y-4">
        <SkeletonBlock className="h-5 w-40 rounded" />
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-full rounded" />
          <SkeletonBlock className="h-4 w-full rounded" />
          <SkeletonBlock className="h-4 w-5/6 rounded" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((__, j) => (
            <SkeletonBlock key={j} className="h-7 w-24 rounded-lg" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

// Settings page skeleton
export const SettingsSkeleton = () => (
  <div className="max-w-2xl mx-auto space-y-6">
    {/* Header */}
    <div className="space-y-2 mb-8">
      <SkeletonBlock className="h-7 w-32 rounded" />
      <SkeletonBlock className="h-4 w-56 rounded" />
    </div>

    {/* Profile card */}
    <div className="glass-card p-7 space-y-5">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="h-10 w-10 rounded-xl" />
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-20 rounded" />
          <SkeletonBlock className="h-3 w-28 rounded" />
        </div>
      </div>
      <SkeletonBlock className="h-11 w-full rounded-xl" />
      <SkeletonBlock className="h-11 w-full rounded-xl" />
      <SkeletonBlock className="h-10 w-32 rounded-xl" />
    </div>

    {/* Subscription card */}
    <div className="glass-card p-7 space-y-5">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="h-10 w-10 rounded-xl" />
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-28 rounded" />
          <SkeletonBlock className="h-3 w-24 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SkeletonBlock className="h-20 rounded-xl" />
        <SkeletonBlock className="h-20 rounded-xl" />
      </div>
      <SkeletonBlock className="h-16 w-full rounded-xl" />
    </div>

    {/* Danger zone */}
    <div className="glass-card p-7 space-y-4">
      <div className="flex items-center gap-3">
        <SkeletonBlock className="h-10 w-10 rounded-xl" />
        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-24 rounded" />
          <SkeletonBlock className="h-3 w-32 rounded" />
        </div>
      </div>
      <SkeletonBlock className="h-4 w-full rounded" />
      <SkeletonBlock className="h-10 w-36 rounded-xl" />
    </div>
  </div>
);

// Full dashboard layout skeleton (for layout.tsx while auth loads)
export const DashboardLayoutSkeleton = () => (
  <div className="min-h-screen bg-bg-dark flex w-full">
    {/* Fake sidebar */}
    <div className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 bg-bg-card border-r border-border-color p-6 space-y-6">
      {/* Logo area */}
      <SkeletonBlock className="h-8 w-32 rounded" />
      <div className="space-y-2 pt-4">
        {[...Array(5)].map((_, i) => (
          <SkeletonBlock key={i} className="h-10 w-full rounded-xl" />
        ))}
      </div>
      <div className="mt-auto pt-4">
        <SkeletonBlock className="h-16 w-full rounded-xl" />
      </div>
    </div>

    {/* Main area */}
    <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
      {/* Fake topbar */}
      <div className="h-16 border-b border-border-color px-6 flex items-center justify-between">
        <SkeletonBlock className="h-5 w-40 rounded" />
        <div className="flex gap-3">
          <SkeletonBlock className="h-8 w-8 rounded-full" />
          <SkeletonBlock className="h-8 w-24 rounded-lg" />
        </div>
      </div>
      {/* Fake content */}
      <div className="flex-1 p-6 dot-grid">
        <DashboardSkeleton />
      </div>
    </div>
  </div>
);
