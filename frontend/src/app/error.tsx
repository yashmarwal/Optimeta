'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-bg-dark dot-grid flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl font-black gradient-text mb-4">Error</div>
        <h2 className="text-xl font-bold text-white mb-3">Something went wrong</h2>
        <p className="text-text-muted text-sm mb-8">{error.message || 'An unexpected error occurred.'}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-gradient px-6 py-2.5 rounded-xl text-sm font-semibold">
            Try Again
          </button>
          <Link href="/">
            <button className="btn-ghost px-6 py-2.5 rounded-xl text-sm font-semibold">
              Go Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
