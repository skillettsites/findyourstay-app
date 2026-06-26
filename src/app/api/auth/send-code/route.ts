import { NextResponse } from "next/server";
import { sb } from "@/lib/sb";
import { sendEmail, shell } from "@/lib/email";

export const dynamic = "force-dynamic";

// Sends a 6-digit sign-in code. We create the auth user if needed, then use the
// admin API to mint a one-time code and deliver it ourselves via Resend (branded,
// reliable) rather than Supabase's rate-limited built-in email.
export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const clean = String(email ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }

    // Make sure the user exists so a magiclink/OTP can be generated for them.
    await sb.auth.admin.createUser({ email: clean, email_confirm: true }).catch(() => {});

    const { data, error } = await sb.auth.admin.generateLink({ type: "magiclink", email: clean });
    const otp = data?.properties?.email_otp;
    if (error || !otp) {
      return NextResponse.json({ error: "Could not start sign in. Try again." }, { status: 500 });
    }

    const sent = await sendEmail({
      to: clean,
      subject: `${otp} is your FindYourStay sign-in code`,
      html: shell(`
        <h1 style="font-size:20px;margin:0 0 10px">Your sign-in code</h1>
        <p style="color:#5c5853;margin:0 0 18px">Enter this code to sign in to FindYourStay. It expires in about an hour.</p>
        <div style="font-size:34px;font-weight:800;letter-spacing:8px;background:#fdeef2;color:#e8385a;border-radius:14px;text-align:center;padding:18px 0">${otp}</div>
        <p style="color:#8a8580;font-size:13px;margin:18px 0 0">If you didn't request this, you can ignore this email.</p>
      `),
    });

    // Even if the email send fails we don't leak why; return ok so the UI moves
    // to the code step, but surface a soft warning for diagnostics.
    return NextResponse.json({ ok: true, delivered: sent });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
