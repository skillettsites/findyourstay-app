"use client";

import { useRouter } from "next/navigation";

export function BackButton({ fallback = "/", label = "Back" }: { fallback?: string; label?: string }) {
  const router = useRouter();
  function go() {
    if (typeof window !== "undefined" && window.history.length > 1) router.back();
    else router.push(fallback);
  }
  return (
    <button
      onClick={go}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink hover:bg-mist border border-line rounded-full pl-2.5 pr-4 py-2 transition active:scale-95"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </button>
  );
}
