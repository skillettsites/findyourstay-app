"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AMENITIES_OPTIONS } from "@/lib/types";
import { suggestDomain } from "@/lib/format";

const TYPES = ["apartment", "house", "villa", "cottage", "room", "guest_house", "hostel", "hotel", "chalet"];
const TYPE_LABEL: Record<string, string> = {
  apartment: "Apartment", house: "House", villa: "Villa", cottage: "Cottage", room: "Private room",
  guest_house: "Guesthouse / B&B", hostel: "Hostel", hotel: "Boutique hotel", chalet: "Chalet / cabin",
};
const TIER_PRICE: Record<string, number> = { free: 0, standard: 79, featured: 149, pro: 299 };
const ADDON = 120;

const TEMPLATES = [
  { key: "classic" as const, label: "Classic", blurb: "Elegant & timeless", swatch: "bg-gradient-to-br from-stone-700 to-stone-900", slug: "mountain-chalet-geres" },
  { key: "modern" as const, label: "Modern", blurb: "Bold & editorial", swatch: "bg-gradient-to-br from-zinc-900 to-zinc-600", slug: "city-loft-lisbon" },
  { key: "coastal" as const, label: "Coastal", blurb: "Airy & relaxed", swatch: "bg-gradient-to-br from-emerald-700 to-emerald-900", slug: "beach-house-algarve" },
];

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);

interface GeoResult {
  id: string;
  label: string;
  address: string;
  city: string;
  neighborhood: string;
  country: string;
  lat: number;
  lng: number;
}

