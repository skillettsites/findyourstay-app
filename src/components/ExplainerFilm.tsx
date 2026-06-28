"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

/* A self-playing ~60s motion-graphics explainer. Eleven scenes cover the
   problem, all three host audiences, and every benefit, with a stories-style
   progress bar. Pure CSS/SVG/Framer Motion: sharp at any size, no video file. */

const EASE = [0.16, 1, 0.3, 1] as const;
const rise = (delay = 0, y = 18) => ({ initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: EASE, delay } });
const pop = (delay = 0) => ({ initial: { opacity: 0, scale: 0.82 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.55, ease: EASE, delay } });

function Eyebrow({ children }: { children: ReactNode }) {
  return <motion.p {...rise(0.05)} className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand">{children}</motion.p>;
}
function Title({ children, delay = 0.15 }: { children: ReactNode; delay?: number }) {
  return <motion.h3 {...rise(delay)} className="font-display font-bold text-2xl sm:text-3xl leading-[1.12] mt-3">{children}</motion.h3>;
}
function Sub({ children, delay = 0.3 }: { children: ReactNode; delay?: number }) {
  return <motion.p {...rise(delay)} className="text-white/65 mt-3 text-sm sm:text-base leading-relaxed max-w-[22rem]">{children}</motion.p>;
}
function Chip({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return <motion.span {...pop(delay)} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-semibold">{children}</motion.span>;
}
function Card({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return <motion.div {...pop(delay)} className={`rounded-xl bg-white/[0.07] border border-white/10 ${className}`}>{children}</motion.div>;
}
const Scene = ({ children }: { children: ReactNode }) => <div className="h-full flex flex-col justify-center">{children}</div>;

const SWATCH = ["from-stone-500 to-stone-800", "from-zinc-700 to-zinc-900", "from-emerald-600 to-emerald-900"];

const SCENES: { id: string; duration: number; render: () => ReactNode }[] = [
  // 1 — Intro
  { id: "intro", duration: 4500, render: () => (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <motion.span {...pop(0)} className="grid place-items-center w-14 h-14 rounded-2xl bg-brand-gradient shadow-glow">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M12 2c3.9 0 7 3 7 6.8 0 4.6-3.8 9-6 12a1.2 1.2 0 0 1-2 0c-2.2-3-6-7.4-6-12C5 5 8.1 2 12 2Zm0 4.4a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8Z" /></svg>
      </motion.span>
      <motion.p {...rise(0.25)} className="font-display font-bold text-3xl mt-5">findyourstay</motion.p>
      <motion.p {...rise(0.45)} className="text-white/60 mt-2">Direct bookings, done properly.</motion.p>
    </div>
  ) },
  // 2 — The problem
  { id: "problem", duration: 6000, render: () => (
    <Scene>
      <Eyebrow>The problem</Eyebrow>
      <Title>Booking sites take 15&ndash;18% of every stay.</Title>
      <div className="mt-6 flex items-center gap-3">
        <motion.span {...pop(0.35)} className="font-display font-bold text-3xl">£100</motion.span>
        <motion.span initial={{ opacity: 0, y: 0 }} animate={{ opacity: [0, 1, 1, 0], y: [-2, -22, -22, -40] }} transition={{ duration: 1.6, delay: 0.7, times: [0, 0.2, 0.7, 1] }} className="text-brand font-bold">− £18</motion.span>
        <motion.span {...rise(1.4)} className="text-white/45">→</motion.span>
        <motion.span {...pop(1.5)} className="font-display font-bold text-3xl text-white/55">£82</motion.span>
      </div>
      <Sub delay={1.9}>Book direct and you keep the lot. We make that easy to win and easy to run.</Sub>
    </Scene>
  ) },
  // 3 — Who it's for
  { id: "audiences", duration: 4800, render: () => (
    <Scene>
      <Eyebrow>Built for independent hosts</Eyebrow>
      <Title>Whatever stage you&apos;re at.</Title>
      <div className="mt-6 flex flex-wrap gap-2.5">
        <Chip delay={0.35}>Already have a website</Chip>
        <Chip delay={0.55}>No website yet</Chip>
        <Chip delay={0.75}>Want a better one</Chip>
      </div>
    </Scene>
  ) },
  // 4 — Have a site
  { id: "have-site", duration: 6000, render: () => (
    <Scene>
      <Eyebrow>If you have a website</Eyebrow>
      <Title>We drive direct bookings to it.</Title>
      <div className="mt-6 relative h-20">
        <Card delay={0.4} className="absolute right-0 top-1 w-40 p-3">
          <div className="flex gap-1 mb-2"><span className="w-1.5 h-1.5 rounded-full bg-white/30" /><span className="w-1.5 h-1.5 rounded-full bg-white/30" /></div>
          <div className="text-[11px] text-white/70">your-site.com</div>
          <motion.div {...pop(1.5)} className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300"><span>✓</span> Booked direct</motion.div>
        </Card>
        <motion.span initial={{ x: 0, opacity: 0 }} animate={{ x: 150, opacity: [0, 1, 1, 0] }} transition={{ duration: 1.4, delay: 0.6, ease: EASE }} className="absolute left-0 top-7 grid place-items-center w-7 h-7 rounded-full bg-brand text-white text-xs">🧳</motion.span>
      </div>
      <Sub delay={1.7}>Listed in our directory and sent straight to your own booking page. Nothing to rebuild.</Sub>
    </Scene>
  ) },
  // 5 — No site
  { id: "no-site", duration: 6000, render: () => (
    <Scene>
      <Eyebrow>If you don&apos;t</Eyebrow>
      <Title>We build and host one for you.</Title>
      <div className="mt-6 flex gap-3">
        {SWATCH.map((s, idx) => (
          <Card key={idx} delay={0.4 + idx * 0.18} className="w-24 p-0 overflow-hidden">
            <div className={`h-14 bg-gradient-to-br ${s}`} />
            <div className="px-2 py-1.5 text-[10px] text-white/60">{["Classic", "Modern", "Coastal"][idx]}</div>
          </Card>
        ))}
      </div>
      <Sub delay={1.1}>Three premium templates, filled in from your details, on your own domain. No tech skills needed.</Sub>
    </Scene>
  ) },
  // 6 — Better + cheaper
  { id: "better", duration: 5500, render: () => (
    <Scene>
      <Eyebrow>Already have a site you don&apos;t love?</Eyebrow>
      <Title>Better design. Lower cost.</Title>
      <div className="mt-6 flex items-center gap-3">
        <motion.span {...pop(0.4)} className="line-through text-white/40 font-semibold">Website builders £20+/mo</motion.span>
        <motion.span {...rise(0.9)} className="text-white/40">→</motion.span>
        <motion.span {...pop(1)} className="rounded-full bg-brand-gradient px-3 py-1.5 text-sm font-bold">Included</motion.span>
      </div>
      <Sub delay={1.4}>Design, domain, hosting and security in one place, for less than you pay now.</Sub>
    </Scene>
  ) },
  // 7 — Keep 100% + secure
  { id: "secure", duration: 6000, render: () => (
    <Scene>
      <Eyebrow>Payments &amp; security</Eyebrow>
      <Title>Keep 100%. Secure by default.</Title>
      <div className="mt-6 flex items-center gap-4">
        <motion.span {...pop(0.4)} className="grid place-items-center w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-300">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z" /><motion.path d="M9 12l2 2 4-4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 1 }} /></svg>
        </motion.span>
        <div>
          <motion.p {...rise(0.7)} className="text-sm">Card payments into <b>your own Stripe</b>.</motion.p>
          <motion.p {...rise(0.9)} className="text-sm text-white/60">HTTPS padlock included. No commission, ever.</motion.p>
        </div>
      </div>
    </Scene>
  ) },
  // 8 — Calendar sync
  { id: "calendar", duration: 5000, render: () => (
    <Scene>
      <Eyebrow>Never double-booked</Eyebrow>
      <Title>Your calendar stays in sync.</Title>
      <div className="mt-6 flex items-center gap-3">
        <Card delay={0.4} className="px-3 py-2 text-xs font-semibold">Airbnb</Card>
        <motion.span animate={{ rotate: 360 }} transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }} className="text-brand">⟳</motion.span>
        <Card delay={0.6} className="px-3 py-2 text-xs font-semibold">Your site</Card>
        <motion.span animate={{ rotate: 360 }} transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }} className="text-brand">⟳</motion.span>
        <Card delay={0.8} className="px-3 py-2 text-xs font-semibold">Booking.com</Card>
      </div>
      <Sub delay={1.1}>Two-way iCal sync keeps every channel up to date, automatically.</Sub>
    </Scene>
  ) },
  // 9 — Reach / indexing
  { id: "reach", duration: 6000, render: () => (
    <Scene>
      <Eyebrow>Get found</Eyebrow>
      <Title>Ranked on Google &amp; Bing.</Title>
      <div className="mt-5 space-y-1.5">
        {[0, 1, 2].map((idx) => (
          <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0, y: idx === 2 ? [0, -34, -34] : 0 }} transition={{ duration: 0.6, delay: 0.4 + idx * 0.2, y: { delay: 1.3, duration: 0.7, ease: EASE } }} className={`h-7 rounded-md flex items-center px-3 text-xs ${idx === 2 ? "bg-brand-gradient font-semibold" : "bg-white/[0.07] text-white/55"}`} style={idx === 2 ? { width: "92%" } : { width: `${80 - idx * 8}%` }}>
            {idx === 2 ? "★ Your stay — book direct" : "a competitor"}
          </motion.div>
        ))}
      </div>
      <Sub delay={2}>Submitted for indexing the day you launch. More reach, more direct bookings.</Sub>
    </Scene>
  ) },
  // 10 — AI discovery
  { id: "ai", duration: 6000, render: () => (
    <Scene>
      <Eyebrow>The future of finding stays</Eyebrow>
      <Title>Recommended by AI assistants.</Title>
      <div className="mt-5 space-y-2.5">
        <motion.div {...rise(0.4)} className="self-start max-w-[16rem] rounded-2xl rounded-bl-sm bg-white/10 px-3.5 py-2 text-sm">Where should I stay in Porto?</motion.div>
        <motion.div {...rise(1)} className="ml-auto max-w-[17rem] rounded-2xl rounded-br-sm bg-brand-gradient px-3.5 py-2 text-sm font-medium">Casa do Rio — lovely guesthouse, book direct →</motion.div>
      </div>
      <Sub delay={1.6}>An llms.txt on your site lets ChatGPT and Gemini read and suggest you.</Sub>
    </Scene>
  ) },
  // 11 — Outro
  { id: "outro", duration: 4400, render: () => (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <motion.h3 {...rise(0.1)} className="font-display font-bold text-2xl sm:text-3xl leading-tight max-w-[20rem]">Everything you need to get booked direct.</motion.h3>
      <motion.span {...pop(0.6)} className="mt-5 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold shadow-glow">List your stay</motion.span>
      <motion.p {...rise(0.9)} className="text-white/45 text-sm mt-4">findyourstay.com</motion.p>
    </div>
  ) },
];

