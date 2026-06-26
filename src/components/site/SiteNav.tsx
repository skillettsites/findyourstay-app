"use client";

import Link from "next/link";
import { useState } from "react";

export interface NavLink {
  key: string;
  label: string;
  href: string;
}

export function SiteNav({
  name,
  domain,
  links,
  active,
  bookHref,
}: {
  name: string;
  domain: string;
  links: NavLink[];
  active: string;
  bookHref: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-line">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href={links[0].href} className="flex flex-col leading-tight">
          <span className="font-display font-bold text-lg tracking-tight">{name}</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted">{domain}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.key}
              href={l.href}
              className={`text-sm font-medium transition ${active === l.key ? "text-brand" : "text-ink hover:text-brand"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href={bookHref} className="hidden sm:inline-block bg-brand-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-full">
            Check availability
          </Link>
          <button onClick={() => setOpen((o) => !o)} className="md:hidden w-10 h-10 grid place-items-center" aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={open ? "M6 6l12 12M6 18L18 6" : "M3 6h18M3 12h18M3 18h18"} strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-white">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.key} href={l.href} onClick={() => setOpen(false)} className={`px-2 py-2.5 rounded-lg font-medium ${active === l.key ? "text-brand bg-rose-50" : "hover:bg-mist"}`}>
                {l.label}
              </Link>
            ))}
            <Link href={bookHref} onClick={() => setOpen(false)} className="mt-1 bg-brand-gradient text-white text-center font-semibold px-5 py-2.5 rounded-full">
              Check availability
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