export function ListingWizard({ initialTier = "featured", initialBuild = false, userEmail = "" }: { initialTier?: string; initialBuild?: boolean; userEmail?: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [type, setType] = useState("guest_house");
  // Single address field; the city, neighbourhood and coordinates are all
  // derived from whichever address the host selects (no separate city field).
  const [addrQuery, setAddrQuery] = useState("");
  const [addrSug, setAddrSug] = useState<GeoResult[]>([]);
  const [addrOpen, setAddrOpen] = useState(false);
  const [place, setPlace] = useState<GeoResult | null>(null);

  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [amenities, setAmenities] = useState<string[]>(["WiFi"]);
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadErr, setUploadErr] = useState("");

  const [method, setMethod] = useState<"own" | "build">(initialBuild ? "build" : "own");
  const [bookingUrl, setBookingUrl] = useState("");
  const [domain, setDomain] = useState("");
  const [siteTheme, setSiteTheme] = useState<"classic" | "modern" | "coastal">("classic");

  const [tier, setTier] = useState(initialTier);
  const maxPhotos = tier === "free" ? 1 : 12;

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [doneSlug, setDoneSlug] = useState<string | null>(null);

  const addrRef = useRef<HTMLDivElement>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!domain && name) setDomain(suggestDomain(name));
  }, [name, domain]);

  useEffect(() => {
    if (!addrOpen) return;
    if (place && addrQuery === place.label) return; // already chosen, don't re-query
    if (addrQuery.trim().length < 3) { setAddrSug([]); return; }
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geo/autocomplete?q=${encodeURIComponent(addrQuery)}`);
        const data = await res.json();
        setAddrSug(data.results ?? []);
      } catch {
        setAddrSug([]);
      }
    }, 220);
  }, [addrQuery, addrOpen, place]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (addrRef.current && !addrRef.current.contains(e.target as Node)) setAddrOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  function toggleAmenity(a: string) {
    setAmenities((cur) => (cur.includes(a) ? cur.filter((x) => x !== a) : [...cur, a]));
  }

  async function onUpload(files: FileList | null) {
    if (!files?.length) return;
    setUploadErr("");
    const room = maxPhotos - uploaded.length;
    if (room <= 0) {
      setUploadErr(tier === "free" ? "The free plan includes 1 photo. Upgrade to add more." : `Up to ${maxPhotos} photos.`);
      return;
    }
    setUploading(true);
    try {
      for (const file of Array.from(files).slice(0, room)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/host/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setUploaded((cur) => [...cur, data.url]);
      }
    } catch (e) {
      setUploadErr(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  const urlOk = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+.*$/.test(bookingUrl.trim());
  const canNext =
    step === 1 ? Boolean(name.trim() && place) :
    step === 2 ? true :
    step === 3 ? (method === "own" ? urlOk : Boolean(domain.trim())) :
    true;

  const total = TIER_PRICE[tier] + (method === "build" ? ADDON : 0);

  async function publish() {
    setBusy(true);
    setError("");
    try {
      const photos = uploaded.slice(0, maxPhotos);
      const res = await fetch("/api/host/listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyName: name,
          citySlug: place ? slugify(place.city) : undefined,
          cityName: place?.city, country: place?.country,
          propertyType: type, neighborhood: place?.neighborhood || undefined,
          address: place?.address || undefined, lat: place?.lat, lng: place?.lng,
          description, pricePerNight: price ? Number(price) : undefined,
          amenities, photos,
          bookingUrl: method === "own" ? (/^https?:\/\//.test(bookingUrl.trim()) ? bookingUrl.trim() : `https://${bookingUrl.trim()}`) : undefined,
          hasBookingSite: method === "build", bookingDomain: method === "build" ? domain.trim() : undefined,
          siteTheme: method === "build" ? siteTheme : undefined,
          tier, withSite: method === "build",
        }),
      });
      const data = await res.json();
      if (res.status === 401 && data.needsAuth) {
        window.location.href = `/login?next=${encodeURIComponent("/host/new")}`;
        return;
      }
      if (!res.ok) throw new Error(data.error);
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl; // Stripe configured -> pay for the plan
        return;
      }
      setDoneSlug(data.slug);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  if (doneSlug) {
    return (
      <div className="max-w-xl mx-auto text-center bg-white border border-line rounded-2xl shadow-card p-8">
        <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-3xl">✓</div>
        <h2 className="text-2xl font-display font-bold mt-4">You&apos;re live!</h2>
        <p className="text-muted mt-2">
          {name} is now listed. {method === "build"
            ? `We'll register ${domain}, build your booking website and email ${userEmail || "you"} when it's ready.`
            : "Travellers can now find you and book direct on your own site."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <Link href={`/rooms/${doneSlug}`} className="bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-6 py-3 rounded-full shadow-glow">
            View your listing
          </Link>
          <Link href="/host/dashboard" className="border border-ink font-semibold px-6 py-3 rounded-full hover:bg-mist">
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition ${s <= step ? "bg-brand" : "bg-line"}`} />
        ))}
      </div>
      <p className="text-sm text-muted mb-1">Step {step} of 4</p>

      {step === 1 && (
        <div>
          <h2 className="text-2xl font-display font-bold mb-5">Tell us about your stay</h2>
          <Field label="Property name">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sea View Guesthouse" className={inputCls} />
          </Field>
          <Field label="Type of place">
            <select value={type} onChange={(e) => setType(e.target.value)} className={inputCls}>
              {TYPES.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
            </select>
          </Field>
          <Field label="Exact address (private)">
            <div ref={addrRef} className="relative">
              <input
                value={addrQuery}
                onChange={(e) => { setPlace(null); setAddrQuery(e.target.value); setAddrOpen(true); }}
                onFocus={() => setAddrOpen(true)}
                placeholder="Start typing your address…"
                autoComplete="off"
                className={inputCls}
              />
              {addrOpen && !place && addrSug.length > 0 && (
                <ul className="absolute z-30 left-0 right-0 mt-1 bg-white border border-line rounded-xl shadow-float max-h-64 overflow-auto">
                  {addrSug.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); setPlace(s); setAddrQuery(s.label); setAddrOpen(false); }}
                        className="w-full flex items-start gap-2.5 text-left px-4 py-2.5 hover:bg-mist"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-brand mt-0.5 shrink-0"><path d="M12 2c3.5 0 6 2.6 6 6.2 0 4-3.4 8-5.3 10.9a.8.8 0 0 1-1.4 0C9.4 16.2 6 12.2 6 8.2 6 4.6 8.5 2 12 2Zm0 4.2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" /></svg>
                        <span className="text-sm">{s.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {place ? (
              <p className="text-xs text-emerald-700 mt-1.5 flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0"><path d="M5 12l4 4L19 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                We&apos;ll list this in <b className="font-semibold">{place.neighborhood ? `${place.neighborhood}, ` : ""}{place.city}, {place.country}</b>
              </p>
            ) : (
              <p className="text-xs text-muted mt-1.5 flex items-start gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand mt-0.5 shrink-0"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
                Pick your address from the list. We use it only to place you in the right area, guests just see an approximate spot on the map, never the exact address.
              </p>
            )}
          </Field>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-2xl font-display font-bold mb-5">Details &amp; photos</h2>
          <Field label="Price per night (£)">
            <input value={price} onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))} placeholder="95" className={inputCls} />
          </Field>
          <Field label="Description">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="A cosy place a short walk from the centre…" className={inputCls} />
          </Field>
          <Field label="Amenities">
            <div className="flex flex-wrap gap-2">
              {AMENITIES_OPTIONS.map((a) => (
                <button key={a} type="button" onClick={() => toggleAmenity(a)} className={`px-3 py-1.5 rounded-full text-sm border transition ${amenities.includes(a) ? "border-ink bg-ink text-white" : "border-line hover:border-ink"}`}>
                  {a}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Photos">
            <div className="flex flex-wrap gap-3">
              {uploaded.map((u, i) => (
                <div key={u} className="relative w-24 h-24 rounded-xl overflow-hidden border border-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={u} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setUploaded((c) => c.filter((_, j) => j !== i))} className="absolute top-1 right-1 w-5 h-5 grid place-items-center rounded-full bg-black/60 text-white text-xs">×</button>
                </div>
              ))}
              {uploaded.length < maxPhotos && (
                <label className={`w-24 h-24 rounded-xl border-2 border-dashed border-line grid place-items-center cursor-pointer hover:border-ink transition ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
                  <input type="file" accept="image/*" multiple={maxPhotos > 1} className="hidden" onChange={(e) => onUpload(e.target.files)} />
                  <span className="text-center text-xs text-muted">{uploading ? "Uploading…" : "+ Add photo"}</span>
                </label>
              )}
            </div>
            <p className="text-xs text-muted mt-2">
              {tier === "free"
                ? "The free plan includes 1 photo. Upgrade for more, or we'll source professional photos for you."
                : `Add up to ${maxPhotos} photos. Leave empty and we'll source professional photos of your stay for you.`}
            </p>
            {uploadErr && <p className="text-xs text-brand mt-1">{uploadErr}</p>}
          </Field>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-2xl font-display font-bold mb-2">How do guests book?</h2>
          <p className="text-muted mb-5">Pick whichever fits you, you can change it later.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <MethodCard active={method === "own"} onClick={() => setMethod("own")} title="I have my own website" desc="Send guests straight to your existing booking page or contact." icon="🔗" />
            <MethodCard active={method === "build"} onClick={() => setMethod("build")} title="Build me a website" desc="No website? We register a domain & build one for you, hosted on Cloudflare. +£120/yr." icon="✨" />
          </div>

          {method === "own" ? (
            <Field label="Your booking link" className="mt-6">
              <input value={bookingUrl} onChange={(e) => setBookingUrl(e.target.value)} placeholder="https://your-website.com/book" className={inputCls} />
            </Field>
          ) : (
            <div className="mt-6 bg-rose-50 border border-rose-100 rounded-xl p-5">
              <Field label="Your new website address">
                <input value={domain} onChange={(e) => setDomain(e.target.value)} className={inputCls} />
              </Field>
              <p className="text-sm text-muted mt-2">
                We&apos;ll check it&apos;s available, register it for you, and build a booking site with online card
                payments through <span className="font-semibold text-ink">your own Stripe</span>. You keep 100%.
                Nothing technical for you to do.
              </p>

              <div className="mt-5">
                <p className="text-sm font-semibold mb-1">Choose your template</p>
                <p className="text-xs text-muted mb-3">We fill it in from your details. You can change it any time from your dashboard.</p>
                <div className="grid grid-cols-3 gap-2.5">
                  {TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.key}
                      type="button"
                      onClick={() => setSiteTheme(tpl.key)}
                      className={`text-left rounded-xl border-2 p-2.5 transition bg-white ${siteTheme === tpl.key ? "border-brand" : "border-line hover:border-ink"}`}
                    >
                      <div className={`h-14 rounded-md ${tpl.swatch} mb-2`} />
                      <div className="text-sm font-semibold">{tpl.label}</div>
                      <div className="text-[11px] text-muted leading-tight">{tpl.blurb}</div>
                    </button>
                  ))}
                </div>
                <a
                  href={`/sites/${TEMPLATES.find((x) => x.key === siteTheme)?.slug}?t=${siteTheme}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-brand"
                >
                  Preview the {TEMPLATES.find((x) => x.key === siteTheme)?.label} template ↗
                </a>
                <div className="mt-4 flex items-start gap-2 bg-white border border-rose-100 rounded-lg p-3 text-xs text-muted">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand mt-0.5 shrink-0"><path d="M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" /></svg>
                  <span>We get your site found: submitted to Google &amp; Bing for indexing, with a sitemap and an llms.txt so AI assistants can recommend you too.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="text-2xl font-display font-bold mb-5">Choose your plan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            {Object.keys(TIER_PRICE).map((t) => (
              <button key={t} type="button" onClick={() => setTier(t)} className={`rounded-xl border p-3 text-center transition ${tier === t ? "border-brand bg-rose-50" : "border-line hover:border-ink"}`}>
                <div className="font-semibold capitalize text-sm">{t}</div>
                <div className="text-xs text-muted">£{TIER_PRICE[t]}/yr</div>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm bg-mist rounded-xl px-4 py-3 mb-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-muted shrink-0"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-8 1.7-8 5v1h16v-1c0-3.3-4.7-5-8-5Z" /></svg>
            <span>Publishing as <b className="font-semibold">{userEmail}</b></span>
          </div>

          <div className="bg-mist rounded-xl p-4 mt-2 text-sm">
            <div className="flex justify-between"><span className="capitalize">{tier} plan</span><span>£{TIER_PRICE[tier]}/yr</span></div>
            {method === "build" && <div className="flex justify-between mt-1"><span>Booking website ({domain})</span><span>£{ADDON}/yr</span></div>}
            <div className="flex justify-between font-semibold pt-2 mt-2 border-t border-line"><span>Total</span><span>£{total}/yr</span></div>
          </div>
          {error && <p className="text-brand text-sm mt-3">{error}</p>}
        </div>
      )}

      {/* Nav */}
      <div className="flex justify-between mt-8">
        <button type="button" onClick={() => (step === 1 ? router.push("/host") : setStep(step - 1))} className="font-semibold px-5 py-3 rounded-full hover:bg-mist">
          Back
        </button>
        {step < 4 ? (
          <button type="button" disabled={!canNext} onClick={() => setStep(step + 1)} className="bg-brand-gradient bg-brand-gradient-hover disabled:opacity-40 text-white font-semibold px-7 py-3 rounded-full shadow-glow transition-transform active:scale-95">
            Next
          </button>
        ) : (
          <button type="button" disabled={busy} onClick={publish} className="bg-brand-gradient bg-brand-gradient-hover disabled:opacity-50 text-white font-semibold px-7 py-3 rounded-full shadow-glow transition-transform active:scale-95">
            {busy ? "Publishing…" : tier === "free" && method === "own" ? "Publish listing" : "Publish & continue to payment"}
          </button>
        )}
      </div>
    </div>
  );
}

const inputCls = "w-full border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-ink bg-white";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block mb-4 ${className}`}>
      <span className="block text-sm font-semibold mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function MethodCard({ active, onClick, title, desc, icon }: { active: boolean; onClick: () => void; title: string; desc: string; icon: string }) {
  return (
    <button type="button" onClick={onClick} className={`text-left rounded-2xl border-2 p-5 transition ${active ? "border-brand bg-rose-50" : "border-line hover:border-ink"}`}>
      <span className="text-2xl">{icon}</span>
      <h3 className="font-semibold mt-2">{title}</h3>
      <p className="text-sm text-muted mt-1">{desc}</p>
    </button>
  );
}
