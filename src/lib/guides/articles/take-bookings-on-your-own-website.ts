import type { Guide } from "../types";

export const guide: Guide = {
  slug: "take-bookings-on-your-own-website",
  category: "Your website",
  title: "How to Take Bookings on Your Own Website (No Commission)",
  h1: "How to take bookings on your own website, commission-free",
  description:
    "A practical guide for B&B and guesthouse owners on setting up a direct booking system: payments, calendar sync, deposits, and how to avoid double-bookings without technical skill.",
  dek: "Airbnb and Booking.com take 15% or more from every booking. Here is how independent hosts can accept bookings on their own website, keep 100% of the revenue, and still avoid double-bookings.",
  keywords: [
    "take bookings on your own website",
    "direct booking system",
    "accept payments b&b website",
    "booking system for guest house",
    "online booking own website",
  ],
  date: "2026-06-30",
  updated: "2026-06-30",
  readMins: 8,
  takeaways: [
    "You can accept bookings and payments directly on your own website with no commission taken by a platform.",
    "Stripe and PayPal process card payments at around 1.5% + 20p per transaction; the money lands in your account.",
    "iCal calendar sync keeps your availability in step across Airbnb, Booking.com, and your own site, preventing double-bookings.",
    "You can choose between instant booking and request-to-book to suit how hands-on you want to be.",
    "A done-for-you setup means you do not need technical skills to go live.",
  ],
  blocks: [
    {
      t: "p",
      text: "Every time a guest books through Airbnb, Booking.com, or Vrbo, you hand over a slice of your income. Combined host and guest fees often amount to 15 to 25% of the booking value. For a £150-a-night room, that is £22 to £37 gone before you have welcomed your first guest. Taking bookings on your own website removes that cost entirely. This guide explains how the whole process works, from payments to calendar management, so you can decide whether it is right for your B&B or guesthouse.",
    },
    {
      t: "h2",
      text: "What 'direct bookings' actually means",
    },
    {
      t: "p",
      text: "A direct booking is one where the guest books and pays without an intermediary platform in the middle. They visit your website, pick their dates, pay, and receive a confirmation. No commission is deducted. You remain the merchant of record, meaning the money goes straight into your own Stripe or PayPal account, not into a platform's holding pool. The guest's card statement shows your business name, and you settle any refunds or disputes directly.",
    },
    {
      t: "p",
      text: "The only cost between you and the guest is a standard card-processing fee. Stripe charges approximately 1.5% + 20p per successful UK card transaction; PayPal is similar. On a £150 booking that works out to roughly £2.45, compared with £22 or more in OTA commission. Over 100 bookings a year the difference is several thousand pounds.",
    },
    {
      t: "stats",
      items: [
        { value: "15-25%", label: "Typical OTA commission (host + guest fees combined)" },
        { value: "~1.5% + 20p", label: "Stripe card-processing fee on direct bookings" },
        { value: "0%", label: "Platform commission on your own website" },
        { value: "100%", label: "Of booking money goes straight to you" },
      ],
    },
    {
      t: "h2",
      text: "Choosing between instant booking and request-to-book",
    },
    {
      t: "p",
      text: "When you set up a booking system you have two main modes to choose from, and the right one depends on how much control you want over who stays with you.",
    },
    {
      t: "table",
      caption: "Instant booking vs request-to-book: key differences",
      head: ["", "Instant booking", "Request-to-book"],
      rows: [
        ["How it works", "Guest pays and the booking is confirmed immediately", "Guest submits a request; you approve or decline within a set window"],
        ["Guest experience", "Faster, suits guests who plan last-minute", "Slightly slower but feels more personal"],
        ["Host control", "Lower; guest is confirmed before you see the request", "Higher; you can vet guests or check conflicts first"],
        ["Best for", "Rooms that are always ready; high-volume hosts", "Unique properties; hosts who want to communicate first"],
        ["Payment timing", "Card charged at time of booking", "Card charged after host approves the request"],
      ],
    },
    {
      t: "p",
      text: "Many hosts start with request-to-book because it feels safer, then switch to instant once they are comfortable. Neither option prevents you from setting a deposit or taking full payment upfront.",
    },
    {
      t: "h2",
      text: "How payments work when money goes straight to you",
    },
    {
      t: "p",
      text: "To take card payments on your own website you connect your own Stripe or PayPal account. This is a straightforward sign-up process that takes around ten minutes; Stripe will ask for your bank details and verify your identity. Once connected, card payments flow directly from your guest to your bank account, typically within two to three business days. You are the merchant of record throughout.",
    },
    {
      t: "p",
      text: "This is an important distinction from OTA payments. When Airbnb or Booking.com hold your money, you are relying on their payout schedules and dispute processes. With direct payments, the money is yours from the moment the transaction clears, and any refund comes from your account under your own policy.",
    },
    {
      t: "callout",
      tone: "win",
      title: "You keep every penny of the booking",
      text: "FindYourStay never touches your booking money. Payments go directly from your guest to your own Stripe or PayPal account. We are a listing and website service, not a payment intermediary.",
    },
    {
      t: "h2",
      text: "Taking a deposit and setting a cancellation policy",
    },
    {
      t: "p",
      text: "One of the advantages of a direct booking system is flexibility over your own policies. You can collect a deposit at the time of booking, then charge the balance closer to arrival. Common approaches include taking 25% to 50% upfront and the remainder two to four weeks before the stay. Some smaller B&Bs take full payment at booking to simplify the process.",
    },
    {
      t: "p",
      text: "Cancellation policies are yours to set. You might offer a full refund up to 14 days before arrival, 50% between 7 and 14 days, and no refund inside 7 days. Whatever terms you choose, they should be clearly stated at the point of booking and included in the confirmation email. A written policy protects you if a dispute arises through your card processor.",
    },
    {
      t: "ul",
      items: [
        "Set your deposit amount and when the balance is due",
        "Write your cancellation terms clearly before you go live",
        "Include refund conditions in automated confirmation emails",
        "Keep a copy of the booking terms the guest agreed to at checkout",
      ],
    },
    {
      t: "h2",
      text: "Preventing double-bookings with iCal sync",
    },
    {
      t: "p",
      text: "The most common concern about direct bookings is double-bookings. If you still list on Airbnb or Booking.com alongside your own website, a guest could book the same dates on two different platforms before you have had a chance to block the calendar manually.",
    },
    {
      t: "p",
      text: "iCal sync solves this. Each platform, including Airbnb, Booking.com, and Vrbo, publishes a calendar feed in the iCal format (.ics). Your direct booking website imports these feeds and reads any blocked or booked dates from them, then exports its own feed back to each OTA. The sync runs automatically, typically every 15 to 30 minutes, so when a booking lands anywhere, all your other calendars are updated without any manual work from you.",
    },
    {
      t: "p",
      text: "This is the same technology the major OTAs use to sync with each other. It is not perfect because there is a short window between a booking being made and the sync running, but in practice double-bookings are rare when iCal sync is active. Hosts who want zero risk can keep OTAs blocked for dates they have open on their direct site and only release them once the direct window has passed.",
    },
    {
      t: "h2",
      text: "Booking confirmations and guest communications",
    },
    {
      t: "p",
      text: "A good booking system sends an automatic confirmation email the moment a booking is made or approved. This email should include the dates, room details, total paid, any balance due, check-in instructions, your contact details, and a summary of your cancellation policy. Guests expect this immediately; a delay of more than a few minutes will prompt anxious follow-up messages.",
    },
    {
      t: "p",
      text: "You can also set up automated pre-arrival messages, for example a reminder three days before check-in with parking information or a door code. This kind of communication is normal on OTAs; your direct booking system should replicate it so guests do not feel they are getting a lesser service by booking direct.",
    },
    {
      t: "cta",
      title: "See what your direct booking site could look like",
      body: "We build a free preview of your property website using your existing listing details. No commitment and no technical work required.",
      label: "Build my free preview →",
      href: "/host/build",
    },
    {
      t: "h2",
      text: "Do you need technical skills to set this up?",
    },
    {
      t: "p",
      text: "This is where many independent hosts hesitate. Setting up Stripe, connecting iCal feeds, configuring booking rules, and launching a website sounds like a project for a web developer. It does not have to be. A done-for-you service handles all of this: your listing goes live, your booking system is configured, your Stripe account is connected, and your iCal feeds are synced before handover.",
    },
    {
      t: "p",
      text: "If you want to understand the process before handing it over, the guides on [whether you need a website for your B&B](/guides/do-i-need-a-website-for-my-bnb) and [comparing the best direct booking website builders](/guides/best-direct-booking-website-builders) are good starting points. For a broader view of [how to get direct bookings](/guides/how-to-get-direct-bookings), including organic search and repeat guest incentives, there is a dedicated guide on that topic too.",
    },
    {
      t: "h2",
      text: "What it costs compared to staying on OTAs",
    },
    {
      t: "p",
      text: "The numbers depend on how many bookings you take each year, but the direction is consistent. A host with 80 bookings a year averaging £150 per booking is turning over £12,000. At 15% OTA commission that is £1,800 in fees. A direct booking website with a done-for-you setup costs a fraction of that annually, and card processing on £12,000 of revenue adds roughly £200 to £250 at Stripe rates. The net saving in year one is substantial and grows every year after that.",
    },
    {
      t: "p",
      text: "Many hosts do not switch entirely. They keep OTAs for visibility while nudging repeat guests and direct enquiries to book through their own site. Even a 30% shift to direct bookings produces meaningful savings without abandoning the reach that OTAs provide. The [booking commission compared](/guides/booking-commission-compared) guide covers the fee structures across all the major platforms if you want to run your own numbers.",
    },
    {
      t: "h2",
      text: "Getting started",
    },
    {
      t: "p",
      text: "Taking bookings on your own website is not reserved for large hotels with a dedicated reservations team. Independent B&Bs and guesthouses are well suited to it because guests often prefer the personal touch of booking direct, and a smaller operation can turn around enquiries and confirmations quickly. The key is having the right setup from the start: your own payment account, clear policies, iCal sync with any OTAs you still use, and automated confirmations that match what guests expect.",
    },
    {
      t: "cta",
      title: "Find out how FindYourStay sets this up for you",
      body: "Annual plans from £79/yr. Your own domain, your own Stripe, 0% commission. We handle the build; you handle the guests.",
      label: "See how it works →",
      href: "/host",
    },
  ],
  faqs: [
    {
      q: "Do I need my own Stripe account to take direct bookings?",
      a: "Yes. To receive payments directly you need your own Stripe or PayPal account. This keeps you as the merchant of record, meaning the money lands in your bank account rather than passing through a third party. Setting up Stripe takes around ten minutes and is free; you only pay the ~1.5% + 20p card-processing fee when a transaction goes through.",
    },
    {
      q: "How does iCal sync stop double-bookings?",
      a: "Each platform you list on (Airbnb, Booking.com, Vrbo) generates an iCal feed of your booked and blocked dates. Your direct booking website imports those feeds and blocks the same dates automatically. It also exports its own calendar back to each OTA. The sync runs every 15 to 30 minutes, so a booking on one channel is reflected everywhere else quickly, with no manual calendar management needed.",
    },
    {
      q: "Can I still list on Airbnb if I have my own booking website?",
      a: "Yes. Most hosts use both. OTAs provide visibility to new guests; your own website lets repeat visitors and direct enquiries book without paying platform fees. With iCal sync active, you can manage availability across all channels from one place. Some hosts gradually shift more bookings to their direct site over time as they build up repeat guests and organic search traffic.",
    },
    {
      q: "What happens if a guest needs to cancel?",
      a: "Refunds are handled under your own cancellation policy. Because the money was paid directly to your Stripe or PayPal account, you issue any refund from there. Stripe and PayPal both have straightforward refund tools in their dashboards. Your policy should be clearly displayed at checkout and included in the booking confirmation email, which protects you if a guest disputes a charge with their bank.",
    },
  ],
  related: [
    "do-i-need-a-website-for-my-bnb",
    "best-direct-booking-website-builders",
    "how-to-get-direct-bookings",
  ],
};
