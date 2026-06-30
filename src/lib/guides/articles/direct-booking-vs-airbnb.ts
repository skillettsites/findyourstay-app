import type { Guide } from "../types";

export const guide: Guide = {
  slug: "direct-booking-vs-airbnb",
  category: "Direct bookings",
  title: "Direct Booking vs Airbnb: Which Makes Hosts More Money?",
  h1: "Direct booking vs Airbnb: which makes hosts more money?",
  description:
    "Airbnb takes around 15.5% of every booking. Direct bookings cost roughly 1.5% in card fees. Here is the honest comparison of cost, control, and when to use each channel.",
  dek: "Airbnb gives you reach, but that reach comes at a price. This guide breaks down the real economics of each channel, where platforms win and where they cost you, and the practical case for running both at once.",
  keywords: [
    "direct booking vs airbnb",
    "airbnb vs direct booking",
    "is direct booking better than airbnb",
    "direct booking benefits",
  ],
  date: "2026-06-30",
  updated: "2026-06-30",
  readMins: 8,
  takeaways: [
    "On a £100 booking you keep roughly **£98 direct** vs **~£84.50 through Airbnb** after the ~15.5% host fee.",
    "Airbnb wins on **discovery**: guests who have never heard of you can find your property through search and reviews.",
    "Direct booking wins on **economics and control**: you set your own cancellation policy, keep the guest relationship, and get paid directly.",
    "The savviest hosts use **both channels**: Airbnb or Booking.com for first-time guests, direct for every return visit.",
    "Even five direct bookings a year at £150 per booking saves around £112 in platform fees, often more than covering an annual booking-site subscription.",
  ],
  blocks: [
    {
      t: "p",
      text: "Every booking taken through Airbnb comes with a platform fee attached. For most UK hosts in 2026 that fee sits at around **15.5%**, deducted from your payout before the money reaches your account. On a busy fortnight, that percentage adds up fast. Yet moving entirely away from Airbnb is not straightforward either, because platforms provide something genuinely valuable: the ability for complete strangers to find your property. This guide sets out the honest comparison so you can decide where each channel fits into your business. For a full breakdown of how Airbnb calculates its fees, see [Airbnb host fees explained](/guides/airbnb-host-fees-explained).",
    },

    { t: "h2", text: "The core economics: what you actually keep" },
    {
      t: "p",
      text: "The simplest way to understand the difference is to follow the money on a single £100 booking.",
    },
    {
      t: "table",
      caption:
        "Illustrative figures on a £100 booking. Airbnb host-only fee assumed at 15.5%. Direct booking card processing at ~1.5% + 20p (Stripe UK/EU rate). Figures as of 2026.",
      head: ["Channel", "Guest pays", "Platform/processing fee", "You keep"],
      rows: [
        ["**Airbnb (host-only fee)**", "£100", "~£15.50 (15.5%)", "~£84.50"],
        ["**Booking.com (~17%)**", "£100", "~£17.00", "~£83.00"],
        [
          "**Direct booking (your own site)**",
          "£100",
          "~£1.70 (card only)",
          "~£98.30",
        ],
      ],
    },
    {
      t: "p",
      text: "The gap compounds quickly. On 50 bookings a year averaging £150 each, Airbnb's 15.5% fee costs around **£1,162**. Card processing on the same revenue taken direct costs around **£120**. The difference of roughly £1,040 is the maximum annual value of switching those bookings to direct. In practice, you would not move all of them, but even a third makes a meaningful dent. For a side-by-side comparison across multiple platforms, see [how booking platform commissions compare](/guides/booking-commission-compared).",
    },

    { t: "h2", text: "Where Airbnb genuinely wins" },
    {
      t: "p",
      text: "None of the above means Airbnb is a bad deal. The platform provides real value in several areas that a direct website cannot replicate on its own.",
    },
    {
      t: "ul",
      items: [
        "**Discovery.** Airbnb has millions of guests actively searching for accommodation. A first-time visitor to your area will likely start there. Without a platform listing, those guests simply would not find you.",
        "**Built-in trust signals.** Reviews, identity verification, and the Airbnb brand reassure guests who do not know you. A new direct-booking site carries none of that trust by default.",
        "**Insurance and host guarantees.** Airbnb's AirCover programme offers host liability cover and property damage protection. The scope is limited, but it is included in your fee and is a genuine benefit.",
        "**Payment handling.** Airbnb manages payment disputes, fraud screening, and currency conversion. For hosts who do not want to deal with those processes directly, this has real value.",
        "**Seasonality fill.** In quieter periods, being listed on a platform with millions of users is a useful safety net even for hosts with a strong direct following.",
      ],
    },

    { t: "h2", text: "Where direct booking wins" },
    {
      t: "p",
      text: "Direct booking's advantages are most visible once you have guests who already know and trust you.",
    },
    {
      t: "ul",
      items: [
        "**Lower cost per booking.** As shown above, you keep roughly £13.80 more per £100 when guests book direct. That margin is permanent and scales with every booking.",
        "**You own the guest relationship.** On Airbnb, the guest is Airbnb's customer. Their email address and contact details belong to the platform. With a direct booking, you hold the relationship, can follow up, and can encourage a return visit without going through any middleman.",
        "**Full control over cancellation policy.** Airbnb's cancellation policies are set from a short menu. Direct bookings let you define exactly what you offer: partial refund, date changes, non-refundable discounts, or anything else that suits your property.",
        "**Faster, direct payment.** Direct booking payments via Stripe go straight to your bank account, typically within two business days. Airbnb holds funds until 24 hours after the guest checks in.",
        "**Your brand, not theirs.** A direct booking site with your own domain builds your property's identity independently. Guests who search your name find your site, not a listing on a platform that also shows your competitors.",
        "**No risk of platform policy changes.** Airbnb has changed its fee model, cancellation rules, and ranking algorithms multiple times. A direct channel gives you a stable baseline that is entirely within your control.",
      ],
    },

    {
      t: "callout",
      tone: "win",
      title: "The repeat-guest maths",
      text: "If a guest stays three times a year at an average of £150 per booking, moving them to direct saves roughly **£70 per year in Airbnb fees alone** from a single guest. A direct-booking site from £79 per year pays for itself after a single converted repeat guest.",
    },

    { t: "h2", text: "Head-to-head comparison" },
    {
      t: "table",
      caption: "Direct comparison across the factors that matter most to independent hosts.",
      head: ["Factor", "Airbnb", "Direct booking"],
      rows: [
        ["Commission", "~15.5% per booking", "0% (card processing ~1.5% + 20p)"],
        ["Discovery for new guests", "Strong (millions of active searchers)", "Weak until SEO/word-of-mouth builds"],
        ["Guest relationship", "Platform owns the data", "You own the relationship"],
        ["Pricing control", "Flexible but Smart Pricing can override", "Complete control"],
        ["Cancellation policy", "Choose from Airbnb's preset options", "Set your own terms"],
        ["Payout timing", "24h after check-in", "Typically 2 business days from booking"],
        ["Reviews", "Visible on a trusted platform", "Site-based, harder to verify for new guests"],
        ["Brand building", "Builds Airbnb's brand alongside yours", "Builds your property's brand only"],
        ["Platform risk", "Policy/algorithm changes affect you", "Stable, under your control"],
      ],
    },

    {
      t: "cta",
      title: "See what a commission-free booking site looks like for your property",
      body: "Build a free preview in under a minute. No signup needed.",
      label: "Build my free preview →",
      href: "/host/build",
    },

    { t: "h2", text: "The case for using both channels" },
    {
      t: "p",
      text: "Most successful independent hosts do not choose between Airbnb and direct bookings. They use Airbnb as a **top-of-funnel acquisition channel** and convert returning guests to direct. The logic is straightforward: you cannot refuse the discovery benefit of a platform with millions of active users. But once a guest has stayed, enjoyed the experience, and is likely to return, there is no reason to pay a 15.5% commission on their second and third visits.",
    },
    {
      t: "p",
      text: "The practical mechanics are simple. A card in the room (or a small note at checkout) letting guests know they can save money and book direct next time. A working direct-booking website on your own domain so the option is real, not just a suggestion. A modest discount to make direct the obviously better choice for the guest. Over 12 to 24 months, a growing proportion of your bookings shifts to a channel where you keep almost everything. For a step-by-step guide to making this work, see [how to get direct bookings from your existing guests](/guides/how-to-get-direct-bookings).",
    },

    {
      t: "h2",
      text: "What a direct-booking website actually costs",
    },
    {
      t: "p",
      text: "The barrier many hosts cite is not knowing where to start with a direct-booking site. The reality is that costs have come down significantly and setup is no longer a months-long project.",
    },
    {
      t: "ul",
      items: [
        "**Listing-only plan:** your property appears in the FindYourStay directory, giving you a public presence and a place to send guests. From **£79 per year**.",
        "**With a booking website:** we build and host a booking site on your own domain, with payments going directly to your account via Stripe. Add-on priced at **+£120 per year** on any plan. You keep 100% of every booking, less card processing.",
        "**No commission, ever.** FindYourStay charges a flat annual fee, not a percentage of your revenue. Your success does not cost you more.",
      ],
    },
    {
      t: "p",
      text: "At a £79 annual fee, you need to move roughly **six bookings of £100** from Airbnb to direct to cover the cost of the site in saved fees alone. Everything beyond that is clear gain. For a practical look at what the site includes and how the booking flow works, see [do I need a website for my B&B?](/guides/do-i-need-a-website-for-my-bnb).",
    },

    {
      t: "stats",
      items: [
        { value: "~15.5%", label: "Airbnb host-only service fee (UK 2026)" },
        { value: "~1.5%", label: "direct booking card processing cost" },
        { value: "~£98", label: "you keep per £100 booked direct vs ~£84.50 via Airbnb" },
      ],
    },

    { t: "h2", text: "A balanced verdict" },
    {
      t: "p",
      text: "Airbnb is not the enemy. It built a market that benefits independent hosts enormously: millions of guests who might never have considered a small B&B or guesthouse now actively search and book them. That is worth something, and the 15.5% fee is a reasonable price for genuine new-guest acquisition.",
    },
    {
      t: "p",
      text: "Where the fee becomes harder to justify is on repeat guests, word-of-mouth referrals, and guests who find you through a Google search and then book through Airbnb only because you have no direct-booking alternative. Those are the bookings where a flat-fee direct channel pays for itself in the first month.",
    },
    {
      t: "p",
      text: "The optimal approach for most small hosts is **Airbnb for discovery, direct for loyalty**. Maintain your platform listing for new guest acquisition. Actively encourage every returning guest to book direct. Build your own booking site so the option actually exists. The fee savings compound quietly over time, and after a year or two the economics shift substantially in your favour.",
    },

    {
      t: "cta",
      title: "Ready to take your first direct booking?",
      body: "FindYourStay builds and hosts a commission-free booking website on your own domain. Payments go straight to you. Annual plans from £79.",
      label: "See how it works →",
      href: "/host",
    },
  ],
  faqs: [
    {
      q: "Is direct booking better than Airbnb for hosts?",
      a: "It depends on the booking. For first-time guests who discover you through search, Airbnb's platform value is hard to beat. For returning guests and word-of-mouth referrals, direct booking wins clearly: you keep around £98 per £100 booked direct versus ~£84.50 through Airbnb after the 15.5% host fee. Most independent hosts benefit from running both channels at once.",
    },
    {
      q: "How much more do I make per booking if guests book direct?",
      a: "On a £100 booking, you keep around £98.30 direct (after Stripe card processing at ~1.5% + 20p) versus around £84.50 through Airbnb at 15.5%. That is roughly £13.80 more per £100. On a £200 booking the saving is around £27.60. Over a full year of bookings, even moving a fraction of them to direct adds up to a meaningful income increase.",
    },
    {
      q: "Can I legally encourage Airbnb guests to book direct in future?",
      a: "Airbnb's terms prohibit you from sharing your direct booking details in pre-stay messages on their platform. However, once the stay has taken place, there is nothing stopping you from leaving a business card in the room, mentioning it at checkout, or including your website address in a welcome pack. Many hosts do this routinely without any issue.",
    },
    {
      q: "Do I need to leave Airbnb to start taking direct bookings?",
      a: "No. The most common and practical approach is to keep your Airbnb listing active for new-guest discovery while building a direct channel alongside it for returning guests. You do not need to choose between them. Many hosts run Airbnb, Booking.com, and a direct-booking site simultaneously, adjusting the balance as their direct business grows.",
    },
  ],
  related: [
    "airbnb-host-fees-explained",
    "how-to-get-direct-bookings",
    "booking-commission-compared",
  ],
};
