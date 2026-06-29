"use client";

// Host's own Stripe / PayPal payment links. Guests pay the host directly through
// these; FindYourStay never touches the money. Shared by the wizard + editor.
export function PaymentLinksFields({
  stripe,
  paypal,
  onStripe,
  onPaypal,
}: {
  stripe: string;
  paypal: string;
  onStripe: (v: string) => void;
  onPaypal: (v: string) => void;
}) {
  const input = "w-full border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-ink bg-white";
  return (
    <div>
      <p className="text-sm font-semibold">How do guests pay you?</p>
      <p className="text-xs text-muted mt-1 mb-3">
        Add your own Stripe and/or PayPal link. Guests pay you directly, straight into your account. We never touch the
        money and take no commission. You can add or change these any time.
      </p>

      <label className="block mb-3">
        <span className="flex items-center gap-1.5 text-sm font-medium mb-1.5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-[#635bff]"><path d="M13.5 9.6c0-.7.6-1 1.5-1 1.3 0 3 .4 4.3 1.1V5.5C17.8 5 16.4 4.8 15 4.8c-3.4 0-5.7 1.8-5.7 4.8 0 4.6 6.3 3.9 6.3 5.9 0 .8-.7 1.1-1.7 1.1-1.5 0-3.4-.6-4.9-1.4v4.3c1.6.7 3.3 1 4.9 1 3.5 0 5.9-1.7 5.9-4.8 0-5-6.3-4.1-6.3-6.1Z" /></svg>
          Stripe payment link <span className="text-muted font-normal">(optional)</span>
        </span>
        <input value={stripe} onChange={(e) => onStripe(e.target.value)} placeholder="https://buy.stripe.com/..." className={input} />
      </label>

      <label className="block mb-3">
        <span className="flex items-center gap-1.5 text-sm font-medium mb-1.5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-[#003087]"><path d="M7 21H4.5l3-15h6.3c2.9 0 4.7 1.5 4.2 4.3-.5 3-2.8 4.4-5.8 4.4H9.8L9 21Zm3-7.8h1.6c1.3 0 2.3-.6 2.5-2 .2-1-.4-1.6-1.6-1.6h-1.4l-1.1 3.6Z" /></svg>
          PayPal.Me link <span className="text-muted font-normal">(optional)</span>
        </span>
        <input value={paypal} onChange={(e) => onPaypal(e.target.value)} placeholder="https://paypal.me/yourname" className={input} />
      </label>

      <details className="rounded-xl border border-line bg-mist/60 text-sm">
        <summary className="cursor-pointer font-semibold px-4 py-3 select-none">How do I get these links? (about 2 minutes)</summary>
        <div className="px-4 pb-4 space-y-4 text-muted">
          <div>
            <p className="font-semibold text-ink">Stripe</p>
            <ol className="list-decimal ml-4 mt-1 space-y-0.5">
              <li>Create a free account at <a href="https://dashboard.stripe.com/register" target="_blank" rel="noreferrer" className="text-brand font-medium">stripe.com</a> (you&apos;ll add your bank details so payouts reach you).</li>
              <li>Go to <a href="https://dashboard.stripe.com/payment-links" target="_blank" rel="noreferrer" className="text-brand font-medium">Payment Links</a> → New, set a price (a deposit works well), and create it.</li>
              <li>Copy the link (it starts with <span className="font-mono text-ink">buy.stripe.com</span>) and paste it above.</li>
            </ol>
          </div>
          <div>
            <p className="font-semibold text-ink">PayPal</p>
            <ol className="list-decimal ml-4 mt-1 space-y-0.5">
              <li>Go to <a href="https://www.paypal.com/paypalme/" target="_blank" rel="noreferrer" className="text-brand font-medium">paypal.com/paypalme</a> and claim your PayPal.Me link.</li>
              <li>Copy it (<span className="font-mono text-ink">paypal.me/yourname</span>) and paste it above.</li>
            </ol>
          </div>
          <p className="text-xs">Tip: a fixed deposit (say 20%) secures the booking, and you take the balance on arrival. The money goes straight to you, we&apos;re never in the middle.</p>
        </div>
      </details>
    </div>
  );
}
