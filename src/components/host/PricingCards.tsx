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
    features: ["Photo listing", "‘Book direct’ link to your site", "Enquiry relay", "Basic stats", "Up to 3 properties"] },
  { key: "featured", name: "Featured", price: 149, photos: "10 photos", featured: true,
    features: ["Everything in Standard", "Featured placement", "‘Featured Stay’ badge", "Detailed analytics", "Up to 10 properties"] },
  { key: "pro", name: "Pro", price: 299, photos: "20 photos", featured: false,
    features: ["Everything in Featured", "Top priority placement", "Dedicated profile page", "Monthly report", "Unlimited properties"] },
];

export function PricingCards() {
  return (
    <div>
      <p className="text-center text-sm text-muted mb-7 max-w-2xl mx-auto">
        <b className="text-ink">Already have a website?</b> A plan below is all you need, we list you and send you traffic.
        {" "}<b className="text-ink">No website?</b> Flip on <b className="text-ink">Add a booking website</b> on any plan and we build and host one for you.
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
  const [withSite, setWithSite] = useState(false);
  const total = tier.price + (withSite ? ADDON : 0);

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
      <p className="mt-2">
        <span className="text-3xl font-bold">£{total}</span>
        <span className="text-muted">/year</span>
      </p>
      {total > 0 && (
        <p className="text-xs font-semibold text-emerald-700 mt-0.5">
          Founding price £{Math.round(total * 0.8)}/yr for life
        </p>
      )}
      <p className="text-sm text-muted mt-1 min-h-5">
        {withSite ? `Includes £${ADDON} booking website` : tier.key === "free" ? tier.photos : `Use your own website${tier.photos === "Text-only listing" ? "" : ` · ${tier.photos}`}`}
      </p>

      <ul className="mt-4 space-y-2 text-sm flex-1">
        {tier.features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="text-brand">✓</span> {f}
          </li>
        ))}
        {withSite && (
          <li className="flex gap-2 font-medium text-ink">
            <span className="text-brand">✓</span> We build, host &amp; secure your own business website
          </li>
        )}
      </ul>

      {/* Add-on toggle */}
      <button
        type="button"
        onClick={() => setWithSite((v) => !v)}
        className={`mt-5 w-full rounded-xl border p-3 text-left transition ${
          withSite ? "border-brand bg-rose-50" : "border-line hover:border-ink"
        }`}
      >
        <span className="flex items-center justify-between">
          <span className="text-sm font-semibold">Add a booking website</span>
          <span
            className={`relative w-10 h-6 rounded-full transition ${withSite ? "bg-brand" : "bg-line"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                withSite ? "translate-x-4" : ""
              }`}
            />
          </span>
        </span>
        <span className="block text-xs text-muted mt-1">
          We design, build &amp; host a secure website for your business, no tech skills needed. +£{ADDON}/yr
        </span>
      </button>

      <Link
        href={`/host/new?tier=${tier.key}${withSite ? "&website=1" : ""}`}
        className={`mt-3 text-center font-semibold py-2.5 rounded-full transition ${
          tier.featured
            ? "bg-brand-gradient bg-brand-gradient-hover text-white shadow-glow"
            : "border border-ink hover:bg-mist"
        }`}
      >
        {tier.key === "free" && !withSite ? "Start free" : `Choose ${tier.name}${withSite ? " + Website" : ""}`}
      </Link>

      {withSite && (
        <Link href="/sites/beach-house-algarve?t=coastal" target="_blank" rel="noreferrer" className="mt-2 text-center text-xs font-semibold text-brand hover:underline">
          See an example booking website →
        </Link>
      )}
    </div>
  );
}
