"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Listing } from "@/lib/types";
import { formatPrice } from "@/lib/format";

const today = () => new Date().toISOString().slice(0, 10);

export function BookingBox({ listing }: { listing: Listing }) {
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [checkIn, setCheckIn] = useState(params.get("in") ?? "");
  const [checkOut, setCheckOut] = useState(params.get("out") ?? "");
  const [guests, setGuests] = useState(params.get("guests") ?? "2");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [result, setResult] = useState("");

  const isBookingSite = listing.hasBookingSite;
  const hasDirect = !!listing.bookingUrl;
  const nightly = listing.pricePerNight ?? 0;
  const nights = checkIn && checkOut ? Math.max(0, (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000) : 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: listing.id, guestEmail: email, checkIn, checkOut, guests, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus("done");
      setResult(data.message);
    } catch (err) {
      setStatus("error");
      setResult(err instanceof Error ? err.message : "Failed to send.");
    }
  }

  async function bookSubmit() {
    if (!checkIn || !checkOut) { setStatus("error"); setResult("Choose your dates first."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus("error"); setResult("Enter a valid email."); return; }
    setStatus("sending");
    try {
      const res = await fetch("/api/booking/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: listing.id, guestEmail: email, checkIn, checkOut, guests }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStatus("done");
      setResult(data.message);
    } catch (err) {
      setStatus("error");
      setResult(err instanceof Error ? err.message : "Request failed.");
    }
  }

  return (
    <div className="border border-line rounded-2xl shadow-lg p-5 bg-white">
      <div className="flex items-baseline justify-between">
        <p className="text-xl">
          <span className="font-semibold">{formatPrice(listing.pricePerNight, listing.currency)}</span>
          <span className="text-muted text-base"> night</span>
        </p>
        {listing.rating != null && (
          <span className="text-sm text-muted">★ {listing.rating.toFixed(2)} · {listing.reviewCount} reviews</span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 border border-line rounded-xl overflow-hidden text-sm">
        <label className="p-3 border-r border-line">
          <span className="block text-[11px] font-semibold uppercase text-muted">Check in</span>
          <input type="date" min={today()} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full outline-none bg-transparent" />
        </label>
        <label className="p-3">
          <span className="block text-[11px] font-semibold uppercase text-muted">Check out</span>
          <input type="date" min={checkIn || today()} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full outline-none bg-transparent" />
        </label>
        <label className="p-3 border-t border-line col-span-2">
          <span className="block text-[11px] font-semibold uppercase text-muted">Guests</span>
          <input type="number" min={1} value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full outline-none bg-transparent" />
        </label>
      </div>

      {nights > 0 && nightly > 0 && (
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between text-muted">
            <span>{formatPrice(nightly, listing.currency)} × {nights} night{nights > 1 ? "s" : ""}</span>
            <span>{formatPrice(nightly * nights, listing.currency)}</span>
          </div>
          <div className="flex justify-between font-semibold pt-2 border-t border-line">
            <span>Total</span>
            <span>{formatPrice(nightly * nights, listing.currency)}</span>
          </div>
        </div>
      )}

      {status === "done" ? (
        <div className="mt-4 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-sm">{result}</div>
      ) : (
        <div className="mt-4 space-y-2">
          {isBookingSite ? (
            <>
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-line rounded-xl px-3 py-2.5 text-sm outline-none focus:border-ink"
              />
              <button
                onClick={bookSubmit}
                disabled={status === "sending"}
                className="w-full bg-brand-gradient bg-brand-gradient-hover disabled:opacity-50 text-white font-semibold py-3.5 rounded-full transition-transform active:scale-95 shadow-glow"
              >
                {status === "sending" ? "Checking dates…" : "Request to book"}
              </button>
              {status === "error" && <p className="text-sm text-brand text-center">{result}</p>}
            </>
          ) : hasDirect ? (
            <a
              href={listing.bookingUrl!}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="block text-center w-full bg-brand-gradient bg-brand-gradient-hover text-white font-semibold py-3.5 rounded-full transition-transform active:scale-95 shadow-glow"
            >
              Book direct on owner&apos;s site
            </a>
          ) : null}

          <button
            onClick={() => setOpen((o) => !o)}
            className="w-full border border-ink font-semibold py-3 rounded-full hover:bg-mist transition"
          >
            {open ? "Hide enquiry form" : "Send the host an enquiry"}
          </button>

          {open && (
            <form onSubmit={submit} className="space-y-2 pt-2">
              <input
                type="email"
                required
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-line rounded-xl px-3 py-2 text-sm outline-none focus:border-ink"
              />
              <textarea
                placeholder="Dates, questions, anything else…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full border border-line rounded-xl px-3 py-2 text-sm outline-none focus:border-ink"
              />
              <button
                disabled={status === "sending"}
                className="w-full bg-ink text-white font-semibold py-2.5 rounded-full disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Send enquiry"}
              </button>
              {status === "error" && <p className="text-sm text-brand">{result}</p>}
            </form>
          )}
        </div>
      )}

      <p className="text-xs text-muted text-center mt-3">
        You pay the owner directly. FindYourStay never handles your booking payment.
      </p>
    </div>
  );
}
