import type { Guide } from "../types";

export const guide: Guide = {
  slug: "booking-com-commission-calculator",
  category: "Commissions & fees",
  title: "Booking.com Commission Calculator UK (2026): What You Really Pay",
  h1: "Booking.com commission calculator (UK 2026): what you really pay",
  description:
    "Free UK calculator for Booking.com hosts: base commission plus Preferred Partner and Payments by Booking.com, see the real percentage and annual cost, and what you'd keep direct.",
  dek: "Booking.com's commission isn't just the headline 15%. Preferred Partner, payment processing and Genius discounts stack on top. Here's the real number, with a calculator to see yours.",
  keywords: [
    "booking.com commission calculator", "how much does booking.com charge hosts",
    "booking.com commission uk", "booking.com preferred partner cost", "booking.com fees calculator",
  ],
  date: "2026-07-07",
  updated: "2026-07-07",
  readMins: 5,
  answerFirst:
    "Booking.com's base commission in the UK is typically **15%**, but it stacks: **Preferred Partner** adds ~2%, **Payments by Booking.com** adds ~1.1%, and a **Genius** discount hands guests another 10-20% off your rate. Many hosts effectively lose **17-20%+** per booking. On £40,000 of stays that's £6,800-8,000 a year. Use the calculator to see yours.",
  takeaways: [
    "**Base commission is ~15%** in the UK (10-25% globally).",
    "**Preferred Partner** adds roughly **+2%** for better ranking.",
    "**Payments by Booking.com** adds roughly **+1.1%** processing.",
    "**Genius** isn't commission but discounts your rate a further **10-20%** to guests.",
    "Direct bookings cost **0% commission**, the calculator shows the annual gap.",
  ],
  blocks: [
    { t: "p", text: "Booking.com quotes a tidy commission percentage when you sign up, but the number you actually lose is usually higher, because the levers that make Booking.com work (visibility, payment handling, Genius discounts) each shave a bit more off. The calculator below lets you switch those extras on and off so you can see your real effective rate and the annual cost in pounds." },

    { t: "calculator", variant: "bookingcom" },

    { t: "h2", text: "What stacks on top of the base commission", id: "the-extras" },
    { t: "p", text: "Booking.com's base commission is typically **15%** in the UK. Then the add-ons:" },
    { t: "ul", items: [
      "**Preferred Partner**, roughly **+2%** commission in exchange for a higher ranking and a thumbs-up badge. Most hosts feel they have to opt in to compete.",
      "**Payments by Booking.com**, Booking.com collects the guest's payment and charges roughly **1.1%** to process it.",
      "**Visibility Booster**, a bid-based programme where you offer extra commission for a temporary ranking boost.",
      "**Genius**, not commission, but a loyalty scheme that discounts your rate **10-20%** to eligible guests; you keep less on the sale even before commission.",
    ] },
    { t: "callout", tone: "warn", title: "How 15% becomes 20%+", text: "Base 15% + Preferred Partner 2% + Payments 1.1% ≈ **18.1%** in commission alone, before a Genius guest also takes 10% off your nightly rate. It's easy to be handing over a fifth of the booking value without realising." },

    { t: "h2", text: "Does Booking.com charge commission on cancellations?" },
    { t: "p", text: "If a guest cancels within your policy (free cancellation), there's no commission, no revenue, no fee. If a guest is charged a cancellation fee or no-shows under a non-refundable or partial-refund policy, Booking.com generally takes commission on the amount you're paid, because it's earned revenue. You can also mark reservations as cancelled or no-show in the Extranet to avoid being charged commission on money you never received." },

    { t: "savings", price: 100, bookingsPerYear: 55, otaRate: 0.18, ota: "Booking.com all-in" },

    { t: "h2", text: "What the same bookings keep you direct" },
    { t: "p", text: "A direct booking on your own site has no commission and no Genius discount, just card processing of about **1.5% + 20p** and a flat annual site fee. On a £100 booking that's ~£1.85 versus Booking.com's ~£18 all-in. Across a year, the difference is typically the price of the site many times over, which is exactly why hosts funnel repeat and word-of-mouth guests to direct and keep Booking.com for pure discovery." },

    { t: "cta", title: "Keep what Booking.com is taking", body: "Preview your own commission-free booking site, built and hosted for you on your own domain. Free, no signup.", label: "Build my free preview →", href: "/host/build" },
  ],
  faqs: [
    { q: "How much commission does Booking.com charge hosts in the UK?", a: "The base commission is typically 15% in the UK (10-25% globally). Preferred Partner adds around 2% and Payments by Booking.com around 1.1%, so many hosts effectively pay 17-20% or more per booking." },
    { q: "Is Booking.com Genius worth it?", a: "Genius can bring more bookings by discounting your rate 10-20% to loyal guests, but you keep less on each sale and still pay commission on top. Whether it pays off depends on how much incremental demand it genuinely adds versus discounting guests who'd have booked anyway." },
    { q: "Does Booking.com take commission on cancellations and no-shows?", a: "Not on free cancellations within policy (no revenue, no fee). If a guest is charged a cancellation fee or no-show fee, Booking.com generally takes commission on what you're paid. Mark genuine no-shows in the Extranet so you're not charged on money you never received." },
    { q: "How do I calculate my real Booking.com cost?", a: "Add the base commission plus any Preferred Partner (+2%) and Payments by Booking.com (+1.1%) you use, then multiply by your booking value and annual bookings. The calculator above does this and compares it to booking direct at 0% commission." },
  ],
  related: ["how-much-commission-booking-com", "ota-commission-calculator", "booking-commission-compared"],
};
