import type { Guide } from "../types";

export const guide: Guide = {
  slug: "how-much-does-a-bnb-website-cost",
  category: "Your website",
  title: "How Much Does a B&B Website Cost? 2026 UK Price Guide",
  h1: "How much does a B&B or holiday let website cost in 2026?",
  description:
    "A straight-talking 2026 UK price guide to B&B, guesthouse and holiday let websites: builder, booking-system, WordPress, agency and done-for-you costs compared.",
  dek: "From £100-a-year Wix sites to £15,000 agency builds, the sticker price is only half the story. Here is what a small UK host actually pays once you add a real booking system, and where the hidden per-booking fees hide.",
  keywords: [
    "how much does a bnb website cost",
    "holiday let website cost uk",
    "bed and breakfast website cost",
    "b&b booking system cost",
    "direct booking website price",
    "guesthouse website builder cost",
  ],
  date: "2026-07-07",
  updated: "2026-07-07",
  readMins: 7,
  answerFirst:
    "Most small UK hosts pay **£100 to £350 a year** for a working B&B or holiday let website once you add a booking system. A general builder like Wix or Squarespace runs £110-£300/yr but needs a booking tool bolted on; dedicated systems like Freetobook or Bookalet add £0-£170/yr; agency builds cost **£2,000-£15,000** up front.",
  takeaways: [
    "A pretty website is not the cost that matters: the real number is **website plus a booking engine that takes payment**, and that is where cheap builders quietly get expensive.",
    "General builders (**Wix, Squarespace, GoDaddy**) are roughly **£110-£300/yr** but have no proper accommodation booking calendar, so you bolt one on.",
    "Booking-specific tools (**Freetobook, Bookalet**) are **£0-£170/yr** and brilliant at availability, but many charge a **per-booking fee or payment-gateway %** even on your own direct bookings.",
    "A custom **agency build is £2,000-£15,000** up front plus maintenance, and rarely pays back for a one or two-room host.",
    "**Done-for-you** services like FindYourStay sit in the honest middle: around **£120/yr** for the website on top of a directory listing plan, built and hosted for you, **0% commission** on the bookings.",
  ],
  blocks: [
    { t: "p", text: "\"How much does a website cost?\" is one of those questions where every answer is technically true and completely unhelpful. You can spend £0 or £15,000 and both are real. For an independent B&B, guesthouse or holiday let, the number that actually matters is not the price of a nice-looking page: it is the total yearly cost of a site that lets a guest _check dates, book, and pay you_ without a platform sitting in the middle taking a cut. This guide breaks down the real 2026 UK price bands, what drives them, and the per-booking fees that don't show up on the pricing page." },

    { t: "h2", text: "What are you actually paying for?", id: "what-drives-cost" },
    { t: "p", text: "The cost of a booking website is really four separate things stacked together, and cheap options save money by leaving some of them out." },
    { t: "ul", items: [
      "**The website itself:** design, pages, photos, your domain name and the hosting that keeps it online (SSL, uptime, backups).",
      "**The booking engine:** a live availability calendar that stops double-bookings, takes card payment or a deposit, and syncs with Airbnb and Booking.com so your dates never clash.",
      "**Payments:** a card processor (usually Stripe or similar) charging roughly **1.5%-3% + ~20p** per transaction. Everyone pays this; it is not optional.",
      "**Upkeep:** updates, plugin renewals, security, and the hours you or someone else spends keeping it all working.",
    ] },
    { t: "callout", tone: "info", title: "The rule of thumb", text: "A brochure website is cheap. A website that _takes bookings and payments and syncs your calendar_ is the real product, and its price is set by the booking engine, not the pretty template on top." },

    { t: "cta", title: "See what a done-for-you site would look like", body: "Skip the pricing-page maths. Preview a real booking website for your place, on your own domain, commission-free, in under a minute. No signup, no card.", label: "Build my free preview →", href: "/host/build" },

    { t: "h2", text: "How much do Wix, Squarespace and GoDaddy cost for a B&B?", id: "general-builders" },
    { t: "p", text: "A general builder costs roughly **£110-£300 a year**, but none of them ship with a proper accommodation booking calendar, so you almost always bolt a booking tool on top. Squarespace runs about £12-£17/mo on annual billing (with a free domain for year one) and its built-in Acuity scheduling suits appointments better than multi-night stays. Wix starts around £9/mo and has booking add-ons, though they are aimed at classes and slots rather than nightly availability with deposits and OTA sync. GoDaddy sits in a similar band. These builders are genuinely good at design and easy to start with; the catch is that the booking side is an afterthought, so you end up paying for the builder _and_ a separate booking system." },

    { t: "h2", text: "What about dedicated booking systems like Freetobook and Bookalet?", id: "booking-systems" },
    { t: "p", text: "Booking-specific tools are the sweet spot for availability and cost surprisingly little to start, but read the fee line carefully. **Freetobook** has a free base booking engine, and crucially your own direct bookings stay free; you pay only around £1 per booking made through connected channels (capped at roughly £49/mo), plus small fees for extras like a channel manager or payments. **Bookalet** starts at about £129-£139/yr for its Lite plan, with an optional website builder module at roughly £150-£195/yr on top and payment-gateway fees of 1%-3%. Both are excellent at calendars and OTA sync. The trade-off: the website they give you is functional rather than beautiful, and you are the one wiring it all together." },
    { t: "callout", tone: "warn", title: "The hidden per-booking gotcha", text: "\"Free\" and \"low-cost\" booking tools often earn on a **per-booking fee or a payment mark-up**, sometimes even on bookings that came straight from your own website. Always check whether _direct_ bookings are genuinely free or quietly carry a percentage. A £0/yr tool that skims 2% on every booking is not £0." },

    { t: "h2", text: "Is WordPress plus a booking plugin cheaper?", id: "wordpress" },
    { t: "p", text: "On paper WordPress looks the cheapest, and for a technical host it can be. Reckon on hosting at roughly £60-£150/yr, a premium theme at a one-off £40-£80, and an accommodation booking plugin at around £70-£200/yr. So £150-£400/yr all-in, before your time. The honest catch is that time: WordPress is a maintenance commitment. Plugins update, break, and occasionally conflict; security patches matter; and if something goes wrong at 9pm the night before a guest arrives, you are the support team. It is the best-value route if you enjoy tinkering, and a false economy if you don't." },

    { t: "savings", price: 110, bookingsPerYear: 45, otaRate: 0.155, ota: "Airbnb" },

    { t: "h2", text: "How much does a custom or agency-built website cost?", id: "agency" },
    { t: "p", text: "A bespoke design agency build typically runs **£2,000-£15,000 up front**, plus ongoing maintenance or a retainer. For a boutique hotel or a portfolio of holiday lets with a real brand budget, that can be money well spent. For a one or two-room B&B, it rarely pays back: you are buying a level of customisation you don't need, and you inherit a site that costs money every time it needs a change. Unless you have a specific reason to go bespoke, a small host almost never needs to spend four figures to take direct bookings." },

    { t: "h2", text: "What does a done-for-you service like FindYourStay cost?", id: "done-for-you" },
    { t: "p", text: "Done-for-you sits in the honest middle: someone builds and hosts the whole thing for you, booking engine included, and you pay a predictable yearly fee instead of assembling parts. With FindYourStay, you take a directory listing plan (roughly **£79-£299/yr** depending on tier) and add the booking website for around **£120/yr** on top. That covers the design, hosting, SSL, your own domain and a booking flow that pays you directly. The part that matters most: we charge **0% commission** on the bookings themselves. You still pay the unavoidable card-processing fee, but no platform cut and no per-booking skim." },
    { t: "callout", tone: "win", title: "Why the commission line is the whole game", text: "A website's yearly fee is fixed and small. Platform commission is a **percentage of everything you earn, forever**. Move even 30-40 nights a year to a direct, 0%-commission site and the saving dwarfs what any of these websites cost. The cheapest website is the one that stops handing **~15% of every booking** to Airbnb." },

    { t: "h2", text: "So which option is right for a small host?", id: "which-option" },
    { t: "p", text: "Here is the realistic 2026 UK picture, side by side. Prices are typical ranges and exclude the card-processing fee everyone pays." },
    {
      t: "table",
      caption: "Typical 2026 UK costs for a small B&B or holiday let booking website. Excludes card-processing fees (~1.5%-3% + ~20p per transaction), which apply to every option.",
      head: ["Option", "Typical yearly cost", "Booking engine?", "Commission on direct bookings", "Best for"],
      rows: [
        ["Wix / Squarespace / GoDaddy", "£110-£300", "Bolt-on, weak for stays", "None from builder (card fees only)", "Design-led hosts happy to add a booking tool"],
        ["Freetobook", "£0-£150 + extras", "Yes, strong", "Direct usually free; channel bookings ~£1 each", "Budget-conscious hosts who will self-assemble"],
        ["Bookalet", "£129-£340 all-in", "Yes, strong", "Payment-gateway 1%-3%", "Self-catering hosts wanting calendar + site"],
        ["WordPress + booking plugin", "£150-£400 + your time", "Yes, via plugin", "None beyond card fees", "Technical hosts who enjoy maintaining it"],
        ["Custom agency build", "£2,000-£15,000 up front", "Custom", "None beyond card fees", "Boutique hotels / branded portfolios"],
        ["FindYourStay (done-for-you)", "~£120 site + £79-£299 listing", "Yes, built for you", "0%", "Independent hosts who want it done + a direct channel"],
      ],
    },
    { t: "p", text: "The right answer depends on your appetite for admin, not just your budget. If you love a project, WordPress or Freetobook self-assembly is the cheapest route in pure pounds. If you want it handled and want a booking channel that keeps 100% of what guests pay, a done-for-you site earns its fee back fast. Whichever you pick, the goal is the same: get off the commission treadmill. Our guides on [whether you even need a website](/guides/do-i-need-a-website-for-my-bnb), [the best direct-booking builders](/guides/best-direct-booking-website-builders), and [how to take bookings on your own site](/guides/take-bookings-on-your-own-website) go deeper on each path." },

    { t: "callout", tone: "info", title: "Watch the ongoing costs, not just the setup", text: "A £2,000 agency build sounds worse than a £120 subscription until you count year three. Add up the domain, hosting, SSL, plugin renewals, payment fees and _your hours_ across a few years. A predictable all-in yearly fee is usually cheaper and far less stressful than a cheap starting price with surprises attached." },

    { t: "cta", title: "The honest middle option, done for you", body: "We build and host your direct-booking website on your own domain, take payments straight to your account, and charge 0% commission on the bookings. One predictable yearly fee, no per-booking skim.", label: "See how it works →", href: "/host" },
  ],
  faqs: [
    { q: "How much does a B&B website cost per year in the UK?", a: "Most small hosts pay around £100 to £350 a year once a real booking system is included. General builders like Wix or Squarespace are £110-£300/yr but need a booking tool added; dedicated systems like Freetobook or Bookalet are £0-£170/yr. Everyone also pays card-processing fees of roughly 1.5%-3% per transaction on top." },
    { q: "Do I need a separate booking system as well as a website?", a: "Usually yes if you use a general builder. Wix, Squarespace and GoDaddy are designed for brochure sites and appointments, not multi-night stays with deposits and calendar sync, so you bolt on a booking engine. Dedicated tools and done-for-you services include the booking engine, so there is nothing extra to wire up." },
    { q: "Are cheap booking systems really free?", a: "Rarely fully free. Many low-cost or free tools earn on a per-booking fee or a payment-gateway mark-up of 1%-3%, sometimes even on bookings that came from your own website. Always check whether direct bookings are genuinely free before you assume a tool is £0, because a small percentage on every booking adds up fast." },
    { q: "Is it worth paying for a custom agency-built website?", a: "For a boutique hotel or a branded portfolio, sometimes. For a one or two-room B&B, rarely. An agency build costs £2,000-£15,000 up front plus maintenance, and a good template or done-for-you site takes direct bookings just as well for a fraction of the cost." },
    { q: "What is the cheapest way to take direct bookings?", a: "In pure pounds, WordPress with a booking plugin or Freetobook's free base engine are the cheapest, if you are happy to assemble and maintain them yourself. If you value your time, a done-for-you site at around £120/yr is cheap once you count the hidden hours and the commission you stop paying Airbnb and Booking.com." },
  ],
  related: [
    "do-i-need-a-website-for-my-bnb",
    "best-direct-booking-website-builders",
    "take-bookings-on-your-own-website",
  ],
};
