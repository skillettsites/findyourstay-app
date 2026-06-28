"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

/* A self-playing ~75s motion-graphics explainer with clickable chapters.
   Pure CSS/SVG/Framer Motion — sharp at any size, no video file. Each scene
   remounts (key=i) so its entrance animations replay; chapters jump to a scene. */

const EASE = [0.16, 1, 0.3, 1] as const;
const rise = (delay = 0, y = 18) => ({ initial: { opacity: 0, y }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, ease: EASE, delay } });
const pop = (delay = 0) => ({ initial: { opacity: 0, scale: 0.82 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.55, ease: EASE, delay } });

function FilmCount({ to, duration = 1.3, prefix = "", suffix = "" }: { to: number; duration?: number; prefix?: string; suffix?: string }) {
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduce) { setN(to); return; }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / (duration * 1000));
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, reduce]);
  return <span>{prefix}{n.toLocaleString()}{suffix}</span>;
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <motion.p {...rise(0.05)} className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand">{children}</motion.p>;
}
function Title({ children, delay = 0.15 }: { children: ReactNode; delay?: number }) {
  return <motion.h3 {...rise(delay)} className="font-display font-bold text-2xl sm:text-[1.7rem] leading-[1.12] mt-3">{children}</motion.h3>;
}
function Sub({ children, delay = 0.3 }: { children: ReactNode; delay?: number }) {
  return <motion.p {...rise(delay)} className="text-white/65 mt-3 text-sm sm:text-[15px] leading-relaxed max-w-[24rem]">{children}</motion.p>;
}
function Plain({ children, delay = 0.5 }: { children: ReactNode; delay?: number }) {
  return <motion.p {...rise(delay)} className="mt-4 text-[13px] leading-relaxed text-white/80 bg-white/[0.06] border border-white/10 rounded-lg px-3 py-2 max-w-[24rem]"><span className="text-brand font-semibold">In plain English: </span>{children}</motion.p>;
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
  { id: "intro", duration: 4500, render: () => (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <motion.span {...pop(0)} className="grid place-items-center w-14 h-14 rounded-2xl bg-brand-gradient shadow-glow">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M12 2c3.9 0 7 3 7 6.8 0 4.6-3.8 9-6 12a1.2 1.2 0 0 1-2 0c-2.2-3-6-7.4-6-12C5 5 8.1 2 12 2Zm0 4.4a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8Z" /></svg>
      </motion.span>
      <motion.p {...rise(0.25)} className="font-display font-bold text-3xl mt-5">findyourstay</motion.p>
      <motion.p {...rise(0.45)} className="text-white/60 mt-2">Direct bookings, done properly.</motion.p>
      <motion.p {...rise(0.7)} className="text-white/35 text-xs mt-4 uppercase tracking-[0.3em]">A 75-second tour</motion.p>
    </div>
  ) },
  { id: "problem", duration: 7000, render: () => (
    <Scene>
      <Eyebrow>The problem</Eyebrow>
      <Title>Booking sites take 15&ndash;18% of every stay.</Title>
      <div className="mt-5">
        <div className="relative h-9 rounded-lg bg-white/10 overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.8, delay: 0.4, ease: EASE }} className="absolute inset-y-0 left-0 bg-white/15" />
          <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: "18%", opacity: 1 }} transition={{ duration: 0.7, delay: 1.2, ease: EASE }} className="absolute inset-y-0 right-0 bg-brand grid place-items-center text-[11px] font-bold">−18%</motion.div>
        </div>
        <motion.div {...rise(2)} className="flex justify-between text-sm mt-2"><span className="text-white/55">£100 booking</span><span className="font-bold">£82 to you</span></motion.div>
      </div>
      <Sub delay={2.4}>And guests often pay a service fee on top. Book direct and you both win.</Sub>
    </Scene>
  ) },
  { id: "audiences", duration: 5000, render: () => (
    <Scene>
      <Eyebrow>Built for independent hosts</Eyebrow>
      <Title>Whatever stage you&apos;re at.</Title>
      <div className="mt-6 flex flex-wrap gap-2.5">
        <Chip delay={0.35}>🔗 Already have a site</Chip>
        <Chip delay={0.55}>✨ No site yet</Chip>
        <Chip delay={0.75}>🎨 Want a better one</Chip>
      </div>
      <Sub delay={1}>We help all three get more direct bookings.</Sub>
    </Scene>
  ) },
  { id: "have", duration: 6500, render: () => (
    <Scene>
      <Eyebrow>If you have a website</Eyebrow>
      <Title>We drive direct bookings to it.</Title>
      <div className="mt-5 relative h-16">
        <Card delay={0.4} className="absolute right-0 top-0 w-40 p-3">
          <div className="text-[11px] text-white/70">your-site.com</div>
          <motion.div {...pop(1.5)} className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-300">✓ Booked direct</motion.div>
        </Card>
        <motion.span initial={{ x: 0, opacity: 0 }} animate={{ x: 150, opacity: [0, 1, 1, 0] }} transition={{ duration: 1.4, delay: 0.6, ease: EASE }} className="absolute left-0 top-3 grid place-items-center w-7 h-7 rounded-full bg-brand text-white text-xs">🧳</motion.span>
      </div>
      <motion.div {...rise(1.6)} className="mt-2 flex items-baseline gap-2">
        <span className="font-display font-bold text-3xl text-brand"><FilmCount to={37} /></span>
        <span className="text-sm text-white/60">direct bookings sent your way</span>
      </motion.div>
      <Sub delay={2}>Listed in our directory, guests sent straight to your own booking page. Nothing to rebuild.</Sub>
    </Scene>
  ) },
  { id: "build", duration: 6500, render: () => (
    <Scene>
      <Eyebrow>No website? Or don&apos;t love yours?</Eyebrow>
      <Title>We build and host one for you.</Title>
      <div className="mt-5 rounded-lg border border-white/10 overflow-hidden bg-white/[0.04]">
        <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-white/30" /><span className="w-1.5 h-1.5 rounded-full bg-white/30" />
          <span className="ml-1 text-[10px] text-white/60">yourstay.com</span><span className="ml-auto text-[9px] text-emerald-300">🔒</span>
        </div>
        <div className="p-2.5 grid grid-cols-3 gap-2">
          {SWATCH.map((s, idx) => (
            <motion.div key={idx} {...pop(0.4 + idx * 0.16)}>
              <div className={`h-12 rounded-md bg-gradient-to-br ${s}`} />
              <div className="text-[9px] text-white/55 mt-1 text-center">{["Classic", "Modern", "Coastal"][idx]}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <Sub delay={1.2}>Pick a template, we fill it in from your details and put it on your own domain. No tech skills.</Sub>
    </Scene>
  ) },
  { id: "better", duration: 6000, render: () => (
    <Scene>
      <Eyebrow>Want a better site?</Eyebrow>
      <Title>Better design. Lower cost.</Title>
      <div className="mt-5 space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1"><span className="text-white/55">Website builder + hosting</span><span className="text-white/55 line-through">£20+/mo</span></div>
          <motion.div initial={{ width: 0 }} animate={{ width: "70%" }} transition={{ duration: 1, delay: 0.4, ease: EASE }} className="h-6 rounded-md bg-white/15" />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1"><span className="font-semibold">With us</span><span className="font-bold text-brand">Included</span></div>
          <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1, delay: 0.7, ease: EASE }} className="h-6 rounded-md bg-brand-gradient" />
        </div>
      </div>
      <Sub delay={1.3}>Design, domain, hosting and security in one place, for less than you pay now.</Sub>
    </Scene>
  ) },
  { id: "keep", duration: 6000, render: () => (
    <Scene>
      <Eyebrow>Payments</Eyebrow>
      <Title>Keep 100% of every booking.</Title>
      <div className="mt-5 flex items-center gap-3">
        <span className="font-display font-bold text-3xl"><FilmCount to={100} prefix="£" /></span>
        <motion.span {...rise(0.8)} className="text-white/45">→</motion.span>
        <Card delay={0.9} className="px-3 py-2 text-sm font-semibold">Your Stripe</Card>
      </div>
      <Sub delay={1.2}>Guests pay by card into your own Stripe account. No commission, no booking fees, ever.</Sub>
    </Scene>
  ) },
  { id: "secure", duration: 6500, render: () => (
    <Scene>
      <Eyebrow>Security</Eyebrow>
      <Title>Secure, with the padlock.</Title>
      <motion.div {...rise(0.4)} className="mt-5 flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-2.5 w-fit">
        <motion.svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-300" initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ delay: 0.6, duration: 0.4 }}>
          <rect x="4" y="11" width="16" height="9" rx="2" />
          <motion.path d="M8 11V8a4 4 0 0 1 8 0v3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.9 }} />
        </motion.svg>
        <span className="text-sm font-medium">https://yourstay.com</span>
      </motion.div>
      <Plain delay={0.9}>that little padlock (HTTPS) tells guests the site is safe to pay on. We set it up and keep it renewed, automatically.</Plain>
    </Scene>
  ) },
  { id: "calendar", duration: 5500, render: () => (
    <Scene>
      <Eyebrow>Never double-booked</Eyebrow>
      <Title>Your calendar stays in sync.</Title>
      <div className="mt-5 flex items-center justify-center gap-2.5">
        <Card delay={0.3} className="px-3 py-2 text-xs font-semibold">Airbnb</Card>
        <motion.span animate={{ rotate: 360 }} transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }} className="text-brand">⟳</motion.span>
        <Card delay={0.5} className="px-3 py-2 text-xs font-semibold">Your site</Card>
        <motion.span animate={{ rotate: 360 }} transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }} className="text-brand">⟳</motion.span>
        <Card delay={0.7} className="px-3 py-2 text-xs font-semibold">Booking.com</Card>
      </div>
      <Sub delay={1}>Book a date anywhere and it blocks out everywhere. Two-way iCal sync, around the clock.</Sub>
    </Scene>
  ) },
  { id: "seo", duration: 7500, render: () => (
    <Scene>
      <Eyebrow>Get found on search</Eyebrow>
      <Title>Ranked on Google &amp; Bing.</Title>
      <div className="mt-4 flex items-end justify-between">
        <div className="flex items-end gap-1.5 h-20 flex-1">
          {[34, 46, 58, 72, 88, 100].map((h, idx) => (
            <motion.div key={idx} initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 0.5, delay: 0.4 + idx * 0.12, ease: EASE }} className="flex-1 rounded-t bg-gradient-to-t from-brand/40 to-brand" />
          ))}
        </div>
        <div className="text-right pl-4">
          <p className="font-display font-bold text-2xl text-brand"><FilmCount to={1240} /></p>
          <p className="text-[10px] text-white/55 -mt-1">monthly views</p>
        </div>
      </div>
      <Plain delay={1.4}>&quot;indexing&quot; just means showing up on Google and Bing. We submit your site so it appears, then it climbs as it gets traffic.</Plain>
    </Scene>
  ) },
  { id: "ai", duration: 7500, render: () => (
    <Scene>
      <Eyebrow>The next way people search</Eyebrow>
      <Title>Recommended by AI assistants.</Title>
      <div className="mt-4 space-y-2">
        <motion.div {...rise(0.3)} className="max-w-[80%] rounded-2xl rounded-bl-sm bg-white/10 px-3 py-1.5 text-[13px]">Where should I stay in Porto, near the river?</motion.div>
        <motion.div {...rise(0.9)} className="ml-auto max-w-[88%] rounded-2xl rounded-br-sm bg-brand-gradient px-3 py-1.5 text-[13px] font-medium">Try Casa do Rio, a lovely riverside guesthouse, book direct →</motion.div>
      </div>
      <Plain delay={1.5}>we add a small file (llms.txt) that lets ChatGPT and Gemini read your site, so they can suggest your place in their answers.</Plain>
    </Scene>
  ) },
  { id: "outro", duration: 5000, render: () => (
    <div className="h-full flex flex-col items-center justify-center text-center">
      <motion.h3 {...rise(0.1)} className="font-display font-bold text-2xl sm:text-3xl leading-tight max-w-[20rem]">Everything you need to get booked direct.</motion.h3>
      <motion.span {...pop(0.6)} className="mt-5 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold shadow-glow">List your stay</motion.span>
      <motion.p {...rise(0.9)} className="text-white/45 text-sm mt-4">findyourstay.com</motion.p>
    </div>
  ) },
];

