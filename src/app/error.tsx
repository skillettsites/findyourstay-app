"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex-1 grid place-items-center px-6 py-24 text-center">
      <div>
        <p className="text-5xl font-display font-extrabold text-gradient-brand">Oops</p>
        <h1 className="text-2xl font-semibold mt-4">Something went wrong</h1>
        <p className="text-muted mt-2">Please try again in a moment.</p>
        <div className="flex gap-3 justify-center mt-6">
          <button onClick={reset} className="bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-6 py-3 rounded-full shadow-glow">
            Try again
          </button>
          <Link href="/" className="border border-ink font-semibold px-6 py-3 rounded-full hover:bg-mist">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
