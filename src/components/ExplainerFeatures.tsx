"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: EASE, delay },
});

/* Number that counts up the first time it scrolls into view. */
function CountUp({ to, prefix = "", suffix = "", duration = 1.5 }: { to: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
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
  }, [inView, to, duration, reduce]);
  return <span ref={ref}>{prefix}{n.toLocaleString()}{suffix}</span>;
}

const CardFrame = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`relative rounded-2xl border border-line bg-white shadow-card p-6 sm:p-7 overflow-hidden ${className}`}>{children}</div>
);

/* ---- Visual 1: drive bookings to an existing site ---- */
function FlowVisual() {
  return (
    <CardFrame>
      <div className="flex items-center justify-between gap-3">
        <motion.div {...reveal(0)} className="text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-rose-50 grid place-items-center text-xl">🧳</div>
          <p className="text-xs text-muted mt-1.5">Traveller<br />searching your area</p>
        </motion.div>
        <div className="flex-1 relative h-10">
          <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-line" />
          <motion.div initial={{ left: "0%", opacity: 0 }} whileInView={{ left: "82%", opacity: [0, 1, 1, 0] }} viewport={{ once: true }} transition={{ duration: 1.6, ease: EASE, delay: 0.4 }} className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-brand shadow-glow" />
        </div>
        <motion.div {...reveal(0.3)} className="text-center">
          <div className="w-14 h-12 mx-auto rounded-lg border border-line bg-mist grid place-items-center text-[10px] text-muted px-1">your-site.com</div>
          <motion.p {...reveal(1.2)} className="text-xs font-semibold text-emerald-600 mt-1.5">✓ Booked direct</motion.p>
        </motion.div>
      </div>
      <motion.div {...reveal(0.6)} className="mt-6 pt-5 border-t border-line flex items-end justify-between">
        <div>
          <p className="text-xs text-muted">Direct bookings sent to you</p>
          <p className="font-display font-bold text-3xl text-brand"><CountUp to={37} /></p>
        </div>
        <p className="text-xs text-muted text-right max-w-[9rem]">straight to your own booking page</p>
      </motion.div>
    </CardFrame>
  );
}

/* ---- Visual 2: we build & host a site ---- */
function BuildVisual() {
  const themes = ["from-stone-400 to-stone-700", "from-zinc-500 to-zinc-800", "from-emerald-500 to-emerald-800"];
  return (
    <CardFrame>
      <div className="rounded-lg border border-line overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-2 bg-mist border-b border-line">
          <span className="w-2 h-2 rounded-full bg-[#ff5f57]" /><span className="w-2 h-2 rounded-full bg-[#febc2e]" /><span className="w-2 h-2 rounded-full bg-[#28c840]" />
          <span className="ml-2 text-[11px] text-muted">yourstay.com</span>
          <span className="ml-auto text-[10px] text-emerald-600 font-semibold">🔒 secure</span>
        </div>
        <div className="p-3 grid grid-cols-3 gap-2">
          {themes.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: 0.3 + i * 0.15 }}>
              <div className={`h-16 rounded-md bg-gradient-to-br ${t}`} />
              <p className="text-[10px] text-muted mt-1 text-center">{["Classic", "Modern", "Coastal"][i]}</p>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.p {...reveal(0.8)} className="text-xs text-muted mt-4 text-center">Pick a template — we fill it in and host it on your own domain.</motion.p>
    </CardFrame>
  );
}

/* ---- Visual 3: keep 100% vs OTA commission ---- */
function KeepVisual() {
  const bar = (label: string, value: number, pct: number, brand: boolean, delay: number) => (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className={brand ? "font-semibold" : "text-muted"}>{label}</span>
        <span className={brand ? "font-bold text-brand" : "text-muted line-through"}>£{value}</span>
      </div>
      <div className="h-9 rounded-lg bg-mist overflow-hidden">
        <motion.div initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1.1, ease: EASE, delay }} className={`h-full rounded-lg ${brand ? "bg-brand-gradient" : "bg-line"}`} />
      </div>
    </div>
  );
  return (
    <CardFrame>
      <p className="text-xs text-muted mb-4">What you keep from a £100 booking</p>
      <div className="space-y-4">
        {bar("On a booking platform", 82, 82, false, 0.2)}
        {bar("Direct with us", 100, 100, true, 0.5)}
      </div>
      <motion.p {...reveal(0.9)} className="mt-5 text-sm">No commission. Guests pay straight into <b>your own Stripe</b>.</motion.p>
    </CardFrame>
  );
}

