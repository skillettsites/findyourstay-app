"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Sticky bottom bar shown on guide articles — converts readers into hosts.
// Appears once the reader is into the article; dismissible for the session.
export function StickyAddStay() {
  const [show, setShow] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("fys_guide_bar_closed")) { setClosed(true); return; }
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (closed || !show) return null;
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 glass border-t border-line shadow-[0_-6px_24px_rgba(0,0,0,0.08)]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 flex items-center gap-3">
        <p className="text-sm text-ink flex-1 min-w-0">
          <span className="font-semibold">Keep ~£13 of every £100 booking.</span>
          <span className="text-muted hidden sm:inline"> Get your own direct-booking site — 0% commission, ever.</span>
        </p>
        <Link href="/host/build" className="shrink-0 bg-brand-gradient bg-brand-gradient-hover text-white text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-full shadow-glow transition-transform active:scale-95">
          See your free site →
        </Link>
        <button
          onClick={() => { setClosed(true); sessionStorage.setItem("fys_guide_bar_closed", "1"); }}
          aria-label="Dismiss"
          className="shrink-0 w-8 h-8 grid place-items-center rounded-full text-muted hover:bg-line/60"
        >✕</button>
      </div>
    </div>
  );
}
