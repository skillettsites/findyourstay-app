"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Brand } from "./Brand";
import { SearchBar } from "./SearchBar";
import { Magnetic } from "./Motion";

export function Header({ showSearch = true }: { showSearch?: boolean }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 12));

  return (
    <motion.header
      initial={false}
      animate={{
        boxShadow: scrolled ? "0 4px 24px -8px rgba(0,0,0,0.12)" : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.3 }}
      className={`sticky top-0 z-40 glass border-b transition-colors ${
        scrolled ? "border-line" : "border-transparent"
      }`}
    >
      <motion.div
        animate={{ height: scrolled ? 60 : 72 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between gap-4"
      >
        <Brand />
        {showSearch && (
          <div className="hidden md:block">
            <SearchBar compact />
          </div>
        )}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/host"
            className="hidden sm:inline-block text-sm font-semibold px-4 py-2 rounded-full hover:bg-mist transition"
          >
            List your stay
          </Link>
          <Magnetic>
            <Link
              href="/host/dashboard"
              className="flex items-center gap-2 border border-line rounded-full pl-3 pr-1.5 py-1.5 bg-white hover:shadow-float transition-shadow"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              </svg>
              <span className="grid place-items-center w-7 h-7 rounded-full bg-ink text-white text-xs font-semibold">H</span>
            </Link>
          </Magnetic>
        </nav>
      </motion.div>
    </motion.header>
  );
}