/* ---- Visual 4: HTTPS padlock ---- */
function SecureVisual() {
  return (
    <CardFrame className="grid place-items-center">
      <div className="w-full max-w-sm">
        <motion.div {...reveal(0)} className="flex items-center gap-2 rounded-full border border-line bg-mist px-4 py-2.5">
          <motion.svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600 shrink-0" initial={{ scale: 0.6, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}>
            <rect x="4" y="11" width="16" height="9" rx="2" />
            <motion.path d="M8 11V8a4 4 0 0 1 8 0v3" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.7 }} />
          </motion.svg>
          <span className="text-sm font-medium">https://yourstay.com</span>
        </motion.div>
        <motion.div {...reveal(0.6)} className="mt-4 flex items-center gap-2 text-sm text-emerald-700">
          <span className="grid place-items-center w-5 h-5 rounded-full bg-emerald-100 text-xs">✓</span>
          Guests see the padlock and trust the checkout.
        </motion.div>
      </div>
    </CardFrame>
  );
}

/* ---- Visual 5: calendar sync ---- */
function CalendarVisual() {
  return (
    <CardFrame>
      <div className="flex items-center justify-center gap-3">
        {["Airbnb", "Your site", "Booking.com"].map((c, i) => (
          <motion.div key={c} {...reveal(0.2 + i * 0.15)} className="text-center">
            <div className="w-16 h-16 rounded-xl border border-line bg-mist grid grid-cols-3 gap-0.5 p-1.5">
              {Array.from({ length: 9 }).map((_, j) => (
                <motion.span key={j} initial={{ opacity: 0.25 }} whileInView={{ opacity: [0.25, j % 4 === i ? 1 : 0.25] }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.6 + j * 0.04 }} className={`rounded-[2px] ${j % 4 === i ? "bg-brand" : "bg-line"}`} />
              ))}
            </div>
            <p className="text-[11px] text-muted mt-1.5">{c}</p>
          </motion.div>
        )).reduce<ReactNode[]>((acc, el, i) => {
          acc.push(el);
          if (i < 2) acc.push(<motion.span key={`s${i}`} animate={{ rotate: 360 }} transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }} className="text-brand text-lg">⟳</motion.span>);
          return acc;
        }, [])}
      </div>
      <motion.p {...reveal(0.9)} className="text-xs text-muted mt-5 text-center">Book a date anywhere and it blocks out everywhere. No clashes.</motion.p>
    </CardFrame>
  );
}

/* ---- Visual 6: SEO / indexing growth chart ---- */
function ChartVisual() {
  // 6 months, points pre-mapped to a 320x170 viewBox.
  const xs = [24, 79, 134, 189, 244, 300];
  const viewsY = [134, 118, 98, 74, 50, 28];
  const bookY = [150, 145, 136, 122, 105, 84];
  const line = (ys: number[]) => xs.map((x, i) => `${i ? "L" : "M"}${x},${ys[i]}`).join(" ");
  const area = `${line(viewsY)} L300,158 L24,158 Z`;
  return (
    <CardFrame>
      <div className="flex justify-between mb-3">
        <div>
          <p className="text-xs text-muted">Monthly views</p>
          <p className="font-display font-bold text-2xl text-brand"><CountUp to={1240} /></p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">Direct bookings</p>
          <p className="font-display font-bold text-2xl"><CountUp to={28} /></p>
        </div>
      </div>
      <svg viewBox="0 0 320 170" className="w-full">
        {[44, 86, 128].map((y) => <line key={y} x1="24" x2="300" y1={y} y2={y} stroke="currentColor" className="text-line" strokeWidth="1" />)}
        <motion.path d={area} className="fill-brand/10" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.7 }} />
        <motion.path d={line(viewsY)} fill="none" className="stroke-brand" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: EASE }} />
        <motion.path d={line(bookY)} fill="none" className="stroke-ink/40" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: EASE, delay: 0.4 }} />
        <motion.circle cx="300" cy="28" r="4" className="fill-brand" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 1.5 }} />
      </svg>
      <div className="flex items-center justify-between text-[11px] text-muted mt-1">
        <span>Launch</span><span>6 months later</span>
      </div>
      <div className="flex gap-4 mt-3 text-xs">
        <span className="flex items-center gap-1.5"><span className="w-3 h-[3px] rounded bg-brand" /> Views</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-[3px] rounded bg-ink/40" /> Bookings</span>
      </div>
    </CardFrame>
  );
}

