"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { supabaseBrowser } from "@/lib/supabase-browser";

export const dynamic = "force-dynamic";

const inputCls = "w-full border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-ink";
const btnCls = "w-full bg-brand-gradient bg-brand-gradient-hover disabled:opacity-50 text-white font-semibold py-3 rounded-full shadow-glow transition-transform active:scale-95";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/host/dashboard";

  // mode: how they're signing in. code mode has its own sub-steps.
  const [mode, setMode] = useState<"password" | "code">("password");
  const [codeStep, setCodeStep] = useState<"email" | "code" | "setpw">("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  const [resetPw, setResetPw] = useState(false); // forgot-password flow → force a new password after the code
  const reset = (m: "password" | "code", asReset = false) => { setMode(m); setCodeStep("email"); setResetPw(asReset); setError(""); setNote(""); setPassword(""); setPassword2(""); setCode(""); };
  const done = () => { router.push(next); router.refresh(); };

  // --- Password sign-in (returning hosts) ---
  async function signInPassword(e?: React.FormEvent) {
    e?.preventDefault();
    setError(""); setBusy(true);
    try {
      const supabase = supabaseBrowser();
      const { error: sErr } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
      if (sErr) throw new Error("That email and password don't match. Try again, or sign in with a code.");
      done();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setBusy(false);
    }
  }

  // --- Email a one-time code (sign up, or fallback / forgot password) ---
  async function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    setError(""); setNote(""); setBusy(true);
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCodeStep("code");
      setNote(`We sent a sign-in code to ${email.trim().toLowerCase()}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the code.");
    } finally { setBusy(false); }
  }

  // --- Verify the code. New users go on to set a password; returning ones are in. ---
  async function verifyCode(e?: React.FormEvent) {
    e?.preventDefault();
    setError(""); setBusy(true);
    try {
      const supabase = supabaseBrowser();
      const { data, error: vErr } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: code.trim(), type: "email" });
      if (vErr) throw new Error("That code didn't work. Check it and try again.");
      const hasPassword = Boolean(data.user?.user_metadata?.has_password);
      // Skip the set-password step only for a plain code sign-in by someone who
      // already has a password. New users and the forgot-password flow set one.
      if (hasPassword && !resetPw) { done(); return; }
      setCodeStep("setpw");
      setNote(resetPw ? "Verified. Now choose a new password." : "You're verified. Set a password so you can log in faster next time.");
      setBusy(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
      setBusy(false);
    }
  }

  // --- Set + confirm password, then finish ---
  async function setPasswordAndFinish(e?: React.FormEvent) {
    e?.preventDefault();
    setError("");
    if (password.length < 8) { setError("Use at least 8 characters."); return; }
    if (password !== password2) { setError("The passwords don't match."); return; }
    setBusy(true);
    try {
      const supabase = supabaseBrowser();
      const { error: uErr } = await supabase.auth.updateUser({ password, data: { has_password: true } });
      if (uErr) throw new Error(uErr.message || "Could not set your password.");
      done();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not set your password.");
      setBusy(false);
    }
  }

  return (
    <>
      <Header showSearch={false} />
      <main className="mx-auto max-w-md w-full px-4 sm:px-6 py-12 sm:py-16">
        <div className="bg-white border border-line rounded-2xl shadow-card p-7">
          {/* ---------- PASSWORD MODE (default for returning hosts) ---------- */}
          {mode === "password" && (
            <>
              <h1 className="text-2xl font-display font-bold">Log in</h1>
              <p className="text-muted mt-1 text-sm">For hosts. List a stay, manage enquiries and bookings.</p>
              <form onSubmit={signInPassword} className="mt-6 space-y-3">
                <label className="block">
                  <span className="block text-sm font-semibold mb-1.5">Email</span>
                  <input type="email" required value={email} autoFocus onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className={inputCls} />
                </label>
                <label className="block">
                  <span className="block text-sm font-semibold mb-1.5">Password</span>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" className={inputCls} />
                </label>
                <div className="text-right">
                  <button type="button" onClick={() => reset("code", true)} className="text-xs font-semibold text-muted hover:text-ink">Forgot your password?</button>
                </div>
                <button disabled={busy} className={btnCls}>{busy ? "Logging in…" : "Log in"}</button>
              </form>
              <button type="button" onClick={() => reset("code")} className="w-full text-sm font-semibold text-brand py-2 mt-2">
                Sign in with a code instead
              </button>
              <p className="text-center text-sm text-muted mt-2">
                New to FindYourStay?{" "}
                <button type="button" onClick={() => reset("code")} className="font-semibold text-ink hover:underline">Sign up</button>
              </p>
            </>
          )}

          {/* ---------- CODE MODE: email -> code -> set password ---------- */}
          {mode === "code" && codeStep === "email" && (
            <>
              <h1 className="text-2xl font-display font-bold">{resetPw ? "Reset your password" : "Sign in with a code"}</h1>
              <p className="text-muted mt-1 text-sm">{resetPw ? "We'll email you a one-time code to verify it's you, then you can set a new password." : "We'll email you a one-time code. No password needed to start."}</p>
              <form onSubmit={sendCode} className="mt-6 space-y-3">
                <label className="block">
                  <span className="block text-sm font-semibold mb-1.5">Email</span>
                  <input type="email" required value={email} autoFocus onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className={inputCls} />
                </label>
                <button disabled={busy} className={btnCls}>{busy ? "Sending…" : "Email me a code"}</button>
              </form>
              <button type="button" onClick={() => reset("password")} className="w-full text-sm font-semibold text-muted py-2 mt-2">
                ← Back to password login
              </button>
            </>
          )}

          {mode === "code" && codeStep === "code" && (
            <>
              <h1 className="text-2xl font-display font-bold">Enter your code</h1>
              <form onSubmit={verifyCode} className="mt-6 space-y-3">
                {note && <p className="text-sm text-emerald-700">{note}</p>}
                <label className="block">
                  <span className="block text-sm font-semibold mb-1.5">Sign-in code</span>
                  <input inputMode="numeric" required value={code} autoFocus
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
                    placeholder="Enter the code from your email"
                    className={`${inputCls} text-lg tracking-[0.3em] text-center`} />
                </label>
                <button disabled={busy || code.length < 6} className={btnCls}>{busy ? "Verifying…" : "Verify & continue"}</button>
                <button type="button" onClick={() => { setCodeStep("email"); setCode(""); setError(""); }} className="w-full text-sm font-semibold text-muted py-1">Use a different email</button>
                <button type="button" onClick={() => sendCode()} className="w-full text-sm font-semibold text-brand">Resend code</button>
              </form>
            </>
          )}

          {mode === "code" && codeStep === "setpw" && (
            <>
              <h1 className="text-2xl font-display font-bold">{resetPw ? "Set a new password" : "Set a password"}</h1>
              <p className="text-muted mt-1 text-sm">{resetPw ? "Choose a new password for your account." : "So you can log in with just a password next time."}</p>
              <form onSubmit={setPasswordAndFinish} className="mt-6 space-y-3">
                {note && <p className="text-sm text-emerald-700">{note}</p>}
                <label className="block">
                  <span className="block text-sm font-semibold mb-1.5">Password</span>
                  <input type="password" required value={password} autoFocus onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" className={inputCls} />
                </label>
                <label className="block">
                  <span className="block text-sm font-semibold mb-1.5">Confirm password</span>
                  <input type="password" required value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="Re-enter your password" className={inputCls} />
                </label>
                <button disabled={busy} className={btnCls}>{busy ? "Saving…" : resetPw ? "Save new password & log in" : "Set password & continue"}</button>
              </form>
            </>
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
