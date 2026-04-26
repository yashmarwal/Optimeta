'use client';

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center max-w-sm">
        <div className="text-4xl font-black gradient-text mb-3">Error</div>
        <p className="text-text-muted text-sm mb-6">{error.message || 'Something went wrong.'}</p>
        <button onClick={reset} className="btn-gradient px-6 py-2.5 rounded-xl text-sm font-semibold">
          Try Again
        </button>
      </div>
    </div>
  );
}
