"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const today = () => new Date().toISOString().slice(0, 10);

// The availability bar docked on the hero. Collects dates/guests and sends the
// guest to the Book page with them prefilled.
export function HeroSearch({ bookHref, btnClass }: { bookHref: string; btnClass: string }) {
  const router = useRouter();
  const [ci, setCi] = useState("");
  const [co, setCo] = useState("");
  const [g, setG] = useState("2");

  function go(e: React.FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (ci) p.set("in", ci);
    if (co) p.set("out", co);
    if (g) p.set("guests", g);
    const sep = bookHref.includes("?") ? "&" : "?";
    router.push(p.toString() ? `${bookHref}${sep}${p.toString()}` : bookHref);
  }

  return (
    <form onSubmit={go} className="bg-white/95 backdrop-blur shadow-2xl rounded-xl p-2.5 flex flex-col sm:flex-row items-stretch gap-2 max-w-3xl mx-auto">
      <label className="flex-1 px-4 py-2 text-left">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">Arrive</span>
        <input type="date" min={today()} value={ci} onChange={(e) => setCi(e.target.value)} className="w-full text-sm text-ink outline-none bg-transparent" />
      </label>
      <span className="hidden sm:block w-px bg-line my-2" />
      <label className="flex-1 px-4 py-2 text-left">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">Depart</span>
        <input type="date" min={ci || today()} value={co} onChange={(e) => setCo(e.target.value)} className="w-full text-sm text-ink outline-none bg-transparent" />
      </label>
      <span className="hidden sm:block w-px bg-line my-2" />
      <label className="px-4 py-2 text-left">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-muted">Guests</span>
        <input type="number" min={1} value={g} onChange={(e) => setG(e.target.value)} className="w-full sm:w-16 text-sm text-ink outline-none bg-transparent" />
      </label>
      <button className={`px-7 py-3 font-semibold text-sm ${btnClass}`}>Check availability</button>
    </form>
  );
}
