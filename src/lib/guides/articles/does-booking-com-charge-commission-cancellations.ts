import type { Guide } from "../types";

export const guide: Guide = {
  slug: "does-booking-com-charge-commission-cancellations",
  category: "Commissions & fees",
  title: "Does Booking.com Charge Commission on Cancellations & No-Shows? 2026",
  h1: "Does Booking.com charge commission on cancellations and no-shows?",
  description:
    "Whether Booking.com takes commission on a cancelled booking or a no-show in 2026, when you owe nothing, and how to mark it in the Extranet so you never overpay.",
  dek: "The honest answer is: it depends on whether any money actually changes hands. Here's exactly when Booking.com charges commission on a cancellation or no-show in 2026, when it doesn't, and the Extranet steps that stop you paying commission on money you never received.",
  keywords: [
    "does booking.com charge commission on cancellations",
    "booking.com no-show commission",
    "booking.com cancellation fee commission",
    "booking.com extranet mark no-show",
    "booking.com commission refund",
    "booking.com host fees cancellation",
  ],
  date: "2026-07-07",
  updated: "2026-07-07",
  readMins: 6,
  answerFirst:
    "Booking.com charges commission on the amount you are actually paid, not on the booking value. A free cancellation within policy earns you nothing, so there is no commission. But if you keep a cancellation fee or a no-show fee under a non-refundable or partial-refund policy, Booking.com generally takes its commission on that kept amount. Mark the outcome in the Extranet promptly or you can be billed on money you never saw.",
  takeaways: [
    "Commission follows the **money you keep**, not the headline booking value.",
    "A **free cancellation** inside the guest's policy window means no revenue and **no commission**.",
    "A kept **cancellation fee or no-show fee** (non-refundable or partial) is generally **subject to commission**.",
    "You **must mark** genuine no-shows and cancellations in the Extranet, or you can be charged commission on money you never received.",
    "On a **direct booking** you set your own cancellation terms and keep 100% of whatever you charge, with no platform taking a cut.",
  ],
  blocks: [
    { t: "p", text: "It is one of the most confusing corners of hosting on Booking.com: a guest cancels, or simply never turns up, and weeks later a commission line appears on your invoice. Are you really paying a cut on a booking that never happened? Sometimes yes, sometimes no, and the difference comes down to two things: whether you actually collected any money, and whether you told the Extranet what happened in time. Get both right and you only ever pay commission on income you genuinely received. Get them wrong and you can end up paying for money that never reached your account." },

    { t: "h2", text: "So does Booking.com take commission when a guest cancels?", id: "cancellations" },
    { t: "p", text: "It depends on whether you keep any money. Booking.com's commission is charged on the amount you are actually paid, so the outcome of the cancellation decides everything. If the guest cancels inside a **free cancellation** window, there is no charge to them and no revenue to you, so there is nothing for Booking.com to take a percentage of. But if the reservation was **non-refundable**, or the guest cancels after the free window and your policy lets you keep a cancellation fee, then that kept fee counts as income and commission generally applies to it. In other words, commission tracks the money, not the fact that a stay was booked." },
    { t: "callout", tone: "info", title: "The one rule to remember", text: "Commission is charged on what you are **paid**, not on the original booking total. No payment kept means no commission. A kept cancellation or no-show fee is treated as income, and commission applies to that amount." },

    { t: "cta", title: "Bookings where cancellations are yours to keep", body: "On your own direct-booking site you write the cancellation terms and keep every penny of any fee you charge. Preview your commission-free site, on your own domain, in under a minute. No signup.", label: "Build my free preview →", href: "/host/build" },

    { t: "h2", text: "What about a no-show, does Booking.com still charge me?" },
    { t: "p", text: "Same principle, with one extra step you cannot skip. If a guest never arrives and your rate plan allows a no-show charge, the amount you collect is income, so commission generally applies to it, just as it would on a completed stay. The catch is that Booking.com does not automatically know the guest failed to show up. You have to **report the no-show in the Extranet**. Do that and your invoice reflects what actually happened. Forget to, and the system assumes the stay went ahead as booked, which can leave you paying commission on the full reservation value even though the room sat empty." },
    { t: "callout", tone: "warn", title: "How to mark a no-show in the Extranet", text: "Open the **Reservations** tab, click the guest's name, and use **Mark as a no-show**. This option is only available from midnight on the check-in date until roughly 48 hours after the scheduled check-out, so do it promptly. You will be asked whether to charge or waive the fee: charge it and commission applies to that fee; waive it and you collect nothing, so there is no commission either. Always record cancellations and no-shows within 48 hours of check-out so your commission billing is correct. Details and timings can change, so check your current Extranet guidance." },

    { t: "h2", text: "When do I pay no commission at all?" },
    { t: "p", text: "There are a few clean cases where you owe Booking.com nothing. If you **waive the fee** when marking a cancellation or no-show, you collect no money, so there is no commission (you can also usually dispute commission on a fee you have genuinely waived). If a guest's payment card comes back **invalid**, you can mark the card as invalid in the Extranet; the guest is asked to provide valid details within a short window, and if they do not, the reservation is cancelled and you are not charged commission for it. And of course a straightforward **free cancellation** inside the guest's policy carries no charge and no commission. The common thread: no money to you means no cut to them." },

    {
      t: "table",
      caption: "General guidance based on Booking.com's cancellation, no-show and commission policies for 2026. Always check your current Extranet terms, as specifics can change.",
      head: ["Scenario", "Is commission charged?"],
      rows: [
        ["Free cancellation within the guest's policy window", "No. You keep nothing, so there is nothing to charge commission on."],
        ["Non-refundable booking, cancellation fee kept", "Yes. The fee you keep is income, so commission generally applies to it."],
        ["No-show, fee charged and marked in the Extranet", "Yes, on the fee you collect. Not on the full booking value if reported correctly."],
        ["No-show, fee waived when marking it", "No. You collect nothing, so no commission is due."],
        ["Partial charge (part refund, part fee kept)", "Yes, on the portion you actually keep, not the full amount."],
        ["No-show never reported in the Extranet", "Risk of commission on the full booking value, money you never received."],
        ["Invalid card, reservation auto-cancelled", "No, once the card is correctly marked invalid in the Extranet."],
      ],
    },

    { t: "savings", price: 100, bookingsPerYear: 50, otaRate: 0.15, ota: "Booking.com" },

    { t: "h2", text: "Why marking it correctly matters so much" },
    { t: "p", text: "The single biggest way hosts overpay is not the commission rate itself, it is failing to record what really happened. If a guest cancels or no-shows and you never mark it, Booking.com's system treats the reservation as a completed stay and bills commission on the full value. You then have to notice the error and **dispute it on your invoice**, which is extra admin and not always successful after the fact. Marking cancellations and no-shows within that 48-hour window is the cheap insurance that keeps your commission tied to real income. Set a habit of clearing your Reservations tab every couple of days and you will rarely, if ever, pay for a stay that never occurred." },
    { t: "ul", items: [
      "Report no-shows and cancellations in the Extranet within **48 hours** of check-out.",
      "Decide clearly whether you are **charging or waiving** each fee, and mark it that way.",
      "Mark **invalid cards** promptly so unpaid reservations drop off without commission.",
      "Check each **invoice** against your Reservations tab and dispute anything that looks off.",
    ] },

    { t: "h2", text: "How direct bookings change the picture" },
    { t: "p", text: "On Booking.com, even a cancellation fee you rightfully keep is shared: the platform takes its percentage of it. On a **direct booking** through your own website, none of that applies. You set your own cancellation policy, you decide what is refundable and what is not, and every penny of any fee you charge stays with you, because there is no platform standing between you and the guest's payment. A non-refundable direct booking that cancels is 100% yours. A no-show you charge for is 100% yours. You are not filing an Extranet report to protect a margin someone else defined, you are simply enforcing terms you wrote. That control, over both the rules and the money, is the quiet advantage of owning your own booking channel alongside the OTAs." },

    { t: "cta", title: "Keep your cancellation fees in full", body: "We build and host your direct-booking website on your own domain, with payments straight to you and 0% commission, so every cancellation fee and no-show charge is entirely yours. See how it works.", label: "See how it works →", href: "/host" },
  ],
  faqs: [
    { q: "Does Booking.com charge commission if a guest cancels for free?", a: "No. A free cancellation inside the guest's policy window means you collect nothing, so there is no revenue for Booking.com to charge commission on. Commission only applies to money you actually keep." },
    { q: "Do I pay commission on a Booking.com no-show?", a: "If you charge a no-show fee under your rate plan, that fee is income and commission generally applies to it. If you waive the fee, you collect nothing and pay no commission. Either way you must mark the no-show in the Extranet, or you risk being billed on the full booking value." },
    { q: "How do I stop Booking.com charging commission on a stay that never happened?", a: "Report the cancellation or no-show in the Extranet within 48 hours of check-out, using Mark as a no-show or the cancellation options, and choose whether to charge or waive the fee. If it is never marked, the system treats it as a completed stay and can bill commission on the full amount." },
    { q: "What happens with an invalid credit card?", a: "Mark the card as invalid in the Extranet. The guest is asked to provide valid details within a short window, and if they do not, the reservation is cancelled and you are not charged commission for it. Do this promptly rather than waiting." },
    { q: "Can I get commission refunded on a waived fee?", a: "If you genuinely waived a cancellation or no-show fee, there should be no commission to pay, and Booking.com does provide a way to dispute commission on waived fees. It is far easier to mark the outcome correctly at the time than to correct an invoice later." },
  ],
  related: ["how-much-commission-booking-com", "booking-com-commission-calculator", "is-booking-com-genius-worth-it"],
};
