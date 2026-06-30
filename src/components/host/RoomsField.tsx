"use client";

import { useState } from "react";
import type { Bedroom } from "@/lib/types";

const inputCls = "w-full border border-line rounded-xl px-3 py-2 text-sm outline-none focus:border-ink bg-white";

function Stepper({ label, value, onChange, min = 0, max = 20 }: { label: string; value: number; onChange: (n: number) => void; min?: number; max?: number }) {
  return (
    <div>
      <span className="block text-sm font-semibold mb-1.5">{label}</span>
      <div className="inline-flex items-center border border-line rounded-xl overflow-hidden">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} className="w-10 h-10 grid place-items-center text-lg hover:bg-mist disabled:opacity-30" disabled={value <= min}>−</button>
        <span className="w-12 text-center font-semibold tabular-nums">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} className="w-10 h-10 grid place-items-center text-lg hover:bg-mist disabled:opacity-30" disabled={value >= max}>+</button>
      </div>
    </div>
  );
}

// Per-bedroom photo sets (1-5 each, required) plus a bathroom count.
export function RoomsField({ bedrooms, bathrooms, onBedrooms, onBathrooms }: { bedrooms: Bedroom[]; bathrooms: number; onBedrooms: (v: Bedroom[]) => void; onBathrooms: (n: number) => void }) {
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  const setCount = (n: number) => {
    const next = bedrooms.slice(0, n);
    while (next.length < n) next.push({ photos: [] });
    onBedrooms(next);
  };
  const setBed = (i: number, patch: Partial<Bedroom>) => onBedrooms(bedrooms.map((b, j) => (j === i ? { ...b, ...patch } : b)));
  const removePhoto = (i: number, j: number) => setBed(i, { photos: bedrooms[i].photos.filter((_, x) => x !== j) });

  async function uploadTo(i: number, files: FileList | null) {
    if (!files?.length) return;
    setUploadingIdx(i);
    const room = 5 - bedrooms[i].photos.length;
    const urls: string[] = [];
    try {
      for (const file of Array.from(files).slice(0, room)) {
        const fd = new FormData(); fd.append("file", file);
        const res = await fetch("/api/host/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        urls.push(data.url);
      }
      onBedrooms(bedrooms.map((b, j) => (j === i ? { ...b, photos: [...b.photos, ...urls] } : b)));
    } catch { /* surfaced by the page's error area on save */ }
    finally { setUploadingIdx(null); }
  }

  return (
    <div>
      <p className="text-sm font-semibold">Bedrooms &amp; bathrooms</p>
      <p className="text-xs text-muted mt-1 mb-3">Set how many rooms you have, and add up to 5 photos of each bedroom (at least one per bedroom).</p>

      <div className="flex gap-6 mb-4">
        <Stepper label="Bedrooms" value={bedrooms.length} onChange={setCount} min={0} max={20} />
        <Stepper label="Bathrooms" value={bathrooms} onChange={onBathrooms} min={0} max={20} />
      </div>

      <div className="space-y-3">
        {bedrooms.map((b, i) => (
          <div key={i} className="rounded-xl border border-line p-3 bg-white">
            <input value={b.name ?? ""} onChange={(e) => setBed(i, { name: e.target.value })} placeholder={`Bedroom ${i + 1} — name (optional, e.g. Master bedroom)`} className={inputCls} />
            <div className="flex flex-wrap gap-2 mt-2">
              {b.photos.map((u, j) => (
                <div key={u + j} className="relative w-20 h-20 rounded-lg overflow-hidden border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removePhoto(i, j)} className="absolute top-0.5 right-0.5 w-5 h-5 grid place-items-center rounded-full bg-black/60 text-white text-xs">×</button>
                </div>
              ))}
              {b.photos.length < 5 && (
                <label className={`w-20 h-20 rounded-lg border-2 border-dashed border-line grid place-items-center cursor-pointer hover:border-ink transition ${uploadingIdx === i ? "opacity-50 pointer-events-none" : ""}`}>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => uploadTo(i, e.target.files)} />
                  <span className="text-center text-[11px] text-muted">{uploadingIdx === i ? "Uploading…" : "+ Photo"}</span>
                </label>
              )}
            </div>
            {b.photos.length === 0 && <p className="text-xs text-brand mt-1.5">Add at least one photo of this bedroom <span className="text-brand">*</span></p>}
          </div>
        ))}
      </div>
    </div>
  );
}
