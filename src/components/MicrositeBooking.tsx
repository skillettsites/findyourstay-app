"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Listing } from "@/lib/types";
import { formatPrice } from "@/lib/format";

// Booking widget on the host's own site. Guests pay the host DIRECTLY via the
// host's own Stripe / PayPal link (we never touch the money). Sending the dates
// as a request also lets the host confirm availability. Falls back to a plain
// "request to book" when the host hasn't added a payment link.
export function MicrositeBooking({ listing, demo = false }: { listing: Listing; demo?: boolean }) {
  const sp = useSearchParams();
  const [checkIn, setCheckIn] = useState(sp.get("in") ?? "");
  const [checkOut, setCheckOut] = useState(sp.get("out") ?? "");
  const [guests, setGuests] = useState(sp.get("guests") ?? "2");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState<null | "request" | "pay">(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const nightly = listing.pricePerNight ?? 0;
  const nights = checkIn && checkOut ? Math.max(0, (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000) : 0;
  const total = nights * nightly;
  const hasPay = !!(listing.payStripe || listing.payPaypal);

  function validate() {
    if (!checkIn || !checkOut || nights <= 0) { setError("Choose your dates."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Add your email so the host can confirm."); return false; }
    setError("");
    return true;
  }

  async function sendRequest() {
    if (demo) return;
    const res = await fetch("/api/booking/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId: listing.id, guestEmail: email, checkIn, checkOut, guests }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
  }

  async function onRequest() {
    if (!validate()) return;
    setBusy(true);
    try { await sendRequest(); setDone("request"); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not send your request."); }
    finally { setBusy(false); }
  }

  async function onPay(url: string | null) {
    if (!validate()) return;
    // Open the host's payment page synchronously (within the click) so popup
    // blockers don't stop it, then send the dates in the background.
    if (!demo && url) window.open(url, "_blank", "noopener");
    setBusy(true);
    try { await sendRequest(); setDone("pay"); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not start the booking."); }
    finally { setBusy(false); }
  }

  if (done) {
    return (
      <div className="border border-line rounded-2xl shadow-float p-6 bg-white text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center text-2xl">✓</div>
        {demo ? (
          <>
            <h3 className="font-semibold text-lg mt-3">You&apos;re looking at a preview</h3>
            <p className="text-sm text-muted mt-1">
              On your live site, the guest sends you their dates and {hasPay ? "is taken straight to your own Stripe or PayPal to pay you directly" : "you reply to arrange payment your way"}.
              FindYourStay never touches the money, and there are no commissions or platform fees.
            </p>
          </>
        ) : done === "pay" ? (
          <>
            <h3 className="font-semibold text-lg mt-3">Almost there</h3>
            <p className="text-sm text-muted mt-1">
              Your dates were sent to {listing.propertyName} and your payment page opened in a new tab. The host will confirm your booking by email.
            </p>
          </>
        ) : (
          <>
            <h3 className="font-semibold text-lg mt-3">Request sent</h3>
            <p className="text-sm text-muted mt-1">Thanks, your dates have been sent to the host. They&apos;ll confirm with you by email very soon.</p>
          </>
        )}
        <button onClick={() => setDone(null)} className="mt-4 text-sm font-semibold text-brand hover:underline">Back</button>
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
            <span>{formatPrice(total, listing.currency)}</span>
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

      {hasPay ? (
        <div className="mt-3 space-y-2">
          {listing.payStripe && (
            <button onClick={() => onPay(listing.payStripe)} disabled={busy} className="w-full bg-brand-gradient bg-brand-gradient-hover disabled:opacity-50 text-white font-semibold py-3.5 rounded-full shadow-glow transition-transform active:scale-95">
              Pay with card (Stripe)
            </button>
          )}
          {listing.payPaypal && (
            <button onClick={() => onPay(listing.payPaypal)} disabled={busy} className="w-full bg-[#003087] hover:bg-[#00256b] disabled:opacity-50 text-white font-semibold py-3.5 rounded-full transition-transform active:scale-95">
              Pay with PayPal
            </button>
          )}
          <button onClick={onRequest} disabled={busy} className="w-full text-sm font-semibold text-muted hover:text-ink py-1.5">
            or send a request and pay later
          </button>
        </div>
      ) : (
        <button onClick={onRequest} disabled={busy} className="mt-3 w-full bg-brand-gradient bg-brand-gradient-hover disabled:opacity-50 text-white font-semibold py-3.5 rounded-full shadow-glow transition-transform active:scale-95">
          {busy ? "Sending…" : "Request to book"}
        </button>
      )}

      {error && <p className="text-sm text-brand text-center mt-2">{error}</p>}
      <p className="text-xs text-muted text-center mt-3">
        {demo ? "This is a preview, no payment is taken." : hasPay ? "You pay the host directly. No platform fees, no commission." : "The host will reply to arrange payment. No platform fees."}
      </p>
    </div>
  );
}
