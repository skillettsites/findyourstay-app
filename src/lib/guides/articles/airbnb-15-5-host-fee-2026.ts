import type { Guide } from "../types";

export const guide: Guide = {
  slug: "airbnb-15-5-host-fee-2026",
  category: "Commissions & fees",
  title: "Airbnb's New 15.5% Host-Only Fee: What It Means in 2026",
  h1: "Airbnb's new 15.5% host-only fee: what changed and how to beat it",
  description:
    "Airbnb moved UK hosts to a single 15.5% host-only fee in 2026, and with 20% VAT it is nearer 18.6%. Here is what changed, the true cost, and how to beat it.",
  dek: "In 2026 Airbnb finished rolling most UK and EU hosts onto a single host-only service fee. The headline number is 15.5%, but for a non-VAT-registered host the real bite is closer to 18.6% once 20% VAT is added. Here is what actually changed, what it costs you across a year, and the honest ways to claw that margin back.",
  keywords: [
    "airbnb 15.5% host fee",
    "airbnb host-only fee 2026",
    "airbnb host fee vat",
    "airbnb service fee uk",
    "airbnb host fee increase",
    "beat airbnb fees",
  ],
  date: "2026-07-07",
  updated: "2026-07-07",
  readMins: 7,
  answerFirst:
    "Airbnb has moved most UK and EU hosts onto a single host-only service fee of 15.5%, replacing the old split fee that shared the cost with guests. Because Airbnb adds 20% VAT on top, a non-VAT-registered UK host pays an effective rate of about 18.6% of the booking, taken from your side alone.",
  takeaways: [
    "The **host-only fee is 15.5%** of the booking total, charged entirely to you, and it became standard for most UK hosts through 2026.",
    "Add **20% VAT** and a non-VAT-registered host's effective rate is about **18.6%**, since you cannot reclaim that VAT.",
    "It replaced the **split fee** (roughly 3% host plus a guest-facing fee); the cost moved onto your side and out of the guest's view.",
    "On £20,000 of annual bookings, ~18.6% is roughly **£3,720 a year** gone to platform fees and VAT alone.",
    "You cannot cut the rate, so **beat it on volume**: use Airbnb for discovery, then move repeat and referred guests to your own **0% commission** direct-booking site.",
  ],
  blocks: [
    { t: "p", text: "If your Airbnb payouts look thinner in 2026, you are not imagining it. Over the course of the year Airbnb finished moving most hosts onto its **host-only** service fee, a single charge of **15.5%** that lands entirely on you rather than being partly shown to the guest. UK hosts on management software switched first, and most direct hosts followed around June 2026, with the remaining non-EU and EU hosts scheduled to complete the move later in the year. The headline rate is only half the story though, because for a lot of UK hosts VAT quietly pushes the real cost past 18%. Here is what changed, what it actually costs, and the honest ways to win some of that margin back." },

    { t: "h2", text: "What is the new 15.5% host-only fee?", id: "what-changed" },
    { t: "p", text: "It is a single service fee, charged to the host, of around **15.5% of the booking total**. Under the older **split fee**, Airbnb took roughly 3% from the host and added a separate service fee on top of the guest's bill, so the cost was shared and the guest could see part of it. Under host-only pricing, that guest-facing fee disappears from view and the whole charge moves onto your side. The guest sees one tidy price; you absorb the commission. It is the same model Booking.com has always used, and Airbnb has been standardising it market by market through 2026." },
    { t: "p", text: "Exact percentages and rollout dates vary by country and by whether you use a channel manager, so always check your own Airbnb fee settings for the figure that applies to your listing. The direction of travel, however, is settled: for most hosts the split fee is gone and the host-only 15.5% is the new normal." },

    { t: "cta", title: "See your place with 0% commission", body: "Before you swallow another 18.6% year, see what your own direct-booking page looks like on your own domain. Free preview, commission-free, no signup.", label: "Build my free preview →", href: "/host/build" },

    { t: "h2", text: "Why does VAT make it nearer 18.6%?" },
    { t: "p", text: "Because Airbnb charges **20% VAT on its service fee** to UK hosts, and if you are not VAT-registered you cannot claim it back. So the 15.5% you see is not the number that leaves your account. The maths is simply 15.5% multiplied by 1.20, which comes out at roughly **18.6%** of the booking. A VAT-registered host is in a different position: you can usually reclaim that 20% as input VAT on your return, which brings the effective cost back down towards the headline 15.5%. Most small independent hosts are below the VAT threshold, so for them 18.6% is the honest number to plan around." },
    { t: "callout", tone: "warn", title: "The number that actually leaves your account", text: "Headline fee **15.5%**. Add **20% VAT** you cannot reclaim, and a non-VAT-registered UK host really loses about **18.6%** of every booking. Price and plan around 18.6%, not 15.5%, or the gap eats your margin quietly all year." },

    { t: "h2", text: "What does the 15.5% host-only fee cost across a year?" },
    { t: "p", text: "More than the percentage suggests, because it compounds across every single booking. The table below shows the headline 15.5% against the effective 18.6% (fee plus VAT) at a few booking values, then what a typical year of bookings hands over. It is worth looking at the annual line rather than the per-booking one, because that is the figure that could fund your own website many times over." },
    {
      t: "table",
      caption: "Illustrative figures for a non-VAT-registered UK host. Your exact rate and VAT position may differ, so treat these as a guide, not a quote.",
      head: ["Booking total", "At 15.5% (headline)", "At 18.6% (incl. 20% VAT)", "Extra cost of VAT"],
      rows: [
        ["£100", "£15.50", "£18.60", "£3.10"],
        ["£500", "£77.50", "£93.00", "£15.50"],
        ["£1,000", "£155.00", "£186.00", "£31.00"],
        ["£20,000 / year", "£3,100", "£3,720", "£620"],
      ],
    },
    { t: "p", text: "So on £20,000 of bookings a year, the platform and VAT together take around **£3,720**. Want to run your own numbers on a different turnover or a mix of Airbnb and direct? Use the [Airbnb host fee calculator](/guides/airbnb-host-fee-calculator) to see your personal figure in a few seconds." },

    { t: "savings", price: 110, bookingsPerYear: 55, otaRate: 0.186, ota: "Airbnb incl. VAT" },

    { t: "h2", text: "Why did Airbnb make this change?" },
    { t: "p", text: "Officially, to simplify pricing: one number the guest sees, no separate service fee bolted on at checkout, which tends to lift conversion because the displayed price looks lower and cleaner. Airbnb also aligns with how Booking.com and most of the industry already work. The catch for hosts is that simpler for the guest means heavier for you: the cost that used to be split, and partly visible to the person paying, is now entirely on your side and invisible to them. That makes it harder to point at the fee, and easier for the platform to keep raising it over time. It is a good reason not to build your whole business on rented land." },

    { t: "h2", text: "How do you beat the 15.5% (really 18.6%) fee?" },
    { t: "p", text: "You cannot negotiate the rate down, so the answer is not to fight the percentage but to shrink how much of your business runs through it. Three moves do the heavy lifting:" },
    { t: "ol", items: [
      "**Use Airbnb only for discovery.** It is genuinely brilliant at putting your place in front of strangers who have never heard of you. Let it win that first booking and pay the fee gladly on new guests you would never have reached otherwise.",
      "**Move repeat and referred guests to direct.** A returning guest booked through your own site pays **0% commission**, so every repeat you convert is an instant ~18.6% pay rise on that stay. See our compliant playbook on [moving Airbnb guests to direct booking](/guides/move-airbnb-guests-to-direct-booking).",
      "**Price so the fee does not erode your margin.** Work back from your target net payout, not your headline nightly rate. If you need £100 clear, an 18.6% effective fee means listing nearer £123 to stand still. Set your direct rate a little below your Airbnb rate and it can still net you more, because you keep the commission.",
    ] },
    { t: "callout", tone: "win", title: "The compounding win", text: "You do not need to leave Airbnb to beat the fee. Move even a third of your nights to direct and you claw back thousands a year, while still using the platform for the new guests it finds you. Discovery on Airbnb, loyalty on your own site." },

    { t: "p", text: "The honest framing: the 15.5% host-only fee is not a disaster, it is a nudge. It is Airbnb telling you, clearly, how much every booking that runs through it now costs. Your job is to make sure the guests who already love your place, the repeat bookers and the word-of-mouth referrals, have somewhere of your own to book that keeps that 18.6% in your pocket instead." },

    { t: "cta", title: "Keep the 18.6%, not Airbnb", body: "We build and host your direct-booking website on your own domain, with payments straight to you and 0% commission. Use Airbnb to be found, and your own site to be booked.", label: "See how it works →", href: "/host" },
  ],
  faqs: [
    { q: "How much is Airbnb's host-only fee in 2026?", a: "It is around 15.5% of the booking total, charged entirely to the host, and it replaced the older split fee for most UK and EU hosts through 2026. Your exact figure can vary by country and setup, so check your own Airbnb fee settings." },
    { q: "Why is my effective Airbnb fee 18.6% and not 15.5%?", a: "Because Airbnb adds 20% VAT to its service fee for UK hosts. If you are not VAT-registered you cannot reclaim it, so 15.5% times 1.20 works out at about 18.6% of the booking. VAT-registered hosts can usually reclaim the VAT and stay nearer 15.5%." },
    { q: "What was the old split fee and how is host-only different?", a: "The split fee took roughly 3% from the host and added a separate service fee onto the guest's bill, so the cost was shared and partly visible to the guest. Host-only pricing moves the whole fee onto you and shows the guest a single price with nothing added at checkout." },
    { q: "Can I avoid the Airbnb host-only fee?", a: "Not on Airbnb itself, the rate is fixed. What you can do is reduce how much of your business runs through it: use Airbnb to find new guests, then move repeat and referred guests to your own direct-booking site, where you pay 0% commission and keep the full amount." },
    { q: "Should I raise my prices to cover the 15.5% fee?", a: "Price back from the net payout you want rather than the headline rate. To net £100 at an 18.6% effective fee you need to list nearer £123. Setting a slightly lower direct rate can still leave you better off, because there is no commission in the middle." },
  ],
  related: ["airbnb-host-fees-explained", "airbnb-host-fee-calculator", "move-airbnb-guests-to-direct-booking"],
};
