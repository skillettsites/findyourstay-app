"use client";

import Link from "next/link";
import { useState } from "react";

// Reusable £ commission calculator embedded in the guide tool-pages (#1-3).
// variant sets the defaults + which levers show, but the maths is identical:
// annual commission = avg nightly rate × commission rate × bookings/year.
type Variant = "ota" | "airbnb" | "bookingcom";

const PLATFORMS: { id: string; label: string; rate: number }[] = [
  { id: "airbnb", label: "Airbnb (host-only fee)", rate: 15.5 },
  { id: "bookingcom", label: "Booking.com", rate: 15 },
  { id: "vrbo", label: "Vrbo / Expedia (pay-per-booking)", rate: 8 },
  { id: "expedia", label: "Expedia (hotel-style)", rate: 18 },
];

const gbp = (n: number) => "£" + Math.round(n).toLocaleString("en-GB");

export function CommissionCalculator({ variant }: { variant: Variant }) {
  const [rate, setRate] = useState(variant === "airbnb" ? 15.5 : variant === "bookingcom" ? 15 : 15.5);
  const [platform, setPlatform] = useState("airbnb");
  const [price, setPrice] = useState(95);
  const [bookings, setBookings] = useState(60);
  // Booking.com extras
  const [preferred, setPreferred] = useState(false);
  const [bcPayments, setBcPayments] = useState(true);
  // Airbnb VAT trap (non-VAT-registered UK hosts pay 20% VAT on the fee)
  const [vatReg, setVatReg] = useState(false);

  // Effective commission rate for the chosen variant.
  let effRate = rate;
  if (variant === "ota") effRate = PLATFORMS.find((p) => p.id === platform)?.rate ?? rate;
  if (variant === "bookingcom") effRate = rate + (preferred ? 2 : 0) + (bcPayments ? 1.1 : 0);
  if (variant === "airbnb" && !vatReg) effRate = rate * 1.2; // +20% VAT on the service fee

  const cardFee = 1.5; // direct card processing %
  const perBooking = (price * effRate) / 100;
  const annual = perBooking * bookings;
  const directCost = (price * cardFee) / 100 * bookings;
  const keep = annual - directCost;

  const inputCls = "w-full accent-brand";
  const numCls = "w-24 border border-line rounded-lg px-3 py-2 text-sm text-ink font-semibold outline-none focus:border-ink";

  return (
    <div className="not-prose my-9 rounded-3xl border border-line bg-white shadow-card overflow-hidden">
      <div className="grid md:grid-cols-2">
        {/* Inputs */}
        <div className="p-6 sm:p-7 border-b md:border-b-0 md:border-r border-line">
          <p className="font-display font-bold text-lg text-ink">Your numbers</p>

          {variant === "ota" && (
            <label className="block mt-5">
              <span className="text-sm font-semibold text-ink">Booking platform</span>
              <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="mt-1.5 w-full border border-line rounded-xl px-3 py-2.5 text-sm bg-white outline-none focus:border-ink">
                {PLATFORMS.map((p) => <option key={p.id} value={p.id}>{p.label}, {p.rate}%</option>)}
              </select>
            </label>
          )}

          {(variant === "airbnb" || variant === "bookingcom") && (
            <div className="mt-5">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-ink">Commission rate</span>
                <span className="font-semibold text-brand">{rate}%</span>
              </div>
              <input type="range" min={5} max={25} step={0.5} value={rate} onChange={(e) => setRate(+e.target.value)} className={`mt-2 ${inputCls}`} />
            </div>
          )}

          <div className="mt-5">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-ink">Average nightly rate</span>
              <span className="inline-flex items-center gap-1"><span className="text-muted">£</span><input type="number" min={10} max={2000} value={price} onChange={(e) => setPrice(Math.max(0, +e.target.value))} className={numCls} /></span>
            </div>
            <input type="range" min={30} max={500} step={5} value={price} onChange={(e) => setPrice(+e.target.value)} className={`mt-2 ${inputCls}`} />
          </div>

          <div className="mt-5">
            <div className="flex justify-between items-center text-sm">
              <span className="font-semibold text-ink">Bookings per year</span>
              <input type="number" min={1} max={2000} value={bookings} onChange={(e) => setBookings(Math.max(0, +e.target.value))} className={numCls} />
            </div>
            <input type="range" min={5} max={365} step={1} value={bookings} onChange={(e) => setBookings(+e.target.value)} className={`mt-2 ${inputCls}`} />
          </div>

          {variant === "bookingcom" && (
            <div className="mt-5 space-y-2.5">
              <Toggle checked={preferred} onChange={setPreferred} label="Preferred Partner (+2%)" />
              <Toggle checked={bcPayments} onChange={setBcPayments} label="Payments by Booking.com (+1.1%)" />
            </div>
          )}
          {variant === "airbnb" && (
            <div className="mt-5">
              <Toggle checked={vatReg} onChange={setVatReg} label="I'm VAT registered" />
              {!vatReg && <p className="text-xs text-amber-700 mt-2">Not VAT registered? Airbnb adds 20% VAT to its fee, so your real rate is <b>{effRate.toFixed(1)}%</b>, not {rate}%.</p>}
            </div>
          )}
        </div>

        {/* Result */}
        <div className="p-6 sm:p-7 bg-ink text-white flex flex-col justify-center">
          <p className="text-white/60 text-sm">You're paying in commission</p>
          <p className="font-display font-extrabold text-5xl sm:text-6xl mt-1 leading-none">{gbp(annual)}<span className="text-2xl text-white/50">/yr</span></p>
          <p className="text-white/70 text-sm mt-2">That's <b className="text-white">{gbp(perBooking)}</b> on every {gbp(price)} booking, at an effective <b className="text-white">{effRate.toFixed(1)}%</b>.</p>

          <div className="mt-5 rounded-2xl bg-white/10 p-4">
            <p className="text-sm text-white/80">Book those direct instead (0% commission, ~{cardFee}% card fee):</p>
            <p className="font-display font-bold text-2xl mt-1">Keep about {gbp(keep)}/yr</p>
          </div>

          <Link href="/host/build" className="mt-5 text-center bg-brand-gradient bg-brand-gradient-hover font-semibold px-6 py-3.5 rounded-full shadow-glow transition-transform active:scale-95">
            See your free booking site →
          </Link>
          <p className="text-white/50 text-xs text-center mt-2">No signup. Built and hosted for you.</p>
        </div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-2.5 text-sm text-ink w-full text-left">
      <span className={`shrink-0 w-9 h-5 rounded-full transition relative ${checked ? "bg-brand" : "bg-line"}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${checked ? "left-4" : "left-0.5"}`} />
      </span>
      <span className="font-medium">{label}</span>
    </button>
  );
}
