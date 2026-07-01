"use client";

import Link from "next/link";
import { useState } from "react";

const ADDON = 120; // £/yr hosted booking website

interface Tier {
  key: string;
  name: string;
  price: number;
  photos: string;
  featured: boolean;
  features: string[];
}

const TIERS: Tier[] = [
  { key: "free", name: "Free", price: 0, photos: "Text-only listing", featured: false,
    features: ["Listed on city + search pages", "Enquiry relay", "1 property", "Listed below paid stays"] },
  { key: "standard", name: "Standard", price: 79, photos: "6 photos", featured: false,
    features: ["Photo listing", "‘Book direct’ link to your site", "Enquiry relay", "Basic stats", "1 property + 1 website"] },
  { key: "featured", name: "Featured", price: 149, photos: "10 photos", featured: true,
    features: ["Everything in Standard", "Featured placement", "‘Featured Stay’ badge", "Detailed analytics", "1 property + 1 website"] },
  { key: "pro", name: "Pro", price: 299, photos: "20 photos", featured: false,
    features: ["Everything in Featured", "Top priority placement", "Dedicated profile page", "Monthly report", "Up to 5 properties + 5 websites"] },
];

export function PricingCards() {
  return (
    <div>
      <p className="text-center text-sm text-muted mb-7 max-w-2xl mx-auto">
        Every paid plan includes <b className="text-ink">your own booking website</b>, built and hosted for you.
        {" "}Already have one? Tick <b className="text-ink">&ldquo;I already have my own website&rdquo;</b> on any plan and the price drops, we just list you and send you traffic.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {TIERS.map((t) => (
          <PricingCard key={t.key} tier={t} />
        ))}
      </div>
    </div>
  );
}

function PricingCard({ tier }: { tier: Tier }) {
  const isFree = tier.key === "free";
  // Default: the host NEEDS a site, so a built website is included. Ticking
  // "I already have my own website" removes it and lowers the price.
  const [haveOwnSite, setHaveOwnSite] = useState(false);
  const withSite = !isFree && !haveOwnSite;
  const standard = tier.price + (withSite ? ADDON : 0);
  const founder = Math.round(standard * 0.8);

  return (
    <div
      className={`relative bg-white rounded-2xl border p-6 flex flex-col transition-shadow ${
        tier.featured ? "border-brand shadow-lg" : "border-line hover:shadow-card"
      }`}
    >
      {tier.featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gradient text-white text-xs font-semibold px-3 py-1 rounded-full">
          Most popular
        </span>
      )}
      <h3 className="font-semibold text-lg">{tier.name}</h3>

      {/* Price: founding price is the hero; standard shown smaller beneath */}
      {isFree ? (
        <p className="mt-2">
          <span className="text-3xl font-bold">£0</span>
          <span className="text-muted">/year</span>
        </p>
      ) : (
        <div className="mt-2">
          <p>
            <span className="text-3xl font-bold">£{founder}</span>
            <span className="text-muted">/year</span>
          </p>
          <p className="text-xs font-semibold text-emerald-700">Founding price · for life</p>
          <p className="text-sm text-muted mt-0.5">
            Standard <span className="line-through">£{standard}/yr</span> · founding price with code <span className="font-mono font-semibold">FOUNDING20</span>
          </p>
        </div>
      )}

      <p className="text-sm text-muted mt-2 min-h-5">
        {isFree
          ? tier.photos
          : withSite
            ? `Your own booking website + ${tier.photos}`
            : `List + link to your own site · ${tier.photos}`}
      </p>

      <ul className="mt-4 space-y-2 text-sm flex-1">
        {withSite && (
          <li className="flex gap-2 font-medium text-ink">
            <span className="text-brand">✓</span> We build, host &amp; secure your own website
          </li>
        )}
        {tier.features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="text-brand">✓</span> {f}
          </li>
        ))}
      </ul>

      {/* "Already have a site?" tick — paid tiers only */}
      {!isFree && (
        <button
          type="button"
          onClick={() => setHaveOwnSite((v) => !v)}
          className={`mt-5 w-full rounded-xl border p-3 text-left transition flex items-start gap-3 ${
            haveOwnSite ? "border-brand bg-rose-50" : "border-line hover:border-ink"
          }`}
        >
          <span className={`mt-0.5 grid place-items-center w-5 h-5 rounded border shrink-0 ${haveOwnSite ? "bg-brand border-brand text-white" : "border-line"}`}>
            {haveOwnSite && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l4 4L19 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            )}
          </span>
          <span>
            <span className="text-sm font-semibold block">I already have my own website</span>
            <span className="block text-xs text-muted mt-0.5">We just list you and send traffic to your site. Saves £{ADDON}/yr.</span>
          </span>
        </button>
      )}

      <Link
        href={`/host/new?tier=${tier.key}${withSite ? "&website=1" : ""}`}
        className={`mt-3 text-center font-semibold py-2.5 rounded-full transition ${
          tier.featured
            ? "bg-brand-gradient bg-brand-gradient-hover text-white shadow-glow"
            : "border border-ink hover:bg-mist"
        }`}
      >
        {isFree ? "Start free" : `Choose ${tier.name}`}
      </Link>

      {withSite && (
        <Link href="/sites/beach-house-algarve?t=coastal" target="_blank" rel="noreferrer" className="mt-2 text-center text-xs font-semibold text-brand hover:underline">
          See an example booking website →
        </Link>
      )}
    </div>
  );
}
