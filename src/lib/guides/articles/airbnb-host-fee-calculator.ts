import type { Guide } from "../types";

export const guide: Guide = {
  slug: "airbnb-host-fee-calculator",
  category: "Commissions & fees",
  title: "Airbnb Host Fee Calculator UK (2026): The 15.5% + VAT Trap",
  h1: "Airbnb host fee calculator (UK 2026): what the 15.5% really costs you",
  description:
    "Free calculator for UK Airbnb hosts: see what the 15.5% host-only fee, plus the 20% VAT non-registered hosts pay on it, actually takes from you each year, and what you'd keep direct.",
  dek: "Airbnb's host-only fee looks like 15.5%. For most UK hosts it's really closer to 18.6% once VAT is added. Here's the honest maths, and a calculator to see your own number.",
  keywords: [
    "airbnb host fee calculator", "airbnb host fees uk 2026", "airbnb 15.5% fee",
    "how much does airbnb take from hosts uk", "airbnb host only fee vat", "airbnb service fee calculator",
  ],
  date: "2026-07-07",
  updated: "2026-07-07",
  readMins: 5,
  answerFirst:
    "Most UK Airbnb hosts are on the host-only fee of about **15.5%**, taken from every payout. If you're **not VAT registered**, which most small hosts aren't, Airbnb charges 20% VAT on that fee, so the effective rate is closer to **18.6%**. On £40,000 of bookings that's roughly **£7,440 a year**. Use the calculator to see yours.",
  takeaways: [
    "Most UK hosts pay the **host-only service fee of ~15.5%**, deducted from the payout.",
    "**Not VAT registered? Add 20% VAT** on the fee, effective rate ~**18.6%**.",
    "There's an older **split-fee** model (~3% host + ~14% guest), but host-only is now standard for UK/EU.",
    "The fee is charged on the **whole booking** including your cleaning fee.",
    "Direct bookings cost **0% commission**, the calculator shows the yearly gap.",
  ],
  blocks: [
    { t: "p", text: "Airbnb quietly moved most UK and European hosts onto a single 'host-only' service fee, and the headline number, 15.5%, hides a sting: if you're not VAT registered, Airbnb adds 20% VAT on top of its fee, and that's the version most small hosts actually pay. The calculator below uses your real figures and lets you toggle VAT registration so you see the true rate, not the marketing one." },

    { t: "calculator", variant: "airbnb" },

    { t: "h2", text: "The 15.5% + VAT trap, explained", id: "vat-trap" },
    { t: "p", text: "Airbnb's host-only fee is around **15.5%** of the booking total, taken before you're paid. Because Airbnb bills that fee from Ireland, UK hosts who aren't VAT registered are charged **20% VAT on the fee itself**. So the fee isn't 15.5%, it's 15.5% × 1.20 = **~18.6%**. VAT-registered hosts can generally reclaim or account for that VAT, but most small B&Bs and holiday lets sit under the threshold and simply eat it." },
    {
      t: "table",
      caption: "What Airbnb's host-only fee costs a non-VAT-registered UK host, on booking value.",
      head: ["Your annual bookings", "At 15.5% (headline)", "At ~18.6% (real, incl. VAT)"],
      rows: [
        ["£20,000", "£3,100", "**£3,720**"],
        ["£40,000", "£6,200", "**£7,440**"],
        ["£60,000", "£9,300", "**£11,160**"],
      ],
    },
    { t: "callout", tone: "warn", title: "It's charged on your cleaning fee too", text: "Airbnb applies the service fee to the **whole booking total**, including the cleaning fee you pass on to guests. So even the money earmarked to pay your cleaner gets skimmed." },

    { t: "h2", text: "Host-only vs split fee" },
    { t: "p", text: "Airbnb runs two fee models. The **host-only fee** (~15.5%, now standard for most UK/EU hosts) is taken entirely from your payout; the guest sees no separate service fee. The older **split fee** charges the host only ~3% but adds a ~14% service fee to the guest's total, which makes your listing look 14% more expensive and quietly costs you bookings. Either way Airbnb gets its cut; it's just a question of who sees it." },

    { t: "savings", price: 110, bookingsPerYear: 55, otaRate: 0.186, ota: "Airbnb incl. VAT" },

    { t: "h2", text: "What the same bookings cost you direct" },
    { t: "p", text: "When a guest books on your own website and pays through your own Stripe or PayPal, there's no percentage service fee at all, just card processing of about **1.5% + 20p** per transaction and a flat annual fee for your site. On a £110 booking that's roughly £1.85 versus Airbnb's ~£20. The gap is the whole reason hosts work to move repeat and referred guests onto a direct channel." },

    { t: "cta", title: "See your commission-free alternative", body: "Preview your own direct-booking website, 0% commission, built and hosted for you on your own domain. Free, no signup.", label: "Build my free preview →", href: "/host/build" },
  ],
  faqs: [
    { q: "How much does Airbnb take from hosts in the UK in 2026?", a: "Most UK hosts pay the host-only service fee of around 15.5% of the booking total. If you're not VAT registered, Airbnb adds 20% VAT to that fee, making the effective rate roughly 18.6%." },
    { q: "Why is my Airbnb fee more than 15.5%?", a: "Because Airbnb charges 20% VAT on its service fee to hosts who aren't VAT registered. 15.5% × 1.20 ≈ 18.6%. VAT-registered hosts can usually account for that VAT; most small hosts can't and simply pay the higher effective rate." },
    { q: "Does Airbnb charge its fee on the cleaning fee?", a: "Yes. Airbnb's service fee is applied to the whole booking total, which includes any cleaning fee you charge, so part of the money meant to pay your cleaner is taken as commission." },
    { q: "How much would I save booking direct instead of Airbnb?", a: "Direct bookings have no platform service fee, only about 1.5% + 20p card processing and a flat annual site fee. On typical UK host volumes that's usually several thousand pounds a year kept. The calculator above shows your figure." },
  ],
  related: ["airbnb-host-fees-explained", "ota-commission-calculator", "how-much-hosts-lose-to-commission"],
};
