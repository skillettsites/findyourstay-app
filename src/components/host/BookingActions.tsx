"use client";

import { useState } from "react";

// Host responds to a request-to-book: accept (with a message + their booking-site
// link) or decline (with a message). In demo mode it doesn't hit the API, it just
// confirms the message "would be sent" to the guest.
export function BookingActions({ bookingId, guestEmail, initialStatus, demo = false }: { bookingId: string; guestEmail: string; initialStatus: string; demo?: boolean }) {
  const [status, setStatus] = useState(initialStatus);
  const [mode, setMode] = useState<null | "confirm" | "decline">(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState("");

  function open(m: "confirm" | "decline") {
    setMode(m);
    setMessage(
      m === "confirm"
        ? "Great news, your dates are available. Here's the link to confirm and pay, and do let me know if you have any questions before you arrive."
        : "Thank you so much for your interest. Sadly those dates aren't available, but please do check back or try different dates."
    );
  }

  async function send() {
    if (!mode) return;
    setBusy(true);
    try {
      if (demo) {
        await new Promise((r) => setTimeout(r, 450));
        setStatus(mode === "confirm" ? "confirmed" : "declined");
        setSent(`${mode === "confirm" ? "Accepted" : "Declined"} — message sent to ${guestEmail}`);
        setMode(null);
      } else {
        const res = await fetch("/api/host/booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId, action: mode, message }),
        });
        const data = await res.json();
        if (res.ok) {
          setStatus(data.status);
          setSent(`${mode === "confirm" ? "Accepted" : "Declined"} — email sent to ${guestEmail}`);
          setMode(null);
        }
      }
    } finally {
      setBusy(false);
    }
  }

  if (sent) return <p className="mt-3 text-sm font-semibold text-emerald-700">✓ {sent}</p>;
  if (status === "confirmed") return <p className="mt-3 text-sm font-semibold text-emerald-700">✓ Confirmed</p>;
  if (status === "declined") return <p className="mt-3 text-sm font-semibold text-muted">Declined</p>;

  return (
    <div className="mt-3 w-full">
      {!mode ? (
        <div className="flex gap-2">
          <button onClick={() => open("confirm")} className="bg-ink text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-ink/90">Accept &amp; send link</button>
          <button onClick={() => open("decline")} className="border border-line text-sm font-semibold px-4 py-2 rounded-full hover:bg-mist">Decline</button>
        </div>
      ) : (
        <div className="border border-line rounded-xl p-3 bg-mist/40">
          <p className="text-xs font-semibold mb-1.5">{mode === "confirm" ? "Accept" : "Decline"} &amp; reply to {guestEmail}</p>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className="w-full border border-line rounded-lg px-3 py-2 text-sm outline-none focus:border-ink bg-white" />
          {mode === "confirm" && <p className="text-xs text-muted mt-1.5">Your booking-site link is added automatically, so they can pay and confirm.</p>}
          <div className="flex gap-2 mt-2">
            <button disabled={busy} onClick={send} className={`text-sm font-semibold px-4 py-2 rounded-full text-white disabled:opacity-50 ${mode === "confirm" ? "bg-brand-gradient" : "bg-ink"}`}>
              {busy ? "Sending…" : mode === "confirm" ? "Accept & send" : "Send decline"}
            </button>
            <button onClick={() => setMode(null)} className="text-sm font-semibold px-4 py-2 rounded-full hover:bg-mist">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
