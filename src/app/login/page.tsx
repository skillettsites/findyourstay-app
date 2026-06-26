"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { supabaseBrowser } from "@/lib/supabase-browser";

export const dynamic = "force-dynamic";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/host/dashboard";

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  async function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    setError(""); setNote(""); setBusy(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep("code");
      setNote(`We sent a sign-in code to ${email}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the code.");
    } finally {
      setBusy(false);
    }
  }

  async function verify(e?: React.FormEvent) {
    e?.preventDefault();
    setError(""); setBusy(true);
    try {
      const supabase = supabaseBrowser();
      const { error: vErr } = await supabase.auth.verifyOtp({ email, token: code.trim(), type: "email" });
      if (vErr) throw new Error("That code didn't work. Check it and try again.");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
      setBusy(false);
    }
  }

  return (
    <>
      <Header showSearch={false} />
      <main className="mx-auto max-w-md w-full px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white border border-line rounded-2xl shadow-card p-7">
          <h1 className="text-2xl font-display font-bold">Log in or sign up</h1>
          <p className="text-muted mt-1 text-sm">
            For hosts. List a stay, manage enquiries and bookings. No password needed.
          </p>

          {step === "email" ? (
            <form onSubmit={sendCode} className="mt-6 space-y-3">
              <label className="block">
                <span className="block text-sm font-semibold mb-1.5">Email</span>
                <input
                  type="email" required value={email} autoFocus
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-ink"
                />
              </label>
              <button disabled={busy} className="w-full bg-brand-gradient bg-brand-gradient-hover disabled:opacity-50 text-white font-semibold py-3 rounded-full shadow-glow transition-transform active:scale-95">
                {busy ? "Sending…" : "Email me a code"}
              </button>
            </form>
          ) : (
            <form onSubmit={verify} className="mt-6 space-y-3">
              {note && <p className="text-sm text-emerald-700">{note}</p>}
              <label className="block">
                <span className="block text-sm font-semibold mb-1.5">Sign-in code</span>
                <input
                  inputMode="numeric" required value={code} autoFocus
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  placeholder="Enter the code from your email"
                  className="w-full border border-line rounded-xl px-4 py-3 text-lg tracking-[0.3em] text-center outline-none focus:border-ink"
                />
              </label>
              <button disabled={busy || code.length < 6} className="w-full bg-brand-gradient bg-brand-gradient-hover disabled:opacity-50 text-white font-semibold py-3 rounded-full shadow-glow transition-transform active:scale-95">
                {busy ? "Verifying…" : "Verify & continue"}
              </button>
              <button type="button" onClick={() => { setStep("email"); setCode(""); setError(""); }} className="w-full text-sm font-semibold text-muted py-1">
                Use a different email
              </button>
              <button type="button" onClick={() => sendCode()} className="w-full text-sm font-semibold text-brand">
                Resend code
              </button>
            </form>
          )}

          {error && <p className="text-brand text-sm mt-3">{error}</p>}
        </div>
        <p className="text-center text-xs text-muted mt-5">
          Just browsing? <Link href="/s" className="font-semibold text-ink hover:underline">Explore stays</Link> — no account needed.
        </p>
      </main>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-screen" />}>
      <LoginInner />
    </Suspense>
  );
}
