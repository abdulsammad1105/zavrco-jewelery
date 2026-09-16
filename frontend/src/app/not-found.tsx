import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 text-center">
      <div>
        <p className="text-6xl font-light text-chrome mb-4">404</p>
        <h1 className="text-xl tracking-wider uppercase font-light mb-4">
          Page Not Found
        </h1>
        <p className="text-sm text-muted mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 border border-offwhite text-offwhite text-sm tracking-wider uppercase hover:bg-offwhite hover:text-obsidian transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
