import type { Guide } from "../types";

export const guide: Guide = {
  slug: "ota-commission-calculator",
  category: "Commissions & fees",
  title: "OTA Commission Calculator (UK 2026): How Much You Lose to Airbnb & Booking.com",
  h1: "OTA commission calculator: how much you're really losing to Airbnb & Booking.com",
  description:
    "Free UK calculator: enter your nightly rate and bookings to see exactly how much commission Airbnb, Booking.com, Vrbo and Expedia take from you each year — and what you'd keep booking direct.",
  dek: "Commission is easy to ignore because it's deducted before you're ever paid. Put your real numbers in below and see the annual figure in pounds — then what the same bookings would keep you direct.",
  keywords: [
    "ota commission calculator", "airbnb fees calculator uk", "booking.com commission calculator",
    "how much commission do i pay airbnb", "ota commission cost", "commission calculator hosts uk",
  ],
  date: "2026-07-07",
  updated: "2026-07-07",
  readMins: 5,
  answerFirst:
    "On a typical UK short-let — £95 a night, 60 bookings a year, ~15.5% commission — you hand roughly **£880 a year** to the platform. The same bookings taken direct cost about 1.5% in card fees, so you'd keep around **£800 of that back**. Use the calculator below to see your own figure.",
  takeaways: [
    "Commission is charged on the **whole booking value** and deducted before payout, so it's easy to underestimate.",
    "Typical 2026 UK rates: **Airbnb ~15.5%**, **Booking.com ~15% (10-25%)**, **Vrbo ~8%**, **Expedia 15-30%**.",
    "Direct bookings carry **0% commission** — only ~1.5% + 20p card processing.",
    "For most hosts the annual commission bill runs into **hundreds or thousands of pounds**.",
    "One year's commission usually dwarfs the flat annual cost of your own booking site.",
  ],
  blocks: [
    { t: "p", text: "You never write Airbnb or Booking.com a cheque, so their commission rarely feels real — it's quietly skimmed off each payout. This calculator makes it concrete. Enter your average nightly rate, how many bookings you take a year, and your platform, and you'll see the annual figure in pounds, plus what those same bookings would keep you if guests booked direct." },

    { t: "calculator", variant: "ota" },

    { t: "h2", text: "How OTA commission is actually calculated", id: "how-its-calculated" },
    { t: "p", text: "Commission is a percentage of the **total booking value** — usually the nightly rate plus any cleaning fee — taken before the money reaches you. The headline rate is only part of the story: visibility programmes, payment processing and guest-facing fees all move the real number." },
    {
      t: "table",
      caption: "Typical 2026 UK/European host commission. Your exact rate varies by country, property type and how hard you use each platform's paid-visibility tools.",
      head: ["Platform", "Typical host rate", "The catch"],
      rows: [
        ["**Airbnb** (host-only fee)", "~15.5%", "Non-VAT-registered UK hosts pay 20% VAT on the fee, so it's really ~18.6%"],
        ["**Booking.com**", "~15% (10-25%)", "Preferred Partner +2%, Payments by Booking.com ~1.1% on top"],
        ["**Vrbo / Expedia** (pay-per-booking)", "~8%", "5% commission + 3% payment processing"],
        ["**Expedia** (hotel-style)", "15-30%", "Wider range, market-dependent"],
        ["**Your own site (direct)**", "**0% commission**", "Just ~1.5% + 20p card processing + a flat annual fee"],
      ],
    },
    { t: "callout", tone: "info", title: "The Airbnb VAT trap", text: "If you're **not VAT registered** (most small UK hosts), Airbnb adds 20% VAT to its 15.5% service fee — so your effective rate is closer to **18.6%**. The calculator above lets you toggle this." },

    { t: "savings", price: 95, bookingsPerYear: 60, otaRate: 0.155, ota: "Airbnb" },

    { t: "h2", text: "Why the annual number matters more than the per-booking one" },
    { t: "p", text: "£15 off a £100 booking feels survivable. £900 a year — the same thing, annualised — is the cost of a short holiday, a big marketing push, or simply money you keep. Because the percentage scales with your nightly rate, the more successful you are, the more commission costs you. That's the structural reason hosts move as many repeat and referred guests as possible onto their own direct channel, where the cost is a flat fee instead of an ever-growing cut." },

    { t: "cta", title: "Keep the number the calculator just showed you", body: "See what your own commission-free booking site would look like — built and hosted for you on your own domain. Free to preview, no signup.", label: "Build my free preview →", href: "/host/build" },
  ],
  faqs: [
    { q: "How much commission does Airbnb take from hosts in the UK?", a: "Most UK hosts pay Airbnb's host-only service fee of around 15.5%, deducted from the payout. If you're not VAT registered, Airbnb adds 20% VAT to that fee, making the effective rate roughly 18.6%." },
    { q: "How do I calculate how much I'm losing to OTA commission?", a: "Multiply your average booking value by your commission rate, then by your bookings per year. For example £95 × 15.5% × 60 bookings ≈ £880 a year. The calculator on this page does it for you and compares it to booking direct." },
    { q: "Is there a calculator for Booking.com commission?", a: "Yes — set the platform to Booking.com in the calculator above and adjust for extras like Preferred Partner (+2%) and Payments by Booking.com (~1.1%). Booking.com's base rate is typically 15% in the UK but ranges from 10-25%." },
    { q: "How much would I save by booking direct?", a: "Direct bookings carry 0% platform commission — only about 1.5% + 20p card processing. On a typical UK host's volume that's usually hundreds to thousands of pounds a year kept, minus a flat annual fee for your booking site." },
  ],
  related: ["how-much-hosts-lose-to-commission", "airbnb-host-fee-calculator", "booking-commission-compared"],
};