/* ---- Visual 7: AI discovery ---- */
function AIVisual() {
  return (
    <CardFrame>
      <p className="text-[11px] uppercase tracking-wider text-muted mb-3">A traveller asks an AI assistant</p>
      <div className="space-y-2.5">
        <motion.div {...reveal(0.1)} className="max-w-[80%] rounded-2xl rounded-bl-sm bg-mist px-3.5 py-2 text-sm">Where should I stay in Porto, near the river?</motion.div>
        <motion.div {...reveal(0.7)} className="ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-brand-gradient text-white px-3.5 py-2 text-sm">
          Try <b>Casa do Rio</b> — a lovely riverside guesthouse. You can book it direct here →
        </motion.div>
      </div>
      <motion.div {...reveal(1.2)} className="mt-4 inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 rounded-full px-3 py-1.5">
        <span>✓</span> Your stay, recommended automatically
      </motion.div>
    </CardFrame>
  );
}

interface Feat {
  eyebrow: string;
  title: string;
  body: string;
  plain?: string; // plain-English explanation of a technical term
  visual: ReactNode;
}

const FEATURES: Feat[] = [
  {
    eyebrow: "Already have a website?",
    title: "We fill it with direct bookings",
    body: "Keep your site. We put you in front of travellers searching your area and send them straight to your own booking page.",
    visual: <FlowVisual />,
  },
  {
    eyebrow: "No website? Or don't love yours?",
    title: "We build and host one for you",
    body: "Pick a template, we fill in your details and put it live on your own domain. No tech skills, nothing to manage.",
    visual: <BuildVisual />,
  },
  {
    eyebrow: "Keep what you earn",
    title: "No commission, ever",
    body: "Guests pay by card into your own Stripe. We never take a cut, so you keep the full price of every booking.",
    visual: <KeepVisual />,
  },
  {
    eyebrow: "Secure by default",
    title: "The padlock, handled for you",
    body: "Every site we build is secured so guests trust it at checkout.",
    plain: "In plain English: that little padlock in the address bar (HTTPS) tells guests the site is safe to pay on. We set it up and keep it working.",
    visual: <SecureVisual />,
  },
  {
    eyebrow: "Never double-booked",
    title: "Your calendar stays in sync",
    body: "Connect Airbnb and Booking.com and your dates update everywhere automatically.",
    visual: <CalendarVisual />,
  },
  {
    eyebrow: "Get found, get more bookings",
    title: "We get you ranking on Google",
    body: "We submit your site so it shows up when people search — and keeps climbing month after month.",
    plain: "In plain English: SEO and \"indexing\" just mean showing up on Google and Bing when someone searches. The higher you appear, the more people find you and book.",
    visual: <ChartVisual />,
  },
  {
    eyebrow: "The future of finding stays",
    title: "Recommended by AI assistants",
    body: "More travellers now ask AI where to stay. We make sure it can find and suggest you.",
    plain: "In plain English: we add a small file (called llms.txt) that lets ChatGPT, Gemini and others read your site, so they can recommend your place in their answers.",
    visual: <AIVisual />,
  },
];

export function ExplainerFeatures() {
  return (
    <div className="space-y-16 sm:space-y-24">
      {FEATURES.map((f, i) => (
        <div key={f.title} className={`grid lg:grid-cols-2 gap-8 lg:gap-14 items-center ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
          <motion.div {...reveal(0)}>
            <p className="text-brand font-semibold text-sm">{f.eyebrow}</p>
            <h3 className="mt-2 text-2xl sm:text-3xl font-display font-bold">{f.title}</h3>
            <p className="mt-3 text-muted text-lg">{f.body}</p>
            {f.plain && (
              <p className="mt-4 text-sm bg-mist border border-line rounded-xl px-4 py-3 text-ink/75">{f.plain}</p>
            )}
          </motion.div>
          <motion.div {...reveal(0.1)}>{f.visual}</motion.div>
        </div>
      ))}
    </div>
  );
}
