"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AMENITIES_OPTIONS, type Listing } from "@/lib/types";

const TEMPLATES = [
  { key: "classic" as const, label: "Classic", blurb: "Elegant & timeless", swatch: "bg-gradient-to-br from-stone-700 to-stone-900" },
  { key: "modern" as const, label: "Modern", blurb: "Bold & editorial", swatch: "bg-gradient-to-br from-zinc-900 to-zinc-600" },
  { key: "coastal" as const, label: "Coastal", blurb: "Airy & relaxed", swatch: "bg-gradient-to-br from-emerald-700 to-emerald-900" },
];

const inputCls = "w-full border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-ink bg-white";

export function EditListing({ listing }: { listing: Listing }) {
  const router = useRouter();
  const [name, setName] = useState(listing.propertyName);
  const [description, setDescription] = useState(listing.description ?? "");
  const [price, setPrice] = useState(listing.pricePerNight != null ? String(listing.pricePerNight) : "");
  const [amenities, setAmenities] = useState<string[]>(listing.amenities);
  const [photos, setPhotos] = useState<string[]>(listing.photos);
  const [theme, setTheme] = useState<"classic" | "modern" | "coastal">(listing.siteTheme);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  function toggle(a: string) {
    setAmenities((c) => (c.includes(a) ? c.filter((x) => x !== a) : [...c, a]));
  }

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    setErr("");
    setUploading(true);
    try {
      for (const file of Array.from(files).slice(0, 12 - photos.length)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/host/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setPhotos((c) => [...c, data.url]);
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setBusy(true);
    setErr("");
    setMsg("");
    try {
      const res = await fetch("/api/host/listing/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: listing.id, propertyName: name, description, pricePerNight: price, amenities, photos, siteTheme: theme }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg("Saved. Your changes are live.");
      router.refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <label className="block mb-4">
        <span className="block text-sm font-semibold mb-1.5">Property name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
      </label>

      <label className="block mb-4">
        <span className="block text-sm font-semibold mb-1.5">Description</span>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={inputCls} />
      </label>

      <label className="block mb-4">
        <span className="block text-sm font-semibold mb-1.5">Price per night (£)</span>
        <input value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} className={inputCls} />
      </label>

      <div className="mb-4">
        <span className="block text-sm font-semibold mb-1.5">Amenities</span>
        <div className="flex flex-wrap gap-2">
          {AMENITIES_OPTIONS.map((a) => (
            <button key={a} type="button" onClick={() => toggle(a)} className={`px-3 py-1.5 rounded-full text-sm border transition ${amenities.includes(a) ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}>{a}</button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <span className="block text-sm font-semibold mb-1.5">Photos</span>
        <div className="flex flex-wrap gap-3">
          {photos.map((u, i) => (
            <div key={u + i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => setPhotos((c) => c.filter((_, j) => j !== i))} className="absolute top-1 right-1 w-5 h-5 grid place-items-center rounded-full bg-black/60 text-white text-xs">×</button>
            </div>
          ))}
          {photos.length < 12 && (
            <label className={`w-24 h-24 rounded-xl border-2 border-dashed border-line grid place-items-center cursor-pointer hover:border-ink transition ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onUpload(e.target.files)} />
              <span className="text-center text-xs text-muted">{uploading ? "Uploading…" : "+ Add photo"}</span>
            </label>
          )}
        </div>
      </div>

      {listing.hasBookingSite && (
        <div className="mb-5">
          <span className="block text-sm font-semibold mb-1.5">Website template</span>
          <div className="grid grid-cols-3 gap-2.5">
            {TEMPLATES.map((tpl) => (
              <button key={tpl.key} type="button" onClick={() => setTheme(tpl.key)} className={`text-left rounded-xl border-2 p-2.5 transition bg-white ${theme === tpl.key ? "border-brand" : "border-line hover:border-ink"}`}>
                <div className={`h-12 rounded-md ${tpl.swatch} mb-2`} />
                <div className="text-sm font-semibold">{tpl.label}</div>
                <div className="text-[11px] text-muted leading-tight">{tpl.blurb}</div>
              </button>
            ))}
          </div>
          <a href={`/sites/${listing.slug}?t=${theme}`} target="_blank" rel="noreferrer" className="inline-block mt-2 text-sm font-semibold text-brand">Preview ↗</a>
        </div>
      )}

      <div className="flex items-center gap-3 sticky bottom-0 bg-white py-3 border-t border-line">
        <button onClick={save} disabled={busy} className="bg-brand-gradient bg-brand-gradient-hover disabled:opacity-50 text-white font-semibold px-7 py-3 rounded-full shadow-glow">
          {busy ? "Saving…" : "Save changes"}
        </button>
        <Link href="/host/dashboard" className="font-semibold px-5 py-3 rounded-full hover:bg-mist">Back to dashboard</Link>
        {msg && <span className="text-sm text-emerald-700">{msg}</span>}
        {err && <span className="text-sm text-brand">{err}</span>}
      </div>
    </div>
  );
}
