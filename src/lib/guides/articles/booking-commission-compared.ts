import type { Guide } from "../types";

export const guide: Guide = {
  slug: "booking-commission-compared",
  category: "Commissions & fees",
  title: "Booking Commission Compared 2026: Booking.com vs Airbnb vs Direct",
  h1: "Booking platform commission compared (2026): how much each one really takes",
  description:
    "Booking.com, Airbnb, Vrbo and Expedia commission rates compared for 2026 — what you actually keep on a £100 booking, and why taking bookings direct wins.",
  dek: "Every booking through an OTA quietly skims 15–25% off the top. Here's exactly what Booking.com, Airbnb, Vrbo and Expedia charge hosts in 2026 — and what you keep when guests book direct.",
  keywords: [
    "booking.com commission", "airbnb host fees", "vrbo fees", "ota commission rates",
    "booking platform commission compared", "how much does booking.com take", "direct booking",
  ],
  date: "2026-06-30",
  updated: "2026-06-30",
  readMins: 8,
  takeaways: [
    "**Booking.com** takes around **15% on average** (10–25% depending on visibility settings and country).",
    "**Airbnb** charges most UK hosts a **15.5% host-only service fee** in 2026.",
    "**Vrbo/Expedia** run **8–30%** depending on the model you pick.",
    "Booking **direct on your own site** costs **0% commission** — just card processing (~1.5% + 20p) and a flat annual fee.",
    "On a £100 booking you keep roughly **£85 via Booking.com vs ~£98 direct** — about **£13 per booking** back in your pocket.",
  ],
  blocks: [
    { t: "p", text: "Online travel agents (OTAs) like Booking.com and Airbnb bring you guests — but they charge for it, and the number is bigger than most hosts realise once you add visibility boosts, payment fees and the guest-facing markup. Here's the honest 2026 breakdown, platform by platform, and what changes when a guest books directly with you instead." },

    { t: "h2", text: "Commission rates at a glance (2026)" },
    { t: "p", text: "These are typical UK/European rates. Your exact number varies by country, property type, season and how hard you lean on each platform's paid-visibility programmes." },
    {
      t: "table",
      caption: "Typical 2026 host costs. \"What you keep\" is on a headline £100 booking, before your own cleaning/running costs.",
      head: ["Platform", "Host cost", "How it's charged", "You keep on £100"],
      rows: [
        ["**Booking.com**", "~15% (10–25%)", "Commission on the full stay; +2–5% for Preferred/visibility programmes", "~£85"],
        ["**Airbnb** (host-only fee)", "15.5%", "Single service fee taken from your payout", "~£84.50"],
        ["**Airbnb** (split fee)", "~3% host + ~14% guest", "Lower host fee, but the guest pays ~14% more", "~£97 (guest pays ~£114)"],
        ["**Vrbo / Expedia (pay-per-booking)**", "~8%", "5% commission + 3% payment processing", "~£92"],
        ["**Expedia**", "15–30%", "Commission on the full stay, varies by market", "~£70–85"],
        ["**Your own site (direct)**", "**0% commission**", "Card processing ~1.5% + 20p; flat annual fee", "**~£98**"],
      ],
    },
    { t: "callout", tone: "win", title: "The headline", text: "On the same £100 booking, an OTA keeps roughly **£15**. Direct keeps roughly **£2**. Across a year of bookings that gap is usually the difference between a quiet month and a good one." },

    { t: "cta", title: "See what your own booking site would look like", body: "Pick a style, add a few details, and preview your commission-free site in under a minute. No signup.", label: "Build my free preview →", href: "/host/build" },

    { t: "h2", text: "Booking.com commission: ~15%, but watch the add-ons" },
    { t: "p", text: "Booking.com's base commission is typically **15%** in the UK, but it ranges from **10% to 25%** worldwide. The catch is visibility: the **Preferred Partner** and **Visibility Booster** programmes add a few extra percentage points in exchange for ranking higher in search. Many hosts end up effectively paying 17–20% once they opt in to stay competitive." },
    { t: "p", text: "Booking.com also increasingly handles guest payments, so the commission is deducted before you're paid out — it never feels like writing a cheque, which is exactly why it's easy to ignore." },

    { t: "h2", text: "Airbnb host fees: 15.5% for most hosts in 2026" },
    { t: "p", text: "Airbnb runs two models. The **host-only fee** (now standard for most UK and European hosts) is around **15.5%**, taken entirely from your payout — the guest sees no separate service fee. The older **split-fee** model charges the host only ~3% but adds a ~14% service fee onto the guest's total." },
    { t: "callout", tone: "info", text: "Split fee looks cheaper for you, but it makes your listing **14% more expensive to the guest** — which quietly costs you bookings and reviews mentioning \"pricey fees\". Either way, Airbnb takes its cut; it's just a question of who sees it." },

    { t: "h2", text: "Vrbo and Expedia: 8–30% depending on the model" },
    { t: "p", text: "Vrbo (part of the Expedia group) offers a **pay-per-booking** model at roughly **8%** (a 5% commission plus 3% payment processing), or an **annual subscription** (~£/$499) that can work out cheaper at high volume. Expedia's hotel-style commission is wider, **15–30%**, depending on your market and how much visibility you buy." },

    { t: "h2", text: "What \"booking direct\" actually costs" },
    { t: "p", text: "Direct booking isn't free — but it's close. When a guest books on your own website and pays you through your own Stripe or PayPal, your only costs are:" },
    { t: "ul", items: [
      "**Card processing** — about **1.5% + 20p** per transaction in the UK/EU (Stripe/PayPal standard rates).",
      "**A flat annual fee** for your listing and booking site — not a per-booking cut.",
      "**Your time** — though a templated site plus calendar sync removes most of it.",
    ] },
    { t: "p", text: "There's no percentage skim that grows with your nightly rate. A £60 room and a £600 suite cost the same ~1.5% to process. That's the structural reason direct wins as your prices rise." },

    { t: "stats", items: [
      { value: "~£13", label: "kept per £100 booking vs Booking.com" },
      { value: "0%", label: "commission on direct bookings" },
      { value: "1 booking", label: "direct often covers a year's listing fee" },
    ] },

    { t: "h2", text: "The honest case for keeping both" },
    { t: "p", text: "OTAs are brilliant at one thing: discovery. New guests who've never heard of you will find you there. The smart play isn't to quit them overnight — it's to **use OTAs to get discovered, then convert repeat and word-of-mouth guests to direct**, where you keep the lot. Every returning guest you move off Booking.com is a ~15% pay rise on that booking." },
    { t: "callout", tone: "win", title: "The rule of thumb", text: "Let OTAs win you the *first* booking. Win the *second* one yourself. A business card in the room, a follow-up email, and a website that actually takes bookings is all it takes." },

    { t: "cta", title: "Keep 100% of your direct bookings", body: "We build and host a booking website on your own domain, with online payments straight to you. List your stay and see it live in minutes.", label: "See how it works →", href: "/host" },
  ],
  faqs: [
    { q: "How much commission does Booking.com take in 2026?", a: "Booking.com charges hosts around 15% on average, with a typical range of 10–25% depending on country and property type. Opting into Preferred Partner or visibility-boost programmes adds roughly 2–5% on top." },
    { q: "How much does Airbnb charge hosts?", a: "Most UK and European hosts now pay Airbnb's host-only service fee of around 15.5%, deducted from the payout. The older split-fee model charges the host ~3% but adds a ~14% service fee to the guest's total." },
    { q: "Is it cheaper to book direct than through Booking.com or Airbnb?", a: "For the host, yes. Direct bookings carry no platform commission — only card processing of about 1.5% + 20p and a flat annual fee. On a £100 booking you keep roughly £98 direct versus about £85 through an OTA." },
    { q: "Should I leave Booking.com and Airbnb entirely?", a: "Usually not straight away. OTAs are strong at attracting first-time guests. The most profitable approach is to use them for discovery and then convert repeat and referred guests to your own direct-booking site, where you keep 100%." },
  ],
  related: ["how-to-get-direct-bookings", "airbnb-host-fees-explained", "do-i-need-a-website-for-my-bnb"],
};
