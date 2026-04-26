import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-dark dot-grid flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black gradient-text mb-4">404</div>
        <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-text-muted text-sm mb-8">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link href="/">
          <button className="btn-gradient px-8 py-3 rounded-xl font-semibold glow">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}
