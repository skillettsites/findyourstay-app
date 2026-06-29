"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { SearchBar } from "./SearchBar";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero({ total }: { total: number }) {
  const reduce = useReducedMotion();
  const router = useRouter();
  const [mode, setMode] = useState<"search" | "ai">("search");
  const [ask, setAsk] = useState("");
  const line1 = ["Find", "your", "stay."];

  return (
    <section className="relative border-b border-line">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="aurora" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/30 to-white" />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center">
        <motion.span
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-line rounded-full px-4 py-1.5 text-sm font-medium text-ink shadow-card"
        >
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          {total.toLocaleString()} independent stays, zero booking fees
        </motion.span>

        <h1 className="mt-7 font-display font-extrabold tracking-tight text-[clamp(2.6rem,7vw,5.25rem)] leading-[0.98]">
          <span className="block">
            {line1.map((w, i) => (
              <motion.span
                key={w}
                initial={reduce ? false : { opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: EASE, delay: 0.1 + i * 0.08 }}
                className={`inline-block mr-[0.25em] ${i === 2 ? "text-gradient-brand" : "text-gradient-ink"}`}
              >
                {w}
              </motion.span>
            ))}
          </span>
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.42 }}
            className="block text-gradient-ink"
          >
            Book direct.
          </motion.span>
        </h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
          className="mt-6 text-muted text-lg sm:text-xl max-w-2xl mx-auto"
        >
          Hosts keep 100% with zero commission, and guests get the best price and a little
          extra. Everyone gets more when you book direct.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.66 }}
          className="mt-10"
        >
          <div className="flex justify-center gap-1.5 mb-3">
            <button onClick={() => setMode("search")} className={`text-sm font-semibold px-4 py-1.5 rounded-full transition ${mode === "search" ? "bg-ink text-white" : "bg-white/70 text-muted hover:text-ink"}`}>Search stays</button>
            <button onClick={() => setMode("ai")} className={`text-sm font-semibold px-4 py-1.5 rounded-full transition inline-flex items-center gap-1.5 ${mode === "ai" ? "bg-brand-gradient text-white shadow-glow" : "bg-white/70 text-muted hover:text-ink"}`}>✦ Ask AI</button>
          </div>
          {mode === "search" ? (
            <div className="relative z-30 bg-white/60 backdrop-blur-xl rounded-full p-1.5 shadow-float ring-1 ring-black/5 inline-block w-full max-w-3xl">
              <SearchBar />
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); const q = ask.trim(); router.push(q ? `/guests?q=${encodeURIComponent(q)}` : "/guests"); }}
              className="relative z-30 bg-white/70 backdrop-blur-xl rounded-full p-1.5 pl-5 shadow-float ring-1 ring-black/5 flex w-full max-w-3xl mx-auto items-center gap-2"
            >
              <span className="text-brand text-lg">✦</span>
              <input value={ask} onChange={(e) => setAsk(e.target.value)} placeholder="Describe your ideal stay, e.g. a cosy B&B in Porto near the river" className="flex-1 bg-transparent outline-none text-sm sm:text-base py-2.5 min-w-0" />
              <button className="bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-5 py-2.5 rounded-full shadow-glow shrink-0">Ask</button>
            </form>
          )}
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-2 text-sm text-muted"
        >
          <Trust>No commission, ever</Trust>
          <Trust>Independent hosts only</Trust>
          <Trust>Pay the owner directly</Trust>
        </motion.div>
      </div>
    </section>
  );
}

function Trust({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-brand">
        <path d="M5 12l4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {children}
    </span>
  );
}
