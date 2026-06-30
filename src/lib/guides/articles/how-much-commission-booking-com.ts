import type { Guide } from "../types";

export const guide: Guide = {
  slug: "how-much-commission-booking-com",
  category: "Commissions & fees",
  title: "How Much Commission Does Booking.com Charge? (2026)",
  h1: "How much commission does Booking.com charge hosts?",
  description:
    "Booking.com's base commission is around 15% in the UK, but Preferred Partner fees, Visibility Booster bids and Genius discounts can push your real cost to 17-20% or more. Here is what you actually pay.",
  dek: "The headline rate is 15%, but that is rarely what small hosts end up paying. We break down every layer of Booking.com's fee structure and show what it means for a real stay.",
  keywords: [
    "booking.com commission",
    "booking.com fees for hosts",
    "how much does booking.com charge",
    "booking.com commission rate 2026",
    "booking.com preferred partner cost",
  ],
  date: "2026-06-30",
  updated: "2026-06-30",
  readMins: 7,
  takeaways: [
    "Booking.com charges most UK hosts a base commission of around 15% on every booking.",
    "Joining the Preferred Partner programme adds roughly 2 percentage points on top.",
    "Visibility Booster lets you bid additional commission in auction-style promotions.",
    "Genius discounts come out of your pocket, not Booking.com's, reducing net revenue further.",
    "A direct booking with card processing typically costs around 1.5% + 20p per transaction.",
  ],
  blocks: [
    {
      t: "p",
      text: "If you have ever stared at a Booking.com payout and wondered where the money went, you are not alone. The platform quotes a single commission percentage in your contract, but the total cost of a booking is rarely that simple. Preferred Partner fees, Visibility Booster bids and Genius programme discounts all stack on top of each other, and hosts who do not read the small print often discover their real cost is several points higher than the number they agreed to when they signed up.",
    },
    {
      t: "h2",
      text: "What is Booking.com's base commission rate?",
    },
    {
      t: "p",
      text: "Booking.com operates on a commission model, meaning you pay a percentage of the booking value each time a guest completes a stay. There is no monthly subscription fee for a standard listing. In the UK, the base rate for most independent properties sits at approximately **15%**, though the platform sets rates on a property-by-property basis and they can range from roughly 10% to 25% globally depending on property type, location and the accommodation category you fall into.",
    },
    {
      t: "p",
      text: "Commission is calculated on the total amount the guest pays, which includes any cleaning fee you have built into the room price. It is deducted before payout in markets where Booking.com collects payment on your behalf, or charged via a monthly invoice where you collect payment directly from guests at check-in.",
    },
    {
      t: "h2",
      text: "The extras that push your real rate higher",
    },
    {
      t: "h3",
      text: "Preferred Partner programme (+~2%)",
    },
    {
      t: "p",
      text: "Booking.com's Preferred Partner programme gives your listing a badge and a ranking boost. In return, you commit to paying a higher commission rate, typically around 2 percentage points above your base rate. So a property on a 15% base rate moves to roughly 17% once enrolled. Booking.com frames this as optional, but the ranking penalty for staying off the programme is significant enough that many hosts feel it is effectively required to remain competitive.",
    },
    {
      t: "h3",
      text: "Visibility Booster (variable, set by you)",
    },
    {
      t: "p",
      text: "Visibility Booster is a separate auction system that lets you bid additional commission to appear higher in search results during specific date ranges. You set your own bid, but competing properties can outbid you at any time. Hosts who use Visibility Booster routinely report adding another 3-5 percentage points during peak periods, pushing their total cost well above 20% for those bookings.",
    },
    {
      t: "h3",
      text: "Genius programme discounts",
    },
    {
      t: "p",
      text: "Booking.com's Genius loyalty programme offers guests discounts of 10% or more on qualifying properties. These discounts come entirely out of your revenue. Booking.com still charges its full commission on the original room rate, then deducts the guest discount from your payout. If a Genius level-two guest books a room with a 15% Genius discount at a property enrolled in Preferred Partner, you are effectively paying the Genius discount _plus_ 17% commission, before you have covered a single night's costs.",
    },
    {
      t: "h2",
      text: "Commission on a real booking: worked examples",
    },
    {
      t: "p",
      text: "The table below shows what a host on a 15% base rate actually receives under three scenarios: standard listing, Preferred Partner only, and Preferred Partner with a 10% Genius discount applied.",
    },
    {
      t: "table",
      caption:
        "Booking.com net payout examples. Figures assume 15% base rate, Preferred Partner +2%, Genius discount 10% of booking value deducted from host payout. Card processing not included.",
      head: [
        "Booking value",
        "Scenario",
        "Commission rate",
        "Commission paid",
        "Genius discount",
        "Host receives",
      ],
      rows: [
        ["£100", "Standard (15%)", "15%", "£15.00", "£0", "£85.00"],
        ["£100", "Preferred Partner (17%)", "17%", "£17.00", "£0", "£83.00"],
        [
          "£100",
          "Preferred Partner + Genius",
          "17%",
          "£17.00",
          "£10.00",
          "£73.00",
        ],
        ["£500", "Standard (15%)", "15%", "£75.00", "£0", "£425.00"],
        ["£500", "Preferred Partner (17%)", "17%", "£85.00", "£0", "£415.00"],
        [
          "£500",
          "Preferred Partner + Genius",
          "17%",
          "£85.00",
          "£50.00",
          "£365.00",
        ],
      ],
    },
    {
      t: "p",
      text: "On a £500 booking, the worst-case scenario above leaves you with £365 before tax, operational costs or any Visibility Booster bids you placed. That is a 27% reduction from the headline price the guest paid.",
    },
    {
      t: "h2",
      text: "How does Booking.com compare to taking a direct booking?",
    },
    {
      t: "stats",
      items: [
        { value: "~15%", label: "Booking.com base commission (UK typical)" },
        { value: "~17%", label: "Effective rate with Preferred Partner" },
        { value: "~1.5% + 20p", label: "Typical card processing per booking" },
        { value: "£0", label: "Platform commission on a direct booking" },
      ],
    },
    {
      t: "p",
      text: "When a guest books directly with you, the only transaction cost is card processing. Using a payment provider such as Stripe, you typically pay around 1.5% plus 20p per transaction in the UK. On a £500 direct booking that is £7.70. Compare that to £85 in Booking.com commission, or £135 once you factor in a Genius discount. The difference is substantial, and it compounds across every booking you take over a year.",
    },
    {
      t: "p",
      text: "The practical challenge for most small hosts is that getting guests to book directly requires a professional-looking website with a booking calendar, secure payments and availability sync with your OTA listings. Many hosts assume this is technically complicated or expensive to set up. It does not have to be, as the [direct bookings guide](/guides/how-to-get-direct-bookings) explains in detail.",
    },
    {
      t: "cta",
      title: "See what a direct-booking website looks like for your property",
      body: "Enter your property name and we will build a free preview site in under two minutes. No card details needed.",
      label: "Build my free preview →",
      href: "/host/build",
    },
    {
      t: "h2",
      text: "Can you reduce what you pay Booking.com without leaving?",
    },
    {
      t: "p",
      text: "A few approaches can trim the cost without removing your listing entirely. First, you can opt out of the Genius programme in your property settings, though this will reduce your visibility to a large segment of Booking.com's most frequent bookers. Second, you can avoid Visibility Booster bids during lower-demand periods where organic visibility is sufficient. Third, you can try negotiating your base commission rate, particularly if your property has strong review scores and high occupancy; Booking.com does sometimes reduce rates for well-performing properties, though they rarely publicise this. The [full guide on reducing OTA commission](/guides/how-to-reduce-ota-commission) covers each option in more detail.",
    },
    {
      t: "h2",
      text: "The case for running both channels",
    },
    {
      t: "p",
      text: "Most hosts who successfully reduce their OTA dependence do not abandon Booking.com overnight. A more practical approach is to use OTAs for visibility and acquisition while actively encouraging repeat guests and direct enquiries to book through your own site. Over time, as your direct booking share grows, you can afford to dial back your OTA spend on things like Visibility Booster and Genius.",
    },
    {
      t: "callout",
      tone: "win",
      title: "The maths of one converted repeat guest",
      text: "A guest who pays £500 via Booking.com nets you roughly £415 after Preferred Partner commission. The same guest booking direct next time costs you £7.70 in card fees. Over five stays, that single relationship is worth an extra £386 in your pocket compared to every stay going through Booking.com.",
    },
    {
      t: "p",
      text: "The key to making this work is a direct-booking website that looks professional enough that guests feel confident paying outside the OTA. That means clear photos, a real domain name, a visible booking calendar and payment security they can see. You can [compare what a direct-booking setup involves](/guides/take-bookings-on-your-own-website) against just maintaining your OTA presence if you want to weigh up the effort involved.",
    },
    {
      t: "h2",
      text: "Summary: what you are actually paying",
    },
    {
      t: "p",
      text: "Booking.com's base commission of around 15% is the floor, not the ceiling. Most hosts who use Preferred Partner are on 17%, and anyone enrolled in Genius with active Visibility Booster bids will regularly see their effective cost reach 20-25% on individual bookings. These are not hidden fees exactly; they are documented in the partner extranet. But they are easy to overlook when you first list your property and the headline rate sounds reasonable. Running the numbers on your actual payouts over a few months often tells a different story.",
    },
    {
      t: "cta",
      title: "Take more bookings without the commission",
      body: "FindYourStay builds and hosts a direct-booking website on your own domain, with payments straight to you. No commission, ever.",
      label: "See how it works →",
      href: "/host",
    },
  ],
  faqs: [
    {
      q: "Does Booking.com charge commission on cleaning fees?",
      a: "If your cleaning fee is included in the nightly room rate that guests pay, Booking.com will charge commission on the full amount. If you charge cleaning separately outside the platform, it depends on how your listing is configured. Most hosts who bundle cleaning into their rate are paying commission on it.",
    },
    {
      q: "What is the Booking.com Preferred Partner programme?",
      a: "Preferred Partner is a programme that gives your listing a badge and higher search ranking in exchange for paying a higher commission rate, typically around 2 percentage points above your standard rate. It is listed as optional but the ranking difference makes many hosts feel it is difficult to avoid.",
    },
    {
      q: "Does Booking.com commission vary by country?",
      a: "Yes. Booking.com sets commission rates on a regional and property-type basis. In the UK, most independent properties are quoted around 15% as a starting rate. Globally, rates can range from roughly 10% to 25%. If you are unsure of your exact rate, check your contract in the partner extranet under Finance settings.",
    },
    {
      q: "Can I negotiate my Booking.com commission rate?",
      a: "In principle, yes. Booking.com does adjust rates for high-performing properties with strong review scores and occupancy. In practice, negotiation is rarely straightforward and the platform does not publicise a formal review process. Your best route is to contact your local Booking.com market manager directly and make the case based on your performance data.",
    },
  ],
  related: [
    "booking-commission-compared",
    "how-to-reduce-ota-commission",
    "airbnb-vs-booking-com-for-hosts",
  ],
};
