"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Listing } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export function MicrositeBooking({ listing }: { listing: Listing }) {
  // Prefill from the hero availability search (?in=&out=&guests=) when present.
  const sp = useSearchParams();
  const [checkIn, setCheckIn] = useState(sp.get("in") ?? "");
  const [checkOut, setCheckOut] = useState(sp.get("out") ?? "");
  const [guests, setGuests] = useState(sp.get("guests") ?? "2");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function reserve() {
    setError("");
    if (!checkIn || !checkOut || nights <= 0) { setError("Choose your dates."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email."); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/booking/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: listing.id, guestEmail: email, checkIn, checkOut, guests }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not reserve.");
    } finally {
      setBusy(false);
    }
  }

  const nightly = listing.pricePerNight ?? 0;
  const nights =
    checkIn && checkOut ? Math.max(0, (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000) : 0;
  const subtotal = nights * nightly;
  const fee = 0;
  const total = subtotal + fee;

  if (done) {
    return (
      <div className="border border-line rounded-2xl shadow-float p-6 bg-white text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-2xl">✓</div>
        <h3 className="font-semibold text-lg mt-3">Reservation started</h3>
        <p className="text-sm text-muted mt-1">
          In the live site, the guest now pays {total ? formatPrice(total, listing.currency) : "the deposit"} securely by
          card. The money goes straight to <span className="font-semibold text-ink">your own Stripe account</span>. FindYourStay
          never touches it.
        </p>
        <button onClick={() => setDone(false)} className="mt-4 text-sm font-semibold text-brand hover:underline">
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="border border-line rounded-2xl shadow-float p-5 bg-white">
      <p className="text-xl">
        <span className="font-bold">{formatPrice(nightly, listing.currency)}</span>
        <span className="text-muted text-base"> night</span>
      </p>
      <div className="mt-4 grid grid-cols-2 border border-line rounded-xl overflow-hidden text-sm">
        <label className="p-3 border-r border-line">
          <span className="block text-[11px] font-semibold uppercase text-muted">Check in</span>
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full outline-none" />
        </label>
        <label className="p-3">
          <span className="block text-[11px] font-semibold uppercase text-muted">Check out</span>
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full outline-none" />
        </label>
        <label className="p-3 border-t border-line col-span-2">
          <span className="block text-[11px] font-semibold uppercase text-muted">Guests</span>
          <input type="number" min={1} value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full outline-none" />
        </label>
      </div>

      {nights > 0 && (
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-muted">
            <span>{formatPrice(nightly, listing.currency)} × {nights} nights</span>
            <span>{formatPrice(subtotal, listing.currency)}</span>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t border-line">
            <span>Total</span>
            <span>{formatPrice(total, listing.currency)}</span>
          </div>
        </div>
      )}

      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-3 w-full border border-line rounded-xl px-3 py-2.5 text-sm outline-none focus:border-ink"
      />
      <button
        onClick={reserve}
        disabled={busy}
        className="mt-3 w-full bg-brand-gradient bg-brand-gradient-hover disabled:opacity-50 text-white font-semibold py-3.5 rounded-full shadow-glow transition-transform active:scale-95"
      >
        {busy ? "Checking availability…" : "Reserve & pay"}
      </button>
      {error && <p className="text-sm text-brand text-center mt-2">{error}</p>}
      <p className="text-xs text-muted text-center mt-3">Secure card payment via the owner&apos;s Stripe. No platform fees.</p>
    </div>
  );
}
