import type { Guide } from "../types";

export const guide: Guide = {
  slug: "taking-bookings-off-airbnb-penalty",
  category: "Direct bookings",
  title: "What Happens If You Take Bookings Off Airbnb? (Penalty Risk 2026)",
  h1: "What happens if you take bookings off Airbnb? The real penalty risk",
  description:
    "The honest answer on Airbnb off-platform penalties in 2026, what actually gets hosts warned or suspended, what's perfectly safe, and how to take direct bookings without the risk.",
  dek: "It's the fear that stops most hosts going direct: 'will Airbnb ban me?'. Here's what the platform actually penalises, what it doesn't, and the safe way to build a direct-booking channel alongside your listings.",
  keywords: [
    "taking bookings off airbnb penalty", "what happens if you take bookings off airbnb",
    "airbnb ban direct booking", "airbnb off platform policy penalty", "airbnb suspension direct booking",
  ],
  date: "2026-07-07",
  updated: "2026-07-07",
  readMins: 7,
  answerFirst:
    "Airbnb only penalises *fee circumvention*, using the platform to divert a booking off-platform (sharing contact details to move that reservation, or asking a guest to cancel and rebook direct). Penalties escalate from a warning to suspension to removal. Simply running your own direct-booking site that you market independently is **not** penalised and never has been, millions of hosts do it.",
  takeaways: [
    "The penalty risk applies to **fee circumvention**, not to having a direct channel.",
    "Consequences escalate: **warning → temporary suspension → listing or account removal**.",
    "Triggers are things like sharing contact details in chat to divert a booking, or telling a guest to cancel and rebook direct.",
    "Marketing your **own brand and website** to the world is completely safe and within the rules.",
    "The safe path: OTAs for discovery, your own site + email list for **repeat** bookings.",
  ],
  blocks: [
    { t: "p", text: "Ask in any host forum whether you can take bookings direct and you'll get a wall of nervous replies. The fear is understandable, your listings are a real income stream and nobody wants them switched off. But most of that fear is aimed at the wrong thing. Airbnb doesn't penalise hosts for having a website or repeat guests; it penalises hosts for using the platform to dodge the fee on a specific booking. Understand that distinction and the risk all but disappears." },

    { t: "h2", text: "What Airbnb actually penalises", id: "what-gets-penalised" },
    { t: "p", text: "The off-platform / fee-circumvention rules exist to stop one thing: taking a booking the platform introduced and moving it off-platform so Airbnb doesn't get paid. The behaviours that trigger action are specific:" },
    { t: "ul", items: [
      "**Sharing contact details** (phone, email, website) in Airbnb messaging *in order to divert that booking* off-platform.",
      "**Asking a confirmed guest to cancel** their Airbnb reservation and rebook with you directly.",
      "**Telling a guest, in platform chat, to 'book direct next time to avoid the fee'**, soliciting off-platform around their reservation.",
      "**Systematically funnelling** platform enquiries to your own booking channel before a reservation is made.",
    ] },
    { t: "callout", tone: "warn", title: "The common thread", text: "Every penalised behaviour uses **the platform itself** (its messaging, a live reservation) to avoid the fee. None of them is 'I have a website'. The rule is about the *booking*, not the *brand*." },

    { t: "h2", text: "What the penalties actually are (2026)" },
    { t: "p", text: "Airbnb doesn't usually swing straight to a ban. Enforcement generally escalates, and most hosts who trip the rules get a warning first:" },
    {
      t: "table",
      caption: "Typical escalation for off-platform / fee-circumvention breaches. Severity and repetition affect where you land.",
      head: ["Stage", "What happens", "Usually triggered by"],
      rows: [
        ["Warning", "A message flagging the behaviour; contact-info often auto-hidden in chat", "First/minor slip, e.g. a phone number in messaging"],
        ["Temporary suspension", "Listing hidden or account paused for a period", "Repeated or clear off-platform solicitation"],
        ["Removal", "Listing or account permanently removed", "Persistent or serious fee circumvention"],
      ],
    },
    { t: "p", text: "Airbnb's messaging system also automatically detects and hides phone numbers, emails and URLs shared in chat before a booking, so much of the risky behaviour is blocked before it even reaches the guest." },

    { t: "cta", title: "There's a zero-risk way to take direct bookings", body: "Your own website, marketed independently, breaks no rules. See what yours would look like, free, no signup.", label: "Build my free preview →", href: "/host/build" },

    { t: "h2", text: "What is completely safe" },
    { t: "p", text: "None of the following is penalised, because none of it uses the platform to divert a booking:" },
    { t: "ul", items: [
      "Owning and marketing a **direct-booking website** on your own domain.",
      "A **welcome book, business card or QR code** in the property carrying your site.",
      "Emailing **past guests whose details you collected yourself** (guest book, WiFi sign-in, your own checkout).",
      "Offering **returning guests** a direct option, and a better rate, *after* their stay.",
      "Running social media, Google Business Profile and your own email list for your brand.",
    ] },
    { t: "callout", tone: "win", title: "The reframe", text: "The question isn't 'will Airbnb ban me for going direct?' It's 'am I marketing my brand, or diverting *this* booking?' Do the first and you're one of millions of hosts safely building a direct channel. Do the second and you're gambling your listing to save one fee." },

    { t: "savings", price: 100, bookingsPerYear: 45, otaRate: 0.155, ota: "Airbnb" },

    { t: "h2", text: "The safe route to more direct bookings" },
    { t: "p", text: "Treat the OTA as your shop window and your own site as your regulars' bar. Let Airbnb and Booking.com introduce you to new guests; give every guest a reason and a way to come back direct; and keep all 'book direct' messaging on channels you own. You get the platforms' reach *and* a growing base of commission-free repeat bookings, with none of the penalty risk." },

    { t: "cta", title: "Build the channel the platforms can't switch off", body: "We create and host your direct-booking website on your own domain, with payments straight to you. List your stay and start winning repeat bookings, commission-free.", label: "See how it works →", href: "/host" },
  ],
  faqs: [
    { q: "Can Airbnb ban you for taking bookings direct?", a: "Airbnb can suspend or remove a listing for fee circumvention, diverting a specific platform booking off-platform. It does not ban hosts for having a direct-booking website they market independently. The penalty is tied to the behaviour, not to owning a direct channel." },
    { q: "What triggers an Airbnb off-platform penalty?", a: "Sharing contact details in messaging to divert a booking, asking a guest to cancel and rebook direct, or soliciting an off-platform booking around a live reservation. Airbnb also auto-hides phone numbers, emails and URLs shared in chat before a booking." },
    { q: "Will I get warned before Airbnb suspends my listing?", a: "Usually, yes. Enforcement typically escalates from a warning, to a temporary suspension, to removal, with severity depending on how clear and repeated the fee circumvention is. A single hidden phone number is very different from persistently diverting bookings." },
    { q: "Is it safe to put my website in the Airbnb listing or welcome book?", a: "A website in your on-site welcome book, signage or QR code is safe, the guest chooses to look and no booking is diverted. Putting a URL in the Airbnb listing text or pre-booking messaging to divert bookings is not; Airbnb filters URLs in those places." },
  ],
  related: ["move-airbnb-guests-to-direct-booking", "how-to-reduce-ota-commission", "airbnb-host-fees-explained"],
};