// Clickable chapters — each jumps to a scene id.
const CHAPTERS: { label: string; id: string }[] = [
  { label: "The problem", id: "problem" },
  { label: "Who it's for", id: "audiences" },
  { label: "Your website", id: "have" },
  { label: "Payments & security", id: "keep" },
  { label: "Never double-booked", id: "calendar" },
  { label: "Get found", id: "seo" },
  { label: "Recap", id: "outro" },
];
const chapterIndex = (id: string) => SCENES.findIndex((s) => s.id === id);
const TOTAL = SCENES.reduce((s, x) => s + x.duration, 0);
const fmt = (ms: number) => { const s = Math.round(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };

export function ExplainerFilm() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => setI((p) => (p + 1) % SCENES.length), SCENES[i].duration);
    return () => clearTimeout(t);
  }, [i, playing]);

  const jump = (id: string) => { setI(chapterIndex(id)); setPlaying(true); };
  // Active chapter = last chapter whose scene starts at or before current scene.
  const activeChapter = CHAPTERS.reduce((acc, c, idx) => (chapterIndex(c.id) <= i ? idx : acc), 0);
  const elapsed = SCENES.slice(0, i).reduce((s, x) => s + x.duration, 0);

  return (
    <div>
      {/* Chapter navigation */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {CHAPTERS.map((c, idx) => (
          <button
            key={c.id}
            onClick={() => jump(c.id)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition ${idx === activeChapter ? "bg-ink text-white border-ink" : "bg-white text-muted border-line hover:border-ink hover:text-ink"}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Screen */}
      <div className="relative w-full aspect-[4/3] rounded-[1.6rem] overflow-hidden bg-[#0b0b0d] text-white shadow-2xl ring-1 ring-black/10 select-none">
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
        <div className="absolute top-0 inset-x-0 p-3 flex gap-1 z-20">
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
          <motion.div key={i} className="absolute inset-0 px-6 sm:px-8 pt-10 pb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5, ease: EASE }}>
            {SCENES[i].render()}
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="absolute bottom-0 inset-x-0 p-3 flex items-center justify-between z-20">
          <span className="text-[11px] font-medium text-white/45 tabular-nums">{fmt(elapsed)} / {fmt(TOTAL)}</span>
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
      </div>
    </div>
  );
}
