"use client";

import { useState } from "react";
import type { CalBlock } from "@/lib/calendar";

const today = () => new Date().toISOString().slice(0, 10);
const SOURCE_LABEL: Record<string, string> = { airbnb: "Airbnb", booking: "Booking.com", vrbo: "Vrbo", external: "External", manual: "Blocked by you", fys: "Booked here" };

export function CalendarManager({
  listingId,
  exportUrl,
  initialUrls,
  initialBlocks,
}: {
  listingId: string;
  exportUrl: string;
  initialUrls: string[];
  initialBlocks: CalBlock[];
}) {
  const [urls, setUrls] = useState(initialUrls.join("\n"));
  const [blocks, setBlocks] = useState(initialBlocks);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);

  async function call(body: object) {
    const res = await fetch("/api/host/calendar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ listingId, ...body }) });
    return res.json();
  }

  async function saveUrls() {
    setMsg("Syncing…");
    const r = await call({ action: "set-urls", urls: urls.split(/\s+/).filter(Boolean) });
    setMsg(r.ok ? `Synced ${r.synced} dates from your other calendars.` : r.error);
    if (r.ok) location.reload();
  }

  async function addBlock() {
    if (!start || !end || end <= start) { setMsg("Pick a valid date range."); return; }
    const r = await call({ action: "add-block", start, end });
    if (r.ok) { setBlocks([...blocks, { id: crypto.randomUUID(), start, end, source: "manual" }]); setStart(""); setEnd(""); setMsg("Dates blocked."); }
    else setMsg(r.error);
  }

  async function remove(id: string) {
    await call({ action: "remove-block", blockId: id });
    setBlocks(blocks.filter((b) => b.id !== id));
  }

  return (
    <div className="space-y-8">
      {/* Sync */}
      <section className="border border-line rounded-2xl p-5">
        <h2 className="font-semibold text-lg">Sync with Airbnb &amp; Booking.com</h2>
        <p className="text-sm text-muted mt-1">Paste your calendar export (iCal) links from those platforms, one per line. We import their booked dates so you never get a double booking.</p>
        <textarea value={urls} onChange={(e) => setUrls(e.target.value)} rows={3} placeholder="https://www.airbnb.com/calendar/ical/....ics" className="w-full mt-3 border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-ink" />
        <button onClick={saveUrls} className="mt-3 bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-5 py-2.5 rounded-full shadow-glow">Save &amp; sync</button>
      </section>

      {/* Export */}
      <section className="border border-line rounded-2xl p-5">
        <h2 className="font-semibold text-lg">Your FindYourStay calendar link</h2>
        <p className="text-sm text-muted mt-1">Paste this into Airbnb/Booking.com so dates booked here block there too.</p>
        <div className="flex gap-2 mt-3">
          <input readOnly value={exportUrl} className="flex-1 border border-line rounded-xl px-4 py-2.5 text-sm bg-mist" />
          <button onClick={() => { navigator.clipboard?.writeText(exportUrl); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="border border-ink font-semibold px-4 py-2.5 rounded-xl hover:bg-mist whitespace-nowrap">{copied ? "Copied" : "Copy"}</button>
        </div>
      </section>

      {/* Manual blocks */}
      <section className="border border-line rounded-2xl p-5">
        <h2 className="font-semibold text-lg">Block dates manually</h2>
        <div className="flex flex-wrap items-end gap-3 mt-3">
          <label className="text-sm"><span className="block font-medium mb-1">From</span><input type="date" min={today()} value={start} onChange={(e) => setStart(e.target.value)} className="border border-line rounded-xl px-3 py-2" /></label>
          <label className="text-sm"><span className="block font-medium mb-1">To</span><input type="date" min={start || today()} value={end} onChange={(e) => setEnd(e.target.value)} className="border border-line rounded-xl px-3 py-2" /></label>
          <button onClick={addBlock} className="bg-ink text-white font-semibold px-5 py-2.5 rounded-full">Block</button>
        </div>

        <div className="mt-5 space-y-2">
          {blocks.length === 0 ? (
            <p className="text-sm text-muted">No blocked dates yet. Your calendar is fully open.</p>
          ) : (
            blocks.map((b) => (
              <div key={b.id} className="flex items-center justify-between border border-line rounded-xl px-4 py-2.5 text-sm">
                <span>{b.start} → {b.end} <span className="text-muted">· {SOURCE_LABEL[b.source] ?? b.source}</span></span>
                {b.source === "manual" ? (
                  <button onClick={() => remove(b.id)} className="text-brand font-semibold">Remove</button>
                ) : (
                  <span className="text-xs text-muted">synced</span>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {msg && <p className="text-sm text-muted">{msg}</p>}
    </div>
  );
}