const TOTAL = SCENES.reduce((s, x) => s + x.duration, 0);

export function ExplainerFilm() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setI((p) => (p + 1) % SCENES.length), SCENES[i].duration);
    return () => clearTimeout(t);
  }, [i, playing]);

  return (
    <div className="relative w-full aspect-[4/3] rounded-[1.6rem] overflow-hidden bg-[#0b0b0d] text-white shadow-2xl ring-1 ring-black/10 select-none">
      {/* Drifting brand glow for depth */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="absolute -inset-1/4 opacity-60 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(35% 35% at 30% 25%, rgba(255,56,92,0.5), transparent 60%), radial-gradient(40% 40% at 75% 80%, rgba(189,30,89,0.45), transparent 60%)" }}
          animate={{ x: ["-4%", "4%", "-2%"], y: ["-3%", "3%", "-2%"], scale: [1, 1.08, 1.02] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

      {/* Stories-style progress bar */}
      <div className="absolute top-0 inset-x-0 p-3 flex gap-1.5 z-20">
        {SCENES.map((s, idx) => (
          <div key={s.id} className="h-[3px] flex-1 rounded-full bg-white/20 overflow-hidden">
            <motion.div
              key={idx === i ? `a-${i}` : `b-${idx}`}
              className="h-full bg-white"
              initial={{ width: idx < i ? "100%" : "0%" }}
              animate={{ width: idx <= i ? "100%" : "0%" }}
              transition={{ duration: idx === i && playing ? s.duration / 1000 : 0, ease: "linear" }}
            />
          </div>
        ))}
      </div>

      {/* Scenes */}
      <AnimatePresence>
        <motion.div
          key={i}
          className="absolute inset-0 px-6 sm:px-8 pt-10 pb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {SCENES[i].render()}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="absolute bottom-0 inset-x-0 p-3 flex items-center justify-between z-20">
        <span className="text-[11px] font-medium text-white/45 tabular-nums">{`0:${String(Math.min(59, Math.round(SCENES.slice(0, i).reduce((s, x) => s + x.duration, 0) / 1000))).padStart(2, "0")} / 1:00`}</span>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"} className="grid place-items-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition">
            {playing ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l12 7-12 7z" /></svg>
            )}
          </button>
          <button onClick={() => { setI(0); setPlaying(true); }} aria-label="Replay" className="grid place-items-center w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /></svg>
          </button>
        </div>
      </div>
      <span className="sr-only">{`Total ${Math.round(TOTAL / 1000)} second explainer`}</span>
    </div>
  );
}
