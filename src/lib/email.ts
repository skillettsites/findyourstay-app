// Transactional email via Resend. findyourstay.com is a verified Resend sending
// domain. Best-effort: never throws to the caller (a failed email must not break
// an enquiry, booking or signup).
import "server-only";
import { Resend } from "resend";

const KEY = (process.env.RESEND_API_KEY || "").replace(/\\n$/, "").trim();
const FROM = "FindYourStay <hello@findyourstay.com>";

export function emailEnabled(): boolean {
  return KEY.length > 0;
}

export async function sendEmail(opts: { to: string; subject: string; html: string; replyTo?: string }): Promise<boolean> {
  if (!KEY) return false;
  try {
    const resend = new Resend(KEY);
    const { error } = await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
    });
    return !error;
  } catch {
    return false;
  }
}

// Shared shell so every email looks consistent and on-brand.
export function shell(body: string): string {
  return `<!doctype html><html><body style="margin:0;background:#f6f5f3;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1f1d1b">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px">
    <div style="font-weight:800;font-size:20px;color:#e8385a;margin-bottom:20px">findyourstay</div>
    <div style="background:#fff;border:1px solid #ececec;border-radius:18px;padding:28px">${body}</div>
    <p style="color:#8a8580;font-size:12px;margin-top:20px">FindYourStay is a directory of independent stays. We are not a party to any booking. You pay the owner directly.</p>
  </div></body></html>`;
}
