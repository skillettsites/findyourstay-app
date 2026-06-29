"use client";

import { useState } from "react";
import Link from "next/link";

type Stay = { slug: string; name: string; city: string; country: string; price: number | null; currency: string; photo: string | null; type: string };
type Msg = { role: "user" | "assistant"; text: string; stays?: Stay[]; limited?: boolean; signedIn?: boolean };

const SUGGESTIONS = ["Family-friendly B&B in Porto", "Beach house in the Algarve under £150", "A quiet cabin in the mountains", "Stylish apartment in Lisbon"];

export function ConciergeChat() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(text: string) {
    const q = text.trim();
    if (!q || busy) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: q }]);
    setBusy(true);
    try {
      const res = await fetch("/api/concierge", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: q }) });
      const d = await res.json();
      if (d.limited) setMsgs((m) => [...m, { role: "assistant", text: "", limited: true, signedIn: d.signedIn }]);
      else setMsgs((m) => [...m, { role: "assistant", text: d.reply, stays: d.listings }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", text: "Sorry, something went wrong. Please try again in a moment." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border border-line rounded-3xl bg-white shadow-card overflow-hidden flex flex-col max-h-[72vh]">
      <div className="px-5 py-4 border-b border-line flex items-center gap-2.5">
        <span className="grid place-items-center w-9 h-9 rounded-full bg-brand-gradient text-white shadow-glow">✦</span>
        <div>
          <p className="font-semibold text-sm">Trip assistant</p>
          <p className="text-xs text-muted">Tell me what you&apos;re after, I&apos;ll suggest places to book direct.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-[240px]">
        {msgs.length === 0 && (
          <div>
            <p className="text-sm text-muted mb-3">For example:</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="text-sm border border-line rounded-full px-3 py-1.5 hover:border-ink hover:bg-mist transition">{s}</button>
              ))}
            </div>
          </div>
        )}

        {msgs.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : ""}>
            {m.role === "user" ? (
              <span className="inline-block bg-ink text-white rounded-2xl rounded-br-sm px-4 py-2 text-sm max-w-[85%] text-left">{m.text}</span>
            ) : m.limited ? (
              <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 text-sm">
                {m.signedIn ? (
                  <p>You&apos;ve used your 20 free questions this month. They reset next month, or just <Link href="/s" className="text-brand font-semibold underline">browse all stays</Link>.</p>
                ) : (
                  <p>You&apos;ve had your free questions. <Link href="/login?next=/guests" className="text-brand font-semibold underline">Sign in free</Link> (we email you a code) to ask up to 20 a month.</p>
                )}
              </div>
            ) : (
              <div className="max-w-[92%]">
                <div className="bg-mist rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm whitespace-pre-wrap">{m.text}</div>
                {m.stays && m.stays.length > 0 && (
                  <div className="mt-3 grid sm:grid-cols-2 gap-2.5">
                    {m.stays.map((s) => (
                      <Link key={s.slug} href={`/rooms/${s.slug}`} className="group flex gap-3 border border-line rounded-xl p-2 hover:shadow-card transition">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {s.photo ? <img src={s.photo} alt="" className="w-16 h-16 rounded-lg object-cover" /> : <div className="w-16 h-16 rounded-lg bg-mist" />}
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{s.name}</p>
                          <p className="text-xs text-muted truncate">{s.city}{s.country ? `, ${s.country}` : ""}</p>
                          {s.price ? <p className="text-xs font-semibold mt-0.5">£{s.price}/night</p> : null}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {busy && <p className="text-sm text-muted">Thinking…</p>}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="p-3 border-t border-line flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. a cosy B&B in Porto near the river" className="flex-1 border border-line rounded-full px-4 py-2.5 text-sm outline-none focus:border-ink" />
        <button disabled={busy} className="bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-5 py-2.5 rounded-full shadow-glow disabled:opacity-50">Ask</button>
      </form>
    </div>
  );
}
