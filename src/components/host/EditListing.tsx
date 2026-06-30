"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AMENITIES_OPTIONS, type Listing } from "@/lib/types";
import { PaymentLinksFields } from "./PaymentLinksFields";
import { PerksField } from "./PerksField";

const TEMPLATES = [
  { key: "classic" as const, label: "Classic", blurb: "Elegant & timeless", swatch: "bg-gradient-to-br from-stone-700 to-stone-900" },
  { key: "modern" as const, label: "Modern", blurb: "Bold & editorial", swatch: "bg-gradient-to-br from-zinc-900 to-zinc-600" },
  { key: "coastal" as const, label: "Coastal", blurb: "Airy & relaxed", swatch: "bg-gradient-to-br from-emerald-700 to-emerald-900" },
];

const inputCls = "w-full border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-ink bg-white";
const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);

interface GeoResult { id: string; label: string; address: string; city: string; neighborhood: string; country: string; lat: number; lng: number }

export function EditListing({ listing }: { listing: Listing }) {
  const router = useRouter();
  const hasSite = listing.hasBookingSite;

  const [name, setName] = useState(listing.propertyName);
  const [description, setDescription] = useState(listing.description ?? "");
  const [price, setPrice] = useState(listing.pricePerNight != null ? String(listing.pricePerNight) : "");
  const [amenities, setAmenities] = useState<string[]>(listing.amenities);
  const [perks, setPerks] = useState<string[]>(listing.perks ?? []);
  const [photos, setPhotos] = useState<string[]>(listing.photos);
  const [heroImage, setHeroImage] = useState(listing.heroImage ?? "");
  const [theme, setTheme] = useState<"classic" | "modern" | "coastal">(listing.siteTheme);
  const [payStripe, setPayStripe] = useState(listing.payStripe ?? "");
  const [payPaypal, setPayPaypal] = useState(listing.payPaypal ?? "");

  // Address: prefilled with the current area; only changed if they re-pick one.
  const currentArea = [listing.neighborhood, listing.cityName, listing.country].filter(Boolean).join(", ");
  const [addrQuery, setAddrQuery] = useState(currentArea);
  const [addrSug, setAddrSug] = useState<GeoResult[]>([]);
  const [addrOpen, setAddrOpen] = useState(false);
  const [place, setPlace] = useState<GeoResult | null>(null);
  const addrRef = useRef<HTMLDivElement>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [uploading, setUploading] = useState(false);
  const [heroUploading, setHeroUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    if (!addrOpen) return;
    if (place && addrQuery === place.label) return;
    if (addrQuery.trim().length < 3) { setAddrSug([]); return; }
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      try { const res = await fetch(`/api/geo/autocomplete?q=${encodeURIComponent(addrQuery)}`); const data = await res.json(); setAddrSug(data.results ?? []); }
      catch { setAddrSug([]); }
    }, 220);
  }, [addrQuery, addrOpen, place]);

  useEffect(() => {
    function onDown(e: MouseEvent) { if (addrRef.current && !addrRef.current.contains(e.target as Node)) setAddrOpen(false); }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function toggle(a: string) { setAmenities((c) => (c.includes(a) ? c.filter((x) => x !== a) : [...c, a])); }

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    setErr(""); setUploading(true);
    try {
      for (const file of Array.from(files).slice(0, 12 - photos.length)) {
        const fd = new FormData(); fd.append("file", file);
        const res = await fetch("/api/host/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setPhotos((c) => [...c, data.url]);
      }
    } catch (e) { setErr(e instanceof Error ? e.message : "Upload failed."); }
    finally { setUploading(false); }
  }

  async function onUploadHero(files: FileList | null) {
    if (!files?.length) return;
    setErr(""); setHeroUploading(true);
    try {
      const fd = new FormData(); fd.append("file", files[0]);
      const res = await fetch("/api/host/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setHeroImage(data.url);
    } catch (e) { setErr(e instanceof Error ? e.message : "Upload failed."); }
    finally { setHeroUploading(false); }
  }

  async function save() {
    setErr(""); setMsg("");
    if (photos.length === 0) { setErr("Please add at least one room photo before saving."); return; }
    if (hasSite && !heroImage) { setErr("Please add a hero background image for your website."); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/host/listing/update", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: listing.id, propertyName: name, description, pricePerNight: price, amenities, perks, photos,
          siteTheme: theme, payStripe, payPaypal,
          heroImage: hasSite ? heroImage : undefined,
          ...(place ? { lat: place.lat, lng: place.lng, cityName: place.city, citySlug: slugify(place.city), neighborhood: place.neighborhood || "", country: place.country } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMsg(hasSite ? "Listing updated and website updated." : "Listing updated.");
      router.refresh();
    } catch (e) { setErr(e instanceof Error ? e.message : "Could not save."); }
    finally { setBusy(false); }
  }

  return (
    <div className="max-w-2xl">
      <label className="block mb-4">
        <span className="block text-sm font-semibold mb-1.5">Property name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
      </label>

      {/* Address */}
      <div className="block mb-4">
        <span className="block text-sm font-semibold mb-1.5">Address</span>
        <div ref={addrRef} className="relative">
          <input
            value={addrQuery}
            onChange={(e) => { setPlace(null); setAddrQuery(e.target.value); setAddrOpen(true); }}
            onFocus={() => setAddrOpen(true)}
            placeholder="Start typing a new address…"
            autoComplete="off"
            className={inputCls}
          />
          {addrOpen && !place && addrSug.length > 0 && (
            <ul className="absolute z-30 left-0 right-0 mt-1 bg-white border border-line rounded-xl shadow-float max-h-64 overflow-auto">
              {addrSug.map((s) => (
                <li key={s.id}>
                  <button type="button" onMouseDown={(e) => { e.preventDefault(); setPlace(s); setAddrQuery(s.label); setAddrOpen(false); }}
                    className="w-full flex items-start gap-2.5 text-left px-4 py-2.5 hover:bg-mist">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-brand mt-0.5 shrink-0"><path d="M12 2c3.5 0 6 2.6 6 6.2 0 4-3.4 8-5.3 10.9a.8.8 0 0 1-1.4 0C9.4 16.2 6 12.2 6 8.2 6 4.6 8.5 2 12 2Zm0 4.2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" /></svg>
                    <span className="text-sm">{s.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {place ? (
          <p className="text-xs text-emerald-700 mt-1.5">New location: <b className="font-semibold">{place.neighborhood ? `${place.neighborhood}, ` : ""}{place.city}, {place.country}</b></p>
        ) : (
          <p className="text-xs text-muted mt-1.5">Currently in {currentArea || "—"}. Type and pick a new address to move it. Guests only ever see an approximate spot.</p>
        )}
      </div>

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

      <div className="mb-5">
        <PerksField perks={perks} onChange={setPerks} />
      </div>

      {/* Room photos (mandatory) */}
      <div className="mb-5">
        <span className="block text-sm font-semibold mb-1.5">Room photos <span className="text-brand">*</span></span>
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
        {photos.length === 0 && <p className="text-xs text-brand mt-1.5">At least one room photo is required.</p>}
      </div>

      {/* Hero background image — gated by the booking-website add-on */}
      <div className="mb-5">
        <span className="block text-sm font-semibold mb-1.5">
          Website hero image{hasSite && <span className="text-brand"> *</span>}
        </span>
        {hasSite ? (
          heroImage ? (
            <div className="relative rounded-xl overflow-hidden border border-line aspect-[16/7] max-w-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroImage} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => setHeroImage("")} className="absolute top-2 right-2 w-7 h-7 grid place-items-center rounded-full bg-black/60 text-white text-sm">×</button>
            </div>
          ) : (
            <label className={`aspect-[16/7] max-w-lg rounded-xl border-2 border-dashed border-line grid place-items-center cursor-pointer hover:border-brand transition ${heroUploading ? "opacity-50 pointer-events-none" : ""}`}>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onUploadHero(e.target.files)} />
              <span className="text-center text-sm text-muted">{heroUploading ? "Uploading…" : "+ Upload hero image"}</span>
            </label>
          )
        ) : (
          <>
            <button type="button" onClick={() => setShowUpgrade((s) => !s)}
              className="aspect-[16/7] max-w-lg w-full rounded-xl border-2 border-dashed border-line grid place-items-center bg-mist cursor-pointer opacity-70">
              <span className="text-center text-sm text-muted">🔒 Hero image (website add-on)</span>
            </button>
            {showUpgrade && (
              <p className="text-xs text-muted mt-1.5">
                Upgrade to create your own direct booking website and add a hero image.{" "}
                <Link href="/host/build" className="font-semibold text-brand hover:underline">See how it works →</Link>
              </p>
            )}
          </>
        )}
      </div>

      {hasSite && (
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

      {hasSite && (
        <div className="mb-6 border-t border-line pt-5">
          <PaymentLinksFields stripe={payStripe} paypal={payPaypal} onStripe={setPayStripe} onPaypal={setPayPaypal} />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 sticky bottom-0 bg-white py-3 border-t border-line">
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
