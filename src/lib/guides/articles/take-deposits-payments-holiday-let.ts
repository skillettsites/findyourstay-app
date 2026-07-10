import type { Guide } from "../types";

export const guide: Guide = {
  slug: "take-deposits-payments-holiday-let",
  category: "Your website",
  title: "How to Take Deposits & Payments for a Holiday Let (2026)",
  h1: "How to take deposits and payments for a holiday let, on your own site",
  description:
    "The simple 2026 way to take card payments, deposits and security holds for your holiday let direct, no OTA in the middle, with money paid straight to your bank.",
  dek: "The number one worry about going direct is a practical one: \"how do I actually get paid without Airbnb handling it?\" The honest answer is that it's far easier than most hosts expect. Here's exactly how card payments, deposits, security holds and cancellations work on your own booking site in 2026, and how to protect yourself from the few things that can go wrong.",
  keywords: [
    "take deposits for a holiday let", "holiday let payment options",
    "how to take card payments for a holiday let", "security deposit holiday let",
    "stripe holiday let payments", "direct booking payment setup",
  ],
  date: "2026-07-07",
  updated: "2026-07-07",
  readMins: 7,
  answerFirst:
    "You take payments for a holiday let by connecting a payment provider like Stripe or PayPal to your own booking website. Guests pay by card at checkout, the money lands in your bank account minus a small fee (around 1.5% + 20p per UK card payment with Stripe), and you never touch or store their card details yourself.",
  takeaways: [
    "Connect **Stripe or PayPal** to your booking site and guests pay by card at checkout, with money paid straight to _your_ bank, not a platform's.",
    "UK card fees are small: roughly **1.5% + 20p** per transaction on Stripe, versus **15%+** commission on an OTA.",
    "Take a **deposit now, balance before arrival**, or full payment up front. Prepayment is the single best defence against no-shows.",
    "Handle **security deposits** with a card pre-authorisation (a hold, not a charge) so you're covered for damage without tying up the guest's cash.",
    "You never store card numbers: **Stripe and PayPal handle the sensitive data**, keeping you out of scope for the scary PCI compliance work.",
  ],
  blocks: [
    { t: "p", text: "Ask any host why they haven't gone direct and, sooner or later, you'll hear the real reason: \"I don't know how I'd actually take the money.\" It feels like the hard part, the bit Airbnb quietly does for you. In reality, taking a card payment on your own site in 2026 is genuinely simple, safer than most people assume, and cheaper than handing over a commission every single time. This guide walks through exactly how it works, from the first deposit to the security hold, and where the (small, manageable) risks actually sit." },

    { t: "h2", text: "How do I take card payments without a platform like Airbnb?", id: "how-payments-work" },
    { t: "p", text: "You connect a **payment provider** to your booking website, and it does the heavy lifting. The two most common in the UK are **Stripe** and **PayPal**. A guest picks their dates, reaches the checkout, enters their card, and the money is deposited into your own bank account a couple of days later. There's no middleman holding your funds and no platform deciding when you get paid. Setup is a one-off job: create an account, verify your identity and bank details, and connect it. FindYourStay plugs your booking site directly into _your_ Stripe or PayPal, so payments always land in your account, never ours." },
    { t: "callout", tone: "info", title: "The key thing to understand", text: "With a modern provider, **the money is yours from the moment it clears**. Stripe and PayPal are payment processors, not booking platforms: they move the card payment into your bank and take a small fee. They don't hold your revenue for weeks or take a cut of the booking value the way an OTA does." },

    { t: "cta", title: "See your booking site with payments built in", body: "Preview a real direct-booking site for your property, wired to take card payments and deposits straight into your own account. Commission-free, on your own domain, in under a minute. No signup.", label: "Build my free preview →", href: "/host/build" },

    { t: "h2", text: "What do payment fees actually cost me?" },
    { t: "p", text: "Far less than commission, and that's the whole point. A payment processor charges a small fee _per transaction_, not a percentage of your business. As a rough 2026 guide for standard UK cards, Stripe is around **1.5% + 20p** and PayPal around **2.9% + 30p** for online card payments. Rates vary by card type (commercial and non-UK cards cost more) and change over time, so always check the provider's current pricing. Compare that with a typical OTA commission of **15% or more** and the maths speaks for itself." },
    {
      t: "table",
      caption: "Illustrative fees on a £600 booking (standard UK card, 2026). Provider rates change, so check current pricing.",
      head: ["Route", "Rough fee", "You keep"],
      rows: [
        ["Stripe (~1.5% + 20p)", "~£9.20", "~£590.80"],
        ["PayPal (~2.9% + 30p)", "~£17.70", "~£582.30"],
        ["Airbnb host commission (~15%)", "~£90.00", "~£510.00"],
      ],
    },
    { t: "p", text: "On a single £600 stay, going direct with Stripe keeps roughly **£80 more in your pocket** than the OTA route. Over a season of bookings, that difference funds a lot of new towels, or a very nice holiday of your own." },

    { t: "h2", text: "Deposit then balance, or pay in full?" },
    { t: "p", text: "This is your call, and both work well on a direct site. The two common models:" },
    { t: "ul", items: [
      "**Deposit now, balance before arrival.** Guests pay a percentage (often 25% to 50%) to confirm the booking, then the remainder is due a set number of days before check-in, commonly 14 to 60 days out. This mirrors what OTA guests are used to and feels low-commitment at the point of booking.",
      "**Pay in full at booking.** Simplest to run, strongest protection against no-shows, and best for short-notice or last-minute stays where there's no time to collect a balance. Many hosts use full payment for bookings inside their balance window and a deposit split for anything further out.",
    ] },
    { t: "callout", tone: "win", title: "Prepayment quietly kills no-shows", text: "The moment a guest has real money committed, cancellations and no-shows drop sharply. A confirmed card payment (even a modest deposit) turns a soft \"maybe\" into a firm booking, which is why prepayment is standard across the whole industry. It's protection for you and clarity for them." },

    { t: "savings", price: 120, bookingsPerYear: 40, otaRate: 0.155, ota: "Airbnb" },

    { t: "h2", text: "How do I take a refundable security deposit?" },
    { t: "p", text: "For breakages and damage, the cleanest tool is a **card pre-authorisation**, not an actual charge. A pre-auth places a temporary _hold_ on the guest's card for a set amount (say £150 to £500) without moving the money. If the stay goes fine, the hold is released and the guest is never charged. If there's damage, you capture some or all of it. Providers like Stripe support authorising a card now and only capturing later, which is exactly what a security deposit needs." },
    { t: "p", text: "Pre-auth holds don't last forever (Stripe holds are typically valid for up to 7 days), so for longer or later stays many hosts instead take a small refundable deposit as a real payment and refund it after checkout, or use a damage-waiver fee (a small non-refundable charge that covers minor accidental damage). Any of these is far tidier than the old approach of asking for cash or a bank transfer on arrival." },
    {
      t: "table",
      caption: "Three ways to cover damage on a direct booking.",
      head: ["Method", "How it works", "Best for"],
      rows: [
        ["Card pre-authorisation", "Temporary hold on the card, released if no damage", "Short stays, no cash tied up"],
        ["Refundable deposit", "Real payment taken, refunded after checkout", "Longer or later bookings"],
        ["Damage waiver fee", "Small non-refundable fee covers minor damage", "Guests who dislike large holds"],
      ],
    },

    { t: "h2", text: "Why not just take a bank transfer?" },
    { t: "p", text: "You can, but it's clunky and it's riskier than it looks. Bank transfers put all the friction on the guest: they have to leave your site, log into their banking app, copy your account details and type a reference, and plenty simply don't finish. You then have to manually watch your account and confirm each one landed before you can mark the booking as paid. Worse, sharing your account details by email is a well-known fraud target, and there's no built-in refund or dispute process if something goes wrong. A card checkout is instant, automatic and far more reassuring to a guest handing over hundreds of pounds to a name they found online. Offer bank transfer as a backup if you like, but don't make it the main way in." },

    { t: "h2", text: "What about chargebacks and getting scammed?" },
    { t: "p", text: "A **chargeback** is when a guest disputes a card payment with their bank and asks for the money back. They're rare in holiday lets, but worth understanding. The bank reverses the payment while it investigates, and the provider usually charges a small dispute fee (around £15 on Stripe). You then submit evidence, and if the claim is unfounded you can win the money back. The best protection is simply good record-keeping." },
    { t: "ul", items: [
      "Keep your **booking confirmation, dates and guest messages** so you can prove the stay was real and agreed.",
      "Have **clear, visible terms** at checkout (cancellation policy, deposit rules, house rules) that the guest accepts when they pay.",
      "Use the provider's **built-in fraud checks** (Stripe and PayPal screen risky payments automatically) and be cautious with unusual last-minute, high-value bookings.",
      "For extra peace of mind, providers offer optional fraud tools that flag or block suspicious cards before they ever reach you.",
    ] },
    { t: "callout", tone: "warn", title: "A dispute is not a disaster", text: "Chargebacks feel alarming the first time, but they're a normal, manageable part of taking card payments (OTAs deal with them too, you just never see it). With a real booking, clear terms and a paper trail, most spurious disputes are winnable. Don't let the fear of a rare event keep you paying 15% forever." },

    { t: "h2", text: "Is it safe? Do I have to handle card details?" },
    { t: "p", text: "No, and this is the part that quietly removes most of the worry. With Stripe or PayPal, **the card details never touch your website or your inbox**. The guest enters their card into the provider's own secure, hosted checkout, and you only ever receive a confirmation that payment succeeded. That means you're kept out of scope for the heavy **PCI DSS** compliance obligations that would apply if you were storing card numbers yourself. The provider is the one handling encryption, security and regulation; you just get told the booking is paid. It's genuinely safer than the old paper-card-slip world, and safer than emailing bank details around." },

    { t: "h2", text: "Where do cancellation terms fit in?" },
    { t: "p", text: "Your **cancellation policy** is what ties the payment side together, and going direct means _you_ set it rather than accepting a platform's. Decide how much notice earns a full or partial refund, whether the deposit is non-refundable, and what happens for no-shows. Show these terms clearly at checkout so the guest agrees to them as they pay. A fair, plainly-worded policy protects your income, sets expectations, and (as noted above) is exactly the evidence that helps you win any dispute. You can be more generous than an OTA to win the booking, or firmer to protect peak dates, because the choice is finally yours." },

    { t: "cta", title: "Get paid direct, keep the commission", body: "We build and host your booking website on your own domain and wire it to your own Stripe or PayPal, so deposits and payments land straight in your account with 0% platform commission. Money in the middle: none.", label: "See how it works →", href: "/host" },
  ],
  faqs: [
    { q: "How do I take payments for a holiday let without Airbnb?", a: "Connect a payment provider such as Stripe or PayPal to your own booking website. Guests pay by card at checkout, the funds are deposited into your own bank account minus a small per-transaction fee, and no platform sits in the middle taking commission or holding your money." },
    { q: "What fees do Stripe and PayPal charge in the UK?", a: "As a rough 2026 guide, Stripe charges around 1.5% + 20p and PayPal around 2.9% + 30p per online card payment for standard UK cards. Rates vary by card type and change over time, so check the provider's current pricing. Both are far cheaper than a typical 15%+ OTA commission." },
    { q: "How do I take a security deposit for damage?", a: "The cleanest way is a card pre-authorisation, which places a temporary hold on the guest's card without charging it. If there's no damage, the hold is released. For longer stays you can instead take a small refundable deposit as a real payment and refund it after checkout, or charge a damage-waiver fee." },
    { q: "Do I have to handle guests' card details myself?", a: "No. With Stripe or PayPal, guests enter their card into the provider's own secure hosted checkout, so the details never touch your website or inbox. This keeps you out of scope for the heavy PCI compliance work and means the provider handles all the encryption and security." },
    { q: "What happens if a guest does a chargeback?", a: "The guest's bank reverses the payment while it investigates a dispute, and the provider usually charges a small fee (around £15 on Stripe). You submit evidence such as the booking confirmation and agreed terms, and unfounded claims can be won back. Chargebacks are rare in holiday lets and manageable with good records." },
  ],
  related: ["take-bookings-on-your-own-website", "do-i-need-a-website-for-my-bnb", "best-direct-booking-website-builders"],
};
