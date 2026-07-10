import type { Guide } from "../types";

export const guide: Guide = {
  slug: "airbnb-host-fees-explained",
  category: "Commissions & fees",
  title: "Airbnb Host Fees Explained: How Much Does Airbnb Take?",
  h1: "Airbnb host fees explained: how much does Airbnb actually take?",
  description:
    "Airbnb charges most UK hosts a 15.5% service fee in 2026. Here's exactly what gets deducted, how the guest-facing fee inflates your price, and what you keep on direct bookings.",
  dek: "Airbnb's fees look simple on the surface, but there are two different fee models, a guest-facing markup that can cost you bookings, and cleaning-fee quirks worth knowing. Here is the honest 2026 breakdown.",
  keywords: [
    "airbnb host fees",
    "airbnb service fee",
    "how much does airbnb take from hosts",
    "airbnb host service fee 2026",
    "airbnb fees uk",
  ],
  date: "2026-06-30",
  updated: "2026-06-30",
  readMins: 7,
  takeaways: [
    "Most UK/European Airbnb hosts pay a **15.5% host-only service fee** in 2026, deducted straight from payout.",
    "The older **split-fee model** charges hosts ~3% but adds roughly **14% on top of the guest's bill**, making your listing appear more expensive in search.",
    "Cleaning fees are passed through to guests without a service-fee deduction, but they do affect search ranking and guest perception.",
    "Direct bookings cost **0% commission**, only card processing (~1.5% + 20p), so you keep roughly **£98 on every £100** versus ~£84.50 through Airbnb.",
    "Converting even a handful of repeat guests to direct bookings each year can more than cover the cost of your own booking site.",
  ],
  blocks: [
    {
      t: "p",
      text: "If you have ever wondered exactly where your Airbnb payout goes, you are not alone. The fee structure has changed over the years, varies by country and property type, and the way it is displayed to guests can affect your conversion rate without you realising. This guide covers the two current fee models, what is and is not included, and what your numbers look like when guests book direct instead. For a side-by-side comparison with Booking.com and other platforms, see [how booking platform commissions compare](/guides/booking-commission-compared).",
    },

    { t: "h2", text: "The two Airbnb host fee models" },
    {
      t: "p",
      text: "Airbnb runs two distinct pricing structures. Which one applies to you depends on your country, your listing type and, in some cases, a choice you made when setting up the listing.",
    },
    {
      t: "h3",
      text: "Host-only fee (most UK and European hosts in 2026)",
    },
    {
      t: "p",
      text: "Under the **host-only model**, Airbnb charges the host a single service fee of around **15.5%**, taken from your payout before it reaches your bank. The guest sees no separate Airbnb fee on top of your nightly rate. This model is now the default for most hosts in the UK, Europe, and several other markets.",
    },
    {
      t: "callout",
      tone: "info",
      title: "How the deduction works",
      text: "If your nightly rate is £100 and a guest books two nights (£200 total), Airbnb deducts **£31** (15.5%) and pays you **£169**. The guest pays £200 and sees no additional Airbnb fee on their receipt.",
    },
    {
      t: "h3",
      text: "Split-fee model (older accounts, some hosts in certain markets)",
    },
    {
      t: "p",
      text: "Under the **split-fee model**, the host pays only around **3%**, but Airbnb charges the guest an additional **~14% service fee** on top of your advertised price. So a £100 nightly rate becomes roughly £114 to the guest. Your payout is £97 (after the 3% host deduction). The headline number looks better for you as a host, but the inflated guest price makes your listing look more expensive in search and can reduce bookings or lead to reviews commenting on high fees.",
    },

    { t: "h2", text: "Fee comparison: host-only vs split-fee vs direct" },
    {
      t: "p",
      text: "The table below shows what happens on a £200 booking (two nights at £100) under each model, compared with the guest booking direct on your own site.",
    },
    {
      t: "table",
      caption:
        "Illustrative figures on a £200 booking. Card processing assumed at 1.5% + 20p for direct. Rates as of 2026.",
      head: [
        "Model",
        "What guest pays",
        "Airbnb/platform takes",
        "You receive",
      ],
      rows: [
        [
          "**Airbnb host-only fee (~15.5%)**",
          "£200",
          "~£31",
          "~£169",
        ],
        [
          "**Airbnb split fee (~3% host / ~14% guest)**",
          "~£228",
          "~£31 total",
          "~£194",
        ],
        [
          "**Direct booking (your own site)**",
          "£200",
          "~£3.20 (card only)",
          "~£196.80",
        ],
      ],
    },
    {
      t: "p",
      text: "Note that under the split-fee model the total amount extracted by Airbnb is roughly the same; the difference is who writes the cheque. The guest paying more does not mean you keep more.",
    },

    { t: "h2", text: "Cleaning fees and how they interact with Airbnb fees" },
    {
      t: "p",
      text: "Cleaning fees are set by you and passed through to guests. Airbnb does **not** deduct its 15.5% service fee from cleaning fees under the host-only model; you keep 100% of what you charge for cleaning. However, cleaning fees are included in the guest's total when calculating whether your listing appears in price-filtered searches, and high cleaning fees are a well-documented reason guests abandon bookings. A £50 cleaning fee on a one-night stay can effectively double the displayed nightly cost in search results.",
    },
    {
      t: "callout",
      tone: "warn",
      title: "Cleaning fee visibility",
      text: "Airbnb now shows estimated cleaning fees on search cards. A high cleaning fee will suppress your listing in searches filtered by nightly price. If you are getting views but low conversion, your cleaning fee is worth reviewing.",
    },

    { t: "h2", text: "What Airbnb's pricing tools add to the mix" },
    {
      t: "p",
      text: "Airbnb's built-in **Smart Pricing** tool adjusts your nightly rate automatically based on demand signals. It can raise your price on busy weekends, which is useful, but it can also lower your rate in quieter periods further than you might choose. The tool does not change the fee percentage, but hosts who rely on it often find their effective rate per night is lower than expected. If you are not actively managing your pricing, it is worth checking what Smart Pricing has set for the next 90 days.",
    },

    {
      t: "cta",
      title: "See what a commission-free booking site looks like for your property",
      body: "Build a free preview in under a minute. No signup needed.",
      label: "Build my free preview →",
      href: "/host/build",
    },

    {
      t: "h2",
      text: "How Airbnb fees affect your nightly rate strategy",
    },
    {
      t: "p",
      text: "Because Airbnb deducts 15.5% from your payout, many hosts adjust their nightly rate upwards to compensate. If you want to net £85 per night, you need to list at around £100.60. But raising your rate to cover platform fees means you are priced higher than a host who absorbs the fee, which affects your ranking and click-through rate in search. It is a circular problem with no clean answer on the OTA itself. The cleaner solution, over time, is to move repeat guests to a direct channel where no such adjustment is needed.",
    },
    {
      t: "p",
      text: "The practical comparison with direct bookings is covered in more depth in [direct booking vs Airbnb: which is better for hosts](/guides/direct-booking-vs-airbnb).",
    },

    { t: "h2", text: "What it costs to take bookings on your own site" },
    {
      t: "p",
      text: "Direct bookings are not free, but they are close. The costs are predictable and do not scale with your nightly rate:",
    },
    {
      t: "ul",
      items: [
        "**Card processing** via Stripe: approximately **1.5% + 20p** per transaction for UK/EU cards. On a £200 booking, that is around £3.20.",
        "**A flat annual listing fee** for your booking site, not a per-booking commission. The fee is the same whether you take one booking or one hundred.",
        "**Payment goes straight to your account** at the time of booking, with no platform holding your money.",
      ],
    },
    {
      t: "p",
      text: "On a £200 booking you keep roughly £196.80 direct, versus £169 through Airbnb. That £27.80 difference is real money on every booking you move across. On 20 direct bookings a year that is over £550 in additional income, often more than enough to cover an annual booking-site fee many times over. For a full breakdown of how to start encouraging guests to come directly, see [how to get direct bookings from your existing guests](/guides/how-to-get-direct-bookings).",
    },

    {
      t: "stats",
      items: [
        { value: "15.5%", label: "Airbnb host-only service fee (UK 2026)" },
        { value: "~£31", label: "taken by Airbnb on a £200 booking" },
        { value: "~1.5%", label: "card processing cost on a direct booking" },
      ],
    },

    {
      t: "callout",
      tone: "win",
      title: "The maths in plain English",
      text: "One direct booking of £200 saves you around £28 in Airbnb fees. A basic direct-booking site costs around **£79 to £149 per year**. That means **three direct bookings** can cover a year's worth of your own site. Every booking after that is clear gain.",
    },

    { t: "h2", text: "Should you leave Airbnb?" },
    {
      t: "p",
      text: "For most independent hosts, the honest answer is no, not entirely, and certainly not yet. Airbnb's biggest value is **discovery**: guests who have never heard of your property can find it through search, reviews and the platform's brand. Abandoning that overnight means losing a real acquisition channel.",
    },
    {
      t: "p",
      text: "The practical approach is to treat Airbnb as a top-of-funnel tool: let it win the first booking, then convert returning guests and word-of-mouth referrals to book direct. A card in every room, a mention at checkout, and a working direct-booking website with your own domain is all you need to start shifting the balance. Over 12 to 24 months the fee savings compound. The strategy is laid out step by step in [how to reduce OTA commission without leaving the platforms](/guides/how-to-reduce-ota-commission).",
    },

    {
      t: "cta",
      title: "Start taking direct bookings",
      body: "FindYourStay builds and hosts a booking website on your own domain with payments straight to you. Annual plans from £79. One direct booking typically covers the year.",
      label: "See how it works →",
      href: "/host",
    },
  ],
  faqs: [
    {
      q: "How much does Airbnb take from hosts in the UK in 2026?",
      a: "Most UK hosts are on Airbnb's host-only service fee model, which is around 15.5% of the booking subtotal. This is deducted from your payout before it is transferred to your bank account. The guest does not pay a separate Airbnb fee on top of your price.",
    },
    {
      q: "What is the difference between the Airbnb host-only fee and the split fee?",
      a: "Under the host-only fee, you pay ~15.5% and the guest pays your advertised price with no visible surcharge. Under the older split-fee model, you pay ~3% but the guest pays an extra ~14% service fee on top of your nightly rate. The total taken by Airbnb is similar either way; the split-fee model just distributes the cost differently between host and guest.",
    },
    {
      q: "Does Airbnb charge a fee on cleaning fees?",
      a: "No. Under the host-only model, Airbnb does not deduct its 15.5% service fee from the cleaning fee you set. You keep the full cleaning charge. However, cleaning fees are included in the total price guests see in search results, so a high cleaning fee can still reduce your booking rate.",
    },
    {
      q: "How much do I keep if a guest books directly instead of through Airbnb?",
      a: "On a £200 booking, you keep roughly £196.80 direct (after card processing at ~1.5% + 20p), compared to around £169 through Airbnb at 15.5%. That is approximately £28 more per booking in your pocket, with no percentage skimmed by a platform.",
    },
  ],
  related: [
    "booking-commission-compared",
    "direct-booking-vs-airbnb",
    "how-to-get-direct-bookings",
  ],
};
