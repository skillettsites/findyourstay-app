import type { Guide } from "../types";

export const guide: Guide = {
  slug: "email-marketing-for-bnbs",
  category: "Growth",
  title: "Email Marketing for B&Bs: Turn Guests Into Repeat Bookings",
  h1: "Email marketing for B&Bs: turn past guests into repeat direct bookings",
  description:
    "How independent UK hosts use email to win repeat direct bookings: collecting guest emails compliantly under UK GDPR & PECR, what to send, and how to measure it.",
  dek: "Your past guests are the warmest, cheapest bookings you will ever get, and email is the only channel where you actually own the relationship. Here is how to build a guest list the compliant way, what to send it, and why one repeat direct booking beats an OTA stay on margin every time.",
  keywords: [
    "email marketing for b&bs",
    "guest email list",
    "repeat direct bookings",
    "b&b email marketing uk",
    "pecr soft opt-in accommodation",
    "past guest email marketing",
  ],
  date: "2026-07-07",
  updated: "2026-07-07",
  readMins: 7,
  answerFirst:
    "Email is the highest-ROI channel for repeat direct bookings because you own the list outright: no commission, no algorithm, no platform in the middle. Collect guest emails through your own channels (your site, WiFi sign-in, guest book), never from OTA inboxes, keep it compliant under UK GDPR and PECR, then send a small number of genuinely useful emails a year. One repeat direct booking beats the same OTA stay on margin.",
  takeaways: [
    "Your email list is the **only** guest channel you truly own; an OTA can change its fees or bury your listing overnight, your inbox cannot.",
    "Collect emails through **your own** channels (website, WiFi sign-in, paper guest book), never scrape them from the Airbnb or Booking.com message thread.",
    "Under UK GDPR & PECR you generally need consent, but the **soft opt-in** can let you email past guests about similar stays if you meet all four conditions.",
    "Send few, useful emails: a welcome, a post-stay thank you, an off-season or last-minute offer, and a **returning-guest direct rate** they cannot get on an OTA.",
    "A repeat guest booked direct is a **~15% pay rise** on that stay versus the OTA, with zero acquisition cost.",
  ],
  blocks: [
    { t: "p", text: "Ask most independent hosts where their next booking comes from and the honest answer is \"whatever Airbnb or Booking.com decides to send me.\" That is a rough place to build a business: the platform owns the guest, sets the fee, and controls whether anyone ever sees your listing again. Email flips that. A guest email list is the one marketing asset a platform can never switch off, re-rank or tax. Get a few dozen past guests onto a list you own, email them well, and you turn one-off stays into a compounding stream of repeat direct bookings. This guide covers why it works, how to collect emails without breaking UK law, exactly what to send, and how to tell if it is paying off." },

    { t: "h2", text: "Why is email the best channel for repeat bookings?", id: "why-email" },
    { t: "p", text: "Because you own it. Social reach rises and falls on an algorithm; OTA visibility rises and falls on a fee auction; but an email address sits in your list until the guest chooses to leave. That ownership is the whole game. It also happens to be the cheapest channel in hospitality: a past guest already knows your beds, your breakfast and your welcome, so the acquisition cost of the second booking is effectively zero, and there is no commission skimmed off the top. Benchmarks back this up. Hotel and accommodation emails typically see open rates around **25 to 30%**, and while a one-off campaign might earn a click rate near **2 to 3%**, automated, well-timed emails to people who have actually stayed with you perform far better. The numbers are only ever a rough guide, but the direction is not in doubt: warm past guests are the most responsive audience you have." },
    { t: "callout", tone: "win", title: "The margin maths", text: "A returning guest who books through your own site costs you nothing to reach and pays **no OTA commission**. On a typical stay that commission is around 15%, so every repeat booking you move to direct is close to pure margin. You do not need a big list for this to matter; you need a *loyal* one." },

    { t: "cta", title: "Give past guests somewhere to book direct", body: "An email list only pays off if the link in the email lands on a site that actually takes the booking. Preview yours, commission-free, on your own domain, in under a minute. No signup.", label: "Build my free preview →", href: "/host/build" },

    { t: "h2", text: "How do I collect guest emails legally in the UK?", id: "collecting-emails" },
    { t: "p", text: "Collect them through channels **you** own, and be honest about what you will do with them. The safe sources are your own website checkout, a WiFi sign-in page, a paper guest book, a local-tips or offers signup, or a booking enquiry form. What you must never do is lift email addresses out of the Airbnb or Booking.com message thread to add them to a marketing list, that both breaks the platforms' off-platform rules and gives you no lawful basis to email them. If you are converting OTA guests into direct bookers, do it the compliant way set out in our guide to [moving Airbnb guests to direct booking](/guides/move-airbnb-guests-to-direct-booking): win the relationship in person and on your own site, then invite them to join your list, rather than harvesting contacts behind the platform's back." },
    { t: "p", text: "The other half of \"legal\" is UK GDPR and PECR, the rules that govern marketing emails. In most cases PECR expects **consent**: an active, unbundled opt-in where the guest ticks a box or types their address into a form that clearly says you will email them offers. There is, however, a narrower route called the **soft opt-in** that can apply to your own past customers." },
    { t: "callout", tone: "warn", title: "UK GDPR & PECR: the soft opt-in, in plain terms", text: "The ICO's soft opt-in can let you email a past guest about similar stays **only if all four conditions are met**: (1) you got their details during a booking or an enquiry to book; (2) you are marketing similar things (your accommodation, not an unrelated product); (3) you gave a simple opt-out *at the point you collected the address*; and (4) every email since has carried a clear, one-click unsubscribe. If you did not offer that opt-out when you took the details, you need explicit consent instead. This is general guidance, not legal advice, check the current ICO rules and keep a record of how each contact opted in." },
    { t: "p", text: "Two practical habits keep you safe: log **how and when** each person joined your list (a timestamp and source), and put a working unsubscribe link in every single email. Honour opt-outs immediately. Do this and you are on solid ground; skip it and a single complaint can become an ICO headache." },

    { t: "h2", text: "What should I actually send my past guests?", id: "what-to-send" },
    { t: "p", text: "Fewer, better emails. Nobody stayed at your B&B hoping for a weekly newsletter, so aim for a handful of genuinely useful, well-timed messages a year. This sequence works for almost any independent host." },
    { t: "ol", items: [
      "**Collect the email compliantly first.** A WiFi sign-in, a guest-book line, or a checkbox on your own booking form, each with a clear note that you will email occasional offers and a way to opt out. Never from the OTA inbox.",
      "**A welcome / thank-you for joining.** Sent the moment someone signs up: a warm hello, a line on what to expect (a few offers a year, not spam), and maybe a local tip. First impressions set your open rates for everything after.",
      "**A post-stay thank you.** A day or two after checkout, thank them, invite a review, and gently mention that returning guests can book direct next time. This is your highest-intent moment; they just loved the place.",
      "**Off-season and last-minute offers.** When your calendar has gaps, email a modest, time-limited direct rate. A quiet Tuesday filled by a past guest is money you would otherwise never see, and it is far cheaper than discounting on an OTA.",
      "**A standing returning-guest direct rate, plus segmentation.** Give past guests a small \"welcome back\" price they can only get direct, and split your list so the right message reaches the right person, for example past guests versus enquiries who never booked, or families versus couples. Segmented, personalised sends reliably lift opens and clicks, often by a wide margin, because the message finally fits the reader." ] },
    { t: "p", text: "You can also drop in the occasional local-events email (a festival, a food week, a Christmas market) when it gives someone a real reason to come back. The test for any email is simple: would a past guest be glad to receive it? If not, do not send it." },

    { t: "savings", price: 100, bookingsPerYear: 40, otaRate: 0.155, ota: "Airbnb" },

    { t: "h2", text: "Which tools do I need, and how do I measure success?", id: "tools-and-measuring" },
    { t: "p", text: "You do not need anything fancy. A free or low-cost email tool such as Mailchimp, MailerLite, Brevo or Substack handles signup forms, stores consent, sends the emails and, crucially, provides the unsubscribe link and record-keeping PECR expects. Start with one signup form on your website and one welcome email; add the rest as you go. The point is to own the list, not to run a marketing department." },
    { t: "p", text: "Measuring it is refreshingly concrete for a small host. Watch three things: your **open rate** (are people even seeing it? treat inflated figures from privacy features with a pinch of salt), your **click rate** (are they tapping through to book?), and the number that actually pays your mortgage, **direct bookings that came from an email**. If you tag or simply ask \"how did you hear about us?\", you can trace real stays back to specific sends. Even one or two repeat direct bookings a year from a list of a few dozen guests will out-earn the hour it took to set up, because each one skips the commission entirely." },

    { t: "h2", text: "Does a repeat direct booking really beat an OTA booking?", id: "direct-vs-ota" },
    { t: "p", text: "On margin, yes, and it is not close. The same guest paying the same nightly rate is worth roughly 15% more to you booked direct than through an OTA, simply because no commission is deducted. Now stack the other advantages: you already know they are a good guest, you paid nothing to reach them, you own their contact details for next time, and you are not competing against a hundred other listings in a search ranking. An OTA is a brilliant machine for finding you *strangers*; it is a terrible way to keep the *friends* you have already made. Email is how you keep them." },

    { t: "cta", title: "Own the guests you have already earned", body: "We build and host your direct-booking website on your own domain, with payments straight to you, 0% commission, and a place for your email list to send guests. See how independent UK hosts turn past stays into repeat direct bookings.", label: "See how it works →", href: "/host" },
  ],
  faqs: [
    { q: "Is email marketing worth it for a small B&B?", a: "Yes, arguably more so than for a large hotel. Your past guests are a small but loyal audience, and email is the one channel you own outright, no commission and no algorithm deciding who sees you. Even a couple of repeat direct bookings a year from a list of a few dozen guests will comfortably out-earn the small effort of setting it up." },
    { q: "Can I email my Airbnb or Booking.com guests?", a: "Only if you collected their email through your own channels (your website, a WiFi sign-in, a guest book) with a clear opt-in, not by taking it from the platform's message thread. Scraping contacts from an OTA inbox breaks the platform's off-platform rules and leaves you with no lawful basis under UK GDPR and PECR to market to them." },
    { q: "What are the UK GDPR and PECR rules for guest emails?", a: "In most cases PECR expects clear consent: an active opt-in where the guest knowingly agrees to receive your emails. A narrower soft opt-in can apply to past customers if you obtained their details during a booking or enquiry, you market only similar stays, you offered an opt-out when you collected the address, and every email carries a one-click unsubscribe. Keep a record of how each person opted in, and check current ICO guidance as this is not legal advice." },
    { q: "How often should I email past guests?", a: "Rarely and usefully. A welcome when they join, a post-stay thank you, and a small number of seasonal or last-minute offers across the year is plenty. The moment your emails feel like spam, opens fall and unsubscribes rise, so only send when a past guest would genuinely be glad to hear from you." },
    { q: "How do I get guests onto my email list in the first place?", a: "Through channels you own: a signup checkbox on your booking form, a WiFi sign-in splash page, a paper guest book, or a local-tips and offers signup in the room. Each should say plainly that you will send occasional offers and give a simple way to opt out. Collect it yourself, honestly, and it is yours to use." },
  ],
  related: ["how-to-get-direct-bookings", "move-airbnb-guests-to-direct-booking", "increase-bookings-small-bnb"],
};
