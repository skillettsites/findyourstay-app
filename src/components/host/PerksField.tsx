"use client";

import { useState } from "react";
import { PERK_OPTIONS } from "@/lib/types";

// Host picks book-direct benefits (preset chips) and/or adds their own.
export function PerksField({ perks, onChange }: { perks: string[]; onChange: (v: string[]) => void }) {
  const [custom, setCustom] = useState("");

  function toggle(p: string) {
    onChange(perks.includes(p) ? perks.filter((x) => x !== p) : [...perks, p]);
  }
  function addCustom() {
    const v = custom.trim();
    if (v && !perks.includes(v)) onChange([...perks, v]);
    setCustom("");
  }

  return (
    <div>
      <p className="text-sm font-semibold">Book-direct benefits</p>
      <p className="text-xs text-muted mt-1 mb-3">Give guests a reason to book direct with you. Pick any that apply, or add your own.</p>

      <div className="flex flex-wrap gap-2">
        {PERK_OPTIONS.map((p) => (
          <button key={p} type="button" onClick={() => toggle(p)} className={`px-3 py-1.5 rounded-full text-sm border transition ${perks.includes(p) ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-line hover:border-ink"}`}>
            {perks.includes(p) ? "✓ " : ""}{p}
          </button>
        ))}
      </div>

      {perks.some((p) => !(PERK_OPTIONS as readonly string[]).includes(p)) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {perks.filter((p) => !(PERK_OPTIONS as readonly string[]).includes(p)).map((p) => (
            <span key={p} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-emerald-600 bg-emerald-50 text-emerald-800">
              {p}
              <button type="button" onClick={() => toggle(p)} aria-label="Remove" className="text-emerald-700/70 hover:text-emerald-900">×</button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2 mt-3">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
          placeholder="Add your own, e.g. Free homemade cake on arrival"
          className="flex-1 border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-ink bg-white"
        />
        <button type="button" onClick={addCustom} className="border border-ink font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-mist">Add</button>
      </div>
    </div>
  );
}
