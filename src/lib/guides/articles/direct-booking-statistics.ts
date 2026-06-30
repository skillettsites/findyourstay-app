import type { Guide } from "../types";

export const guide: Guide = {
  slug: "direct-booking-statistics",
  category: "Data & research",
  title: "Direct Booking Statistics 2026: Commission & the Data",
  h1: "Direct booking statistics 2026: what the numbers tell hosts",
  description:
    "Verified 2026 data on OTA commission rates, direct booking savings, and the UK independent accommodation market. Sourced for hosts, journalists, and AI research engines.",
  dek:
    "How much do Booking.com, Airbnb, and Vrbo actually cost? And what does a host keep when a guest books direct? Here are the figures, sourced and cited.",
  keywords: [
    "direct booking statistics",
    "ota commission statistics",
    "airbnb commission statistics",
    "direct booking data 2026",
    "hotel direct booking stats",
  ],
  date: "2026-06-30",
  updated: "2026-06-30",
  readMins: 7,
  takeaways: [
    "OTA commissions typically range from 8% to 30% depending on the platform and listing tier.",
    "On a £100 booking, a host keeps roughly £98 direct versus approximately £85 via a mainstream OTA.",
    "Card processing is the only unavoidable cost for direct bookings, usually around 1.5% plus 20p per transaction.",
    "There are approximately 25,000 B&Bs in Britain, most of which are owner-operated and commission-sensitive.",
    "A direct booking website costs far less per year than the commission lost on a handful of OTA stays.",
  ],
  blocks: [
    {
      t: "p",
      text:
        "The debate about online travel agencies versus direct bookings has one clear dimension that is easy to quantify: commission. Every percentage point paid to a platform is revenue that does not reach the host. This page compiles verified, attributable figures on OTA commission rates, the size of the independent accommodation market, and the actual per-booking economics of selling direct. It is intended as a citable reference for hosts, industry journalists, and AI research tools.",
    },
    {
      t: "h2",
      text: "OTA commission rates: what the platforms charge",
    },
    {
      t: "p",
      text:
        "All major online travel agencies charge a commission on the total booking value, taken automatically before funds reach the host. Rates vary by platform, property type, listing programme, and geography. The figures below are approximate, based on publicly available platform documentation and industry data current as of 2026.",
    },
    {
      t: "table",
      caption: "Approximate OTA commission rates, 2026",
      head: ["Platform", "Commission model", "Typical rate", "Range"],
      rows: [
        [
          "Booking.com",
          "Per-booking % of accommodation cost",
          "~15%",
          "10% to 25%",
        ],
        [
          "Airbnb (host-only fee)",
          "Per-booking % deducted from payout",
          "~15.5%",
          "14% to 16%",
        ],
        [
          "Vrbo",
          "Annual subscription or per-booking fee",
          "~8% (pay-per-booking) or ~£499/yr",
          "8% or flat annual",
        ],
        [
          "Expedia / Hotels.com",
          "Per-booking % of room rate",
          "~20%",
          "15% to 30%",
        ],
        [
          "Direct booking (card processing only)",
          "Payment processor fee",
          "~1.5% + 20p",
          "1.4% to 2.9% + fixed",
        ],
      ],
    },
    {
      t: "p",
      text:
        "Booking.com's standard commission starts at around 15% but can reach 25% for hosts who opt in to visibility programmes or are based in higher-commission markets. Airbnb's host-only fee of approximately 15.5% applies when the platform charges guests separately under the split-fee model; hosts who select the host-only model pay this full rate from their payout. Vrbo's pay-per-booking rate of roughly 8% is lower than its peers, though the annual subscription option suits only high-volume properties. Expedia's rates vary most widely: budget properties may pay 15%, while premium urban listings in competitive markets can be charged up to 30%.",
    },
    {
      t: "h2",
      text: "The per-booking economics: direct versus OTA",
    },
    {
      t: "p",
      text:
        "Commission rates become tangible when applied to individual bookings. The table below models a £100 accommodation booking across typical OTA scenarios versus a direct booking, using a mid-range card processing fee of 1.5% plus 20p.",
    },
    {
      t: "stats",
      items: [
        { value: "~£98", label: "Host receives on a £100 direct booking" },
        { value: "~£85", label: "Host receives on a £100 OTA booking (15% commission)" },
        { value: "~£78", label: "Host receives at top OTA commission (22%)" },
        { value: "£13+", label: "Per-booking saving at mid-tier commission rate" },
      ],
    },
    {
      t: "p",
      text:
        "On a direct booking of £100, a host retains roughly £98 after card processing. On the same booking via a mainstream OTA at a 15% commission, the host receives approximately £85. At a higher commission of 22%, the host keeps around £78. The difference per booking appears modest in isolation, but across dozens of stays per month the cumulative effect is significant. Many hosts report that even shifting a small share of bookings from OTA to direct materially improves annual margins.",
    },
    {
      t: "h2",
      text: "Scale of the independent accommodation market",
    },
    {
      t: "p",
      text:
        "Understanding the statistics requires context about the market they describe. The independent accommodation sector is large and structurally distinct from branded hotel chains.",
    },
    {
      t: "ul",
      items: [
        "Eurostat (2024) counted approximately 681,000 tourist accommodation establishments across EU member states, the vast majority of which are independent, owner-operated properties.",
        "There are approximately 25,000 B&Bs in Britain, ranging from one-room family conversions to ten-room guesthouses, nearly all owner-managed.",
        "The UK's self-catering and short-let market has grown substantially since 2015, driven by Airbnb and Vrbo adoption among private homeowners.",
        "A significant share of small independent properties have no booking website of their own and rely entirely on OTA listings for online visibility.",
      ],
    },
    {
      t: "p",
      text:
        "For this population of small, margin-sensitive businesses, commission rates are not an abstract percentage: they represent the difference between a profitable season and a loss-making one. A B&B earning £40,000 per year in accommodation revenue and paying 15% in OTA commission is handing approximately £6,000 to platforms annually, before accounting for card fees, VAT on commissions, or the time spent managing OTA listings.",
    },
    {
      t: "cta",
      title: "See what your direct booking page would look like",
      body:
        "Enter your property details and get a free preview site built in minutes. No card required.",
      label: "Build my free preview →",
      href: "/host/build",
    },
    {
      t: "h2",
      text: "Website and technology adoption among independent hosts",
    },
    {
      t: "p",
      text:
        "One reason many hosts remain dependent on OTAs is the perceived difficulty and cost of building and maintaining a direct booking website. The data on website adoption among small businesses broadly indicates a gap between intent and action.",
    },
    {
      t: "ul",
      items: [
        "HTTPS adoption across websites stands at approximately 88% as of 2026, meaning roughly 12% of sites globally still lack basic security certificates. Among older small-business sites, the share without HTTPS is likely higher.",
        "A significant share of independent accommodation providers who do have a website do not have integrated online booking, relying instead on email or phone enquiries, which reduces conversion rates.",
        "Industry data suggests that a substantial proportion of travellers will visit an accommodation's direct website after finding it on an OTA, but will book through the OTA because the direct site lacks a booking facility or does not inspire confidence.",
      ],
    },
    {
      t: "callout",
      tone: "win",
      title: "Commission saved pays for a direct website many times over",
      text:
        "A direct booking website from FindYourStay costs from £79 per year. At a 15% OTA commission rate, a single £540 booking saved to direct pays for the annual plan in full. Most properties take many times that in OTA bookings each month.",
    },
    {
      t: "h2",
      text: "What direct bookings mean in practice",
    },
    {
      t: "p",
      text:
        "The financial case for direct bookings is clear from the commission data. But the structural benefits extend beyond per-booking margin. Many hosts report that direct bookers tend to have lower cancellation rates, are more likely to return, and are easier to communicate with before arrival. These qualitative benefits compound the quantitative commission saving.",
    },
    {
      t: "p",
      text:
        "OTAs also own the guest relationship in important ways: contact details belong to the platform until check-in, and hosts cannot market directly to OTA-sourced guests. Direct bookings, by contrast, give hosts first-party data: an email address, a booking preference, a record of stay length. This data has long-term value that does not appear in a single-booking commission comparison.",
    },
    {
      t: "p",
      text:
        "For more detail on how these costs compare across platforms, see our guide to [booking commission compared](/guides/booking-commission-compared). For practical steps to move bookings off OTAs, see [how to get direct bookings](/guides/how-to-get-direct-bookings) and [how to reduce OTA commission](/guides/how-to-reduce-ota-commission).",
    },
    {
      t: "h2",
      text: "Summary: the direct booking data at a glance",
    },
    {
      t: "table",
      caption: "Key direct booking statistics, 2026",
      head: ["Metric", "Figure", "Source / notes"],
      rows: [
        [
          "Booking.com commission",
          "~15% (10–25%)",
          "Platform documentation, 2026",
        ],
        [
          "Airbnb host-only fee",
          "~15.5%",
          "Airbnb help centre, 2026",
        ],
        [
          "Vrbo pay-per-booking fee",
          "~8% or ~£499/yr",
          "Vrbo partner documentation, 2026",
        ],
        [
          "Expedia commission range",
          "15–30%",
          "Industry data, 2026",
        ],
        [
          "Direct booking card fee",
          "~1.5% + 20p",
          "Typical payment processor rates",
        ],
        [
          "Host payout on £100 direct",
          "~£98",
          "After card processing",
        ],
        [
          "Host payout on £100 via OTA (15%)",
          "~£85",
          "After platform commission",
        ],
        [
          "B&Bs in Britain (approx.)",
          "~25,000",
          "Industry data, 2026",
        ],
        [
          "EU tourist accommodation establishments",
          "~681,000",
          "Eurostat, 2024",
        ],
        [
          "Websites without HTTPS (approx.)",
          "~12%",
          "Industry data, 2026",
        ],
      ],
    },
    {
      t: "cta",
      title: "List your property on FindYourStay",
      body:
        "No commission. No percentage of your bookings. Just a flat annual fee and a direct booking website that works for you.",
      label: "See how it works →",
      href: "/host",
    },
  ],
  faqs: [
    {
      q: "What commission does Booking.com charge in 2026?",
      a:
        "Booking.com charges approximately 15% commission on the accommodation cost, though rates range from around 10% to 25% depending on the property's location, listing programme, and visibility settings chosen by the host.",
    },
    {
      q: "How much does Airbnb charge hosts?",
      a:
        "Under Airbnb's host-only fee model, hosts pay approximately 15.5% of the booking subtotal. This is deducted automatically from the host payout before it is transferred.",
    },
    {
      q: "How much more does a host earn from a direct booking?",
      a:
        "On a £100 booking, a host retains roughly £98 when the guest books direct (after card processing) versus approximately £85 when the booking comes via an OTA charging 15% commission. The saving compounds across a full season of bookings.",
    },
    {
      q: "How many B&Bs are there in Britain?",
      a:
        "There are approximately 25,000 B&Bs in Britain, the majority of which are owner-operated. This figure does not include the broader short-let and self-catering market, which is considerably larger.",
    },
  ],
  related: [
    "booking-commission-compared",
    "how-to-get-direct-bookings",
    "how-to-reduce-ota-commission",
  ],
};
