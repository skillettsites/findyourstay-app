"use client";

import type { Testimonial } from "@/lib/types";

const SOURCES = ["Airbnb", "Booking.com", "Vrbo", "Google", "Direct guest", "Other"];
const input = "w-full border border-line rounded-xl px-3 py-2 text-sm outline-none focus:border-ink bg-white";

// Host-curated guest quotes (e.g. copied from their Airbnb/Booking reviews).
// We do not run an on-platform review system — this is social proof the host owns.
export function TestimonialsField({ testimonials, onChange }: { testimonials: Testimonial[]; onChange: (v: Testimonial[]) => void }) {
  const set = (i: number, patch: Partial<Testimonial>) => onChange(testimonials.map((t, j) => (j === i ? { ...t, ...patch } : t)));
  const remove = (i: number) => onChange(testimonials.filter((_, j) => j !== i));
  const add = () => onChange([...testimonials, { quote: "", author: "", source: "Airbnb" }]);

  return (
    <div>
      <p className="text-sm font-semibold">What guests say</p>
      <p className="text-xs text-muted mt-1 mb-3">
        Add a few quotes from past guests, for example copied from your Airbnb or Booking.com reviews. These show on your booking website. (You enter these yourself, guests do not leave reviews here.)
      </p>

      <div className="space-y-3">
        {testimonials.map((t, i) => (
          <div key={i} className="rounded-xl border border-line p-3 bg-white">
            <textarea
              value={t.quote}
              onChange={(e) => set(i, { quote: e.target.value })}
              rows={2}
              placeholder="e.g. One of the loveliest places we have stayed. Booking direct was so easy."
              className={input}
            />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input value={t.author ?? ""} onChange={(e) => set(i, { author: e.target.value })} placeholder="Who said it, e.g. Sarah, June 2026" className={input} />
              <div className="flex gap-2">
                <select value={t.source ?? "Airbnb"} onChange={(e) => set(i, { source: e.target.value })} className={input}>
                  {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button type="button" onClick={() => remove(i)} aria-label="Remove" className="shrink-0 w-9 grid place-items-center rounded-xl border border-line text-muted hover:bg-mist">×</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={add} className="mt-3 border border-ink font-semibold text-sm px-4 py-2 rounded-full hover:bg-mist">
        + Add a guest quote
      </button>
    </div>
  );
}
