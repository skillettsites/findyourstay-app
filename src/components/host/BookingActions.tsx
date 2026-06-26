"use client";

import { useState } from "react";

export function BookingActions({ bookingId, initialStatus }: { bookingId: string; initialStatus: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [busy, setBusy] = useState(false);

  async function act(action: "confirm" | "decline") {
    setBusy(true);
    try {
      const res = await fetch("/api/host/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, action }),
      });
      const data = await res.json();
      if (res.ok) setStatus(data.status);
    } finally {
      setBusy(false);
    }
  }

  if (status === "confirmed") return <span className="text-sm font-semibold text-emerald-700">✓ Confirmed</span>;
  if (status === "declined") return <span className="text-sm font-semibold text-muted">Declined</span>;

  return (
    <div className="flex gap-2">
      <button disabled={busy} onClick={() => act("confirm")} className="bg-ink text-white text-sm font-semibold px-4 py-2 rounded-full disabled:opacity-50">
        {busy ? "…" : "Confirm"}
      </button>
      <button disabled={busy} onClick={() => act("decline")} className="border border-line text-sm font-semibold px-4 py-2 rounded-full disabled:opacity-50 hover:bg-mist">
        Decline
      </button>
    </div>
  );
}
