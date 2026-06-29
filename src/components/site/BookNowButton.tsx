"use client";

import { useState } from "react";
import { MicrositeBooking } from "@/components/MicrositeBooking";
import type { Listing } from "@/lib/types";

// A "Book now" button that expands the full booking/request form in a modal.
// Used where we want booking available but collapsed (e.g. the builder preview).
export function BookNowButton({ listing, demo, className = "" }: { listing: Listing; demo: boolean; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
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
      <button onClick={() => setOpen(true)} className={className}>Book now</button>
    </>
  );
}
