"use client";

import { useEffect, useRef } from "react";

// Fires one "view" event per listing page load, from the browser. Renders
// nothing. Best-effort: a failed beacon must never affect the page.
export function ViewBeacon({ listingId }: { listingId: string }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    const body = JSON.stringify({ listingId, type: "view" });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/event", new Blob([body], { type: "application/json" }));
      } else {
        void fetch("/api/event", { method: "POST", body, headers: { "Content-Type": "application/json" }, keepalive: true });
      }
    } catch {
      /* analytics must never break a page */
    }
  }, [listingId]);
  return null;
}
