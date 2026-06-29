"use client";

import { useState } from "react";
import { MicrositeBooking } from "@/components/MicrositeBooking";
import { formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/types";

// Collapsed "Book now" widget for the inner template pages (rooms/gallery/
// location). A sticky bottom bar that expands into the full booking/request form.
export function StickyBook({ listing, demo }: { listing: Listing; demo: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* keeps page content clear of the fixed bar */}
      <div className="h-16" />

      {open && (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/45" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md px-3 pb-3 sm:p-4">
            <div className="flex justify-end mb-2">
              <button onClick={() => setOpen(false)} aria-label="Close" className="w-9 h-9 grid place-items-center rounded-full bg-white shadow text-ink">✕</button>
            </div>
            <MicrositeBooking listing={listing} demo={demo} />
          </div>
        </div>
      )}

      <div className="fixed bottom-0 inset-x-0 z-[60] bg-white border-t border-line shadow-[0_-6px_24px_rgba(0,0,0,0.08)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <p className="text-sm">
            <span className="font-bold text-lg">{formatPrice(listing.pricePerNight, listing.currency)}</span>
            <span className="text-muted"> / night</span>
          </p>
          <button onClick={() => setOpen(true)} className="bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-6 py-2.5 rounded-full shadow-glow transition-transform active:scale-95">
            Book now
          </button>
        </div>
      </div>
    </>
  );
}
