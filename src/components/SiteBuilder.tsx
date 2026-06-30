"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const VIBES = [
  { key: "beach", label: "Beach", theme: "coastal", img: "https://images.unsplash.com/photo-1730005523015-422bd53dda0b?auto=format&fit=crop&w=400&q=70" },
  { key: "city", label: "City", theme: "modern", img: "https://images.unsplash.com/photo-1690585552493-2f4406dae499?auto=format&fit=crop&w=400&q=70" },
  { key: "mountain", label: "Mountain", theme: "classic", img: "https://images.unsplash.com/photo-1605153123052-528d89be0d4e?auto=format&fit=crop&w=400&q=70" },
];
const TYPES: [string, string][] = [["guest_house", "Guesthouse / B&B"], ["apartment", "Apartment"], ["villa", "Villa"], ["chalet", "Chalet / cabin"], ["cottage", "Cottage"], ["hotel", "Boutique hotel"]];
const input = "w-full border border-line rounded-xl px-4 py-2.5 text-sm outline-none focus:border-ink bg-white";

export function SiteBuilder() {
  const [vibe, setVibe] = useState("beach");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [type, setType] = useState("guest_house");
  const [bedrooms, setBedrooms] = useState("3");
  const [price, setPrice] = useState("120");

  const params = { vibe, name, city, country, type, bedrooms, price };
  // Desktop iframe: embed=1 drops the preview's own bars (the form has the CTA).
  const embedUrl = () => `/sites/preview?${new URLSearchParams({ ...params, embed: "1" }).toString()}`;
  // Mobile "see my website": the full preview in a new tab, WITH its own top
  // "back to FindYourStay" bar and sticky "make it live / add real photos" bar.
  const openUrl = `/sites/preview?${new URLSearchParams(params).toString()}`;

  // Only mount the live iframe on desktop — mobile opens the preview in a new
  // tab instead, so there's no point loading a hidden iframe on a phone.
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Debounced src so the desktop preview updates as you type without thrashing.
  const [src, setSrc] = useState(embedUrl());
  useEffect(() => {
    const t = setTimeout(() => setSrc(embedUrl()), 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vibe, name, city, country, type, bedrooms, price]);

  const theme = VIBES.find((v) => v.key === vibe)?.theme ?? "coastal";
  const liveHref = `/host/new?website=1&tier=featured&theme=${theme}&name=${encodeURIComponent(name)}&city=${encodeURIComponent(city)}&price=${price}`;

  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-6 lg:items-stretch">
      {/* Form */}
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold mb-2">1. Pick a vibe</p>
          <div className="grid grid-cols-3 gap-2">
            {VIBES.map((v) => (
              <button key={v.key} onClick={() => setVibe(v.key)} className={`rounded-xl overflow-hidden border-2 transition ${vibe === v.key ? "border-brand" : "border-line hover:border-ink"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.img} alt="" className="h-16 w-full object-cover" />
                <span className="block text-xs font-semibold py-1.5">{v.label}</span>
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm font-semibold pt-1">2. Your details</p>
        <label className="block"><span className="text-sm font-medium">Name of your stay</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sea View Guesthouse" className={`${input} mt-1.5`} /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className="text-sm font-medium">City / town</span><input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Porto" className={`${input} mt-1.5`} /></label>
          <label className="block"><span className="text-sm font-medium">Country</span><input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Portugal" className={`${input} mt-1.5`} /></label>
        </div>
        <label className="block"><span className="text-sm font-medium">Type of place</span><select value={type} onChange={(e) => setType(e.target.value)} className={`${input} mt-1.5`}>{TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block"><span className="text-sm font-medium">Bedrooms</span><input value={bedrooms} onChange={(e) => setBedrooms(e.target.value.replace(/\D/g, ""))} className={`${input} mt-1.5`} /></label>
          <label className="block"><span className="text-sm font-medium">Price / night (£)</span><input value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} className={`${input} mt-1.5`} /></label>
        </div>

        {/* Mobile: open the full preview in a new tab (with its own bars) */}
        <a href={openUrl} target="_blank" rel="noopener noreferrer" className="lg:hidden block text-center bg-brand-gradient bg-brand-gradient-hover text-white font-semibold py-3.5 rounded-full shadow-glow transition-transform active:scale-95">
          See my website →
        </a>
        <p className="lg:hidden text-center text-xs text-muted">Opens your live preview in a new tab.</p>

        {/* Desktop: make it live (the live preview sits alongside) */}
        <Link href={liveHref} className="hidden lg:block text-center bg-brand-gradient bg-brand-gradient-hover text-white font-semibold py-3 rounded-full shadow-glow transition-transform active:scale-95">
          Create this site &amp; make it live →
        </Link>
        <p className="hidden lg:block text-xs text-muted text-center">No card needed to preview. We&apos;ll source real photos of your place and put it on your own domain.</p>
      </div>

      {/* Live preview — desktop only; mobile uses the "See my website" button.
          Stretches to match the form's height so the two columns line up. */}
      <div className="hidden lg:flex lg:flex-col">
        <div className="flex flex-col flex-1 rounded-2xl border border-line overflow-hidden bg-white shadow-float">
          <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-line bg-mist shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" /><span className="w-3 h-3 rounded-full bg-[#febc2e]" /><span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-xs text-muted truncate">live preview · updates as you type</span>
          </div>
          {desktop && <iframe key={src} src={src} title="Your site preview" className="w-full flex-1 min-h-0 bg-white" />}
        </div>
      </div>
    </div>
  );
}
