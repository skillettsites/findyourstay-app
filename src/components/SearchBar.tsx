"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MonthCalendar, formatNice } from "./MonthCalendar";

interface Suggestion {
  citySlug: string;
  cityName: string;
  country: string;
  count: number;
}

type Panel = "where" | "dates" | "who" | null;
type DateTab = "dates" | "months" | "flexible";
type FlexLen = "weekend" | "week" | "month";

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function nextMonths(n: number) {
  const out: { key: string; label: string; year: number }[] = [];
  const d = new Date();
  d.setDate(1);
  for (let i = 0; i < n; i++) {
    const m = new Date(d.getFullYear(), d.getMonth() + i, 1);
    out.push({ key: `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, "0")}`, label: MON[m.getMonth()], year: m.getFullYear() });
  }
  return out;
}

export function SearchBar({ compact = false, initialQ = "" }: { compact?: boolean; initialQ?: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initialQ);
  const [citySlug, setCitySlug] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [active, setActive] = useState(-1);

  const [panel, setPanel] = useState<Panel>(null);
  const [dateTab, setDateTab] = useState<DateTab>("dates");
  const [checkIn, setCheckIn] = useState<string>();
  const [checkOut, setCheckOut] = useState<string>();
  const [flexLen, setFlexLen] = useState<FlexLen>("week");
  const [flexMonths, setFlexMonths] = useState<string[]>([]);
  const [durMonths, setDurMonths] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  const wrapRef = useRef<HTMLDivElement>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const guests = adults + children;
  const months = nextMonths(10);

  useEffect(() => {
    if (panel !== "where") return;
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/autocomplete?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setSuggestions(data.suggestions ?? []);
        setActive(-1);
      } catch {
        setSuggestions([]);
      }
    }, 160);
    return () => debounce.current ? clearTimeout(debounce.current) : undefined;
  }, [q, panel]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setPanel(null);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function pickCity(s: Suggestion, navigate = false) {
    setQ(s.cityName);
    setCitySlug(s.citySlug);
    if (navigate) {
      setPanel(null);
      router.push(`/s?city=${s.citySlug}`);
    } else {
      setPanel("dates"); // move to dates next, like Airbnb
    }
  }

  function buildAndGo() {
    const p = new URLSearchParams();
    if (citySlug) p.set("city", citySlug);
    else if (q.trim()) p.set("q", q.trim());
    if (dateTab === "dates" && checkIn) {
      p.set("in", checkIn);
      if (checkOut) p.set("out", checkOut);
    } else if (dateTab === "flexible") {
      p.set("flex", flexLen);
      if (flexMonths.length) p.set("months", flexMonths.join(","));
    } else if (dateTab === "months") {
      p.set("stay", `${durMonths}m`);
    }
    if (guests) p.set("guests", String(guests));
    setPanel(null);
    router.push(`/s?${p.toString()}`);
  }

  // ---------- COMPACT (header) ----------
  if (compact) {
    return (
      <div ref={wrapRef} className="relative">
        <form
          onSubmit={(e) => { e.preventDefault(); buildAndGo(); }}
          className="flex items-center gap-2 rounded-full border border-line shadow-card hover:shadow-float transition px-2 py-1.5 bg-white"
        >
          <input
            value={q}
            onChange={(e) => { setQ(e.target.value); setCitySlug(null); }}
            onFocus={() => setPanel("where")}
            placeholder="Search destinations"
            className="px-3 py-1 text-sm outline-none w-40 sm:w-56 bg-transparent"
          />
          <button className="grid place-items-center w-8 h-8 rounded-full bg-brand-gradient text-white" aria-label="Search"><SearchIcon /></button>
        </form>
        {panel === "where" && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50">
            <WherePanel q={q} suggestions={suggestions} active={active} onHover={setActive} onPick={(s) => pickCity(s, true)} />
          </div>
        )}
      </div>
    );
  }

  // ---------- LARGE (hero) ----------
  const dateSummary = () => {
    if (dateTab === "dates") return { ci: formatNice(checkIn) ?? "Add dates", co: formatNice(checkOut) ?? "Add dates" };
    if (dateTab === "flexible") {
      const len = flexLen === "weekend" ? "A weekend" : flexLen === "week" ? "A week" : "A month";
      const mo = flexMonths.length ? " in " + flexMonths.map((k) => MON[Number(k.split("-")[1]) - 1]).join(", ") : "";
      return { ci: len + mo, co: "" };
    }
    return { ci: `${durMonths} month${durMonths > 1 ? "s" : ""}`, co: "" };
  };
  const ds = dateSummary();

  return (
    <div ref={wrapRef} className="relative">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-3xl sm:rounded-full w-full">
        {/* Where */}
        <button type="button" onClick={() => setPanel("where")} className={`flex-1 text-left px-7 py-3 rounded-full transition ${panel === "where" ? "bg-white shadow-card" : "hover:bg-mist"}`}>
          <span className="block text-xs font-bold text-ink">Where</span>
          <input
            data-testid="hero-where"
            value={q}
            onChange={(e) => { setQ(e.target.value); setCitySlug(null); }}
            onFocus={() => setPanel("where")}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); buildAndGo(); } }}
            placeholder="Search destinations"
            autoComplete="off"
            className="w-full text-sm text-ink placeholder:text-muted outline-none bg-transparent"
          />
        </button>
        <Divider />
        {/* Check in */}
        <button type="button" onClick={() => { setPanel("dates"); setDateTab((t) => (t === "dates" ? t : "dates")); }} className={`text-left px-6 py-3 rounded-full transition ${panel === "dates" ? "bg-white shadow-card" : "hover:bg-mist"}`}>
          <span className="block text-xs font-bold text-ink">{dateTab === "dates" ? "Check in" : "When"}</span>
          <span className={`block text-sm ${checkIn || flexMonths.length || dateTab !== "dates" ? "text-ink" : "text-muted"}`}>{ds.ci}</span>
        </button>
        {dateTab === "dates" && (
          <>
            <Divider />
            <button type="button" onClick={() => setPanel("dates")} className={`text-left px-6 py-3 rounded-full transition ${panel === "dates" ? "bg-white shadow-card" : "hover:bg-mist"}`}>
              <span className="block text-xs font-bold text-ink">Check out</span>
              <span className={`block text-sm ${checkOut ? "text-ink" : "text-muted"}`}>{ds.co}</span>
            </button>
          </>
        )}
        <Divider />
        {/* Who */}
        <button type="button" onClick={() => setPanel("who")} className={`text-left px-6 py-3 rounded-full transition ${panel === "who" ? "bg-white shadow-card" : "hover:bg-mist"}`}>
          <span className="block text-xs font-bold text-ink">Who</span>
          <span className={`block text-sm ${guests ? "text-ink" : "text-muted"}`}>{guests ? `${guests} guest${guests > 1 ? "s" : ""}` : "Add guests"}</span>
        </button>
        <div className="p-1.5">
          <button data-testid="hero-search" onClick={buildAndGo} className="flex items-center gap-2 bg-brand-gradient bg-brand-gradient-hover text-white font-semibold rounded-full px-6 py-3.5 w-full sm:w-auto justify-center transition-transform active:scale-95 shadow-glow">
            <SearchIcon /><span className="sm:hidden">Search</span>
          </button>
        </div>
      </div>

      {/* Panels */}
      {panel === "where" && (
        <div className="absolute left-0 sm:left-2 top-full mt-3 z-50 w-full sm:w-[420px]">
          <WherePanel q={q} suggestions={suggestions} active={active} onHover={setActive} onPick={(s) => pickCity(s)} />
        </div>
      )}
      {panel === "dates" && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-3 z-50 w-[min(92vw,760px)] bg-white rounded-3xl shadow-float ring-1 ring-black/5 p-5 sm:p-6">
          <Tabs tab={dateTab} setTab={setDateTab} />
          {dateTab === "dates" && (
            <div className="mt-4">
              <MonthCalendar checkIn={checkIn} checkOut={checkOut} onChange={(ci, co) => { setCheckIn(ci); setCheckOut(co); }} months={2} />
            </div>
          )}
          {dateTab === "months" && (
            <div className="mt-5 text-center">
              <p className="text-sm text-muted mb-4">When&apos;s your trip? Stay for</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[1, 2, 3, 6, 12].map((n) => (
                  <Pill key={n} active={durMonths === n} onClick={() => setDurMonths(n)}>{n} month{n > 1 ? "s" : ""}</Pill>
                ))}
              </div>
            </div>
          )}
          {dateTab === "flexible" && (
            <div className="mt-5">
              <p className="text-sm font-semibold mb-3">How long would you like to stay?</p>
              <div className="flex gap-2 mb-6">
                {(["weekend", "week", "month"] as FlexLen[]).map((l) => (
                  <Pill key={l} active={flexLen === l} onClick={() => setFlexLen(l)}>
                    {l === "weekend" ? "A weekend" : l === "week" ? "A week" : "A month"}
                  </Pill>
                ))}
              </div>
              <p className="text-sm font-semibold mb-3">When do you want to go?</p>
              <div className="flex flex-wrap gap-2.5">
                {months.map((m) => {
                  const on = flexMonths.includes(m.key);
                  return (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setFlexMonths((cur) => (on ? cur.filter((k) => k !== m.key) : [...cur, m.key]))}
                      className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl border transition ${on ? "border-ink bg-mist" : "border-line hover:border-ink"}`}
                    >
                      <CalIcon />
                      <span className="text-sm font-medium mt-1">{m.label}</span>
                      <span className="text-[11px] text-muted">{m.year}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div className="flex justify-end mt-5 pt-4 border-t border-line">
            <button onClick={buildAndGo} className="bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-6 py-2.5 rounded-full shadow-glow">Search</button>
          </div>
        </div>
      )}
      {panel === "who" && (
        <div className="absolute right-0 sm:right-2 top-full mt-3 z-50 w-[min(92vw,380px)] bg-white rounded-3xl shadow-float ring-1 ring-black/5 p-5">
          <Stepper label="Adults" sub="Ages 13+" value={adults} setValue={setAdults} min={1} />
          <div className="h-px bg-line my-1" />
          <Stepper label="Children" sub="Ages 2-12" value={children} setValue={setChildren} min={0} />
          <div className="flex justify-end mt-4">
            <button onClick={buildAndGo} className="bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-6 py-2.5 rounded-full shadow-glow">Search</button>
          </div>
        </div>
      )}
    </div>
  );
}

function WherePanel({ q, suggestions, active, onHover, onPick }: { q: string; suggestions: Suggestion[]; active: number; onHover: (i: number) => void; onPick: (s: Suggestion) => void }) {
  return (
    <div className="bg-white rounded-2xl shadow-float ring-1 ring-black/5 overflow-hidden">
      {suggestions.length === 0 ? (
        <div className="px-5 py-4 text-sm text-muted">No matching destinations</div>
      ) : (
        <ul className="py-2 max-h-80 overflow-auto">
          {!q.trim() && <li className="px-5 pt-1 pb-2 text-[11px] font-bold uppercase tracking-wide text-muted">Popular destinations</li>}
          {suggestions.map((s, i) => (
            <li key={s.citySlug}>
              <button type="button" onMouseDown={(e) => { e.preventDefault(); onPick(s); }} onMouseEnter={() => onHover(i)} className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition ${active === i ? "bg-mist" : "hover:bg-mist"}`}>
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-mist text-brand shrink-0"><PinIcon /></span>
                <span className="min-w-0">
                  <span className="block font-semibold text-ink truncate">{s.cityName}</span>
                  <span className="block text-sm text-muted truncate">{s.country} · {s.count} stays</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Tabs({ tab, setTab }: { tab: DateTab; setTab: (t: DateTab) => void }) {
  return (
    <div className="flex justify-center">
      <div className="inline-flex bg-mist rounded-full p-1">
        {(["dates", "months", "flexible"] as DateTab[]).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`px-5 py-1.5 rounded-full text-sm font-semibold capitalize transition ${tab === t ? "bg-white shadow-card text-ink" : "text-muted hover:text-ink"}`}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={`px-4 py-2 rounded-full text-sm font-medium border transition ${active ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}>
      {children}
    </button>
  );
}

function Stepper({ label, sub, value, setValue, min }: { label: string; sub: string; value: number; setValue: (n: number) => void; min: number }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="font-semibold">{label}</div>
        <div className="text-sm text-muted">{sub}</div>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" disabled={value <= min} onClick={() => setValue(value - 1)} className="w-8 h-8 rounded-full border border-line grid place-items-center disabled:opacity-30 hover:border-ink">−</button>
        <span className="w-5 text-center">{value}</span>
        <button type="button" onClick={() => setValue(value + 1)} className="w-8 h-8 rounded-full border border-line grid place-items-center hover:border-ink">+</button>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="hidden sm:block w-px h-9 bg-line shrink-0" />;
}
function SearchIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" strokeLinecap="round" /></svg>;
}
function PinIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c3.5 0 6 2.6 6 6.2 0 4-3.4 8-5.3 10.9a.8.8 0 0 1-1.4 0C9.4 16.2 6 12.2 6 8.2 6 4.6 8.5 2 12 2Zm0 4.2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" /></svg>;
}
function CalIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-muted"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" strokeLinecap="round" /></svg>;
}
