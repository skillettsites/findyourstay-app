import type { Guide, GuideCategory } from "./types";

import { guide as bookingCommissionCompared } from "./articles/booking-commission-compared";
import { guide as howToGetDirectBookings } from "./articles/how-to-get-direct-bookings";
import { guide as doINeedAWebsite } from "./articles/do-i-need-a-website-for-my-bnb";
import { guide as takeBookingsOwnWebsite } from "./articles/take-bookings-on-your-own-website";
import { guide as bestWebsiteBuilders } from "./articles/best-direct-booking-website-builders";
import { guide as airbnbHostFees } from "./articles/airbnb-host-fees-explained";
import { guide as bookingComCommission } from "./articles/how-much-commission-booking-com";
import { guide as airbnbVsBookingCom } from "./articles/airbnb-vs-booking-com-for-hosts";
import { guide as directVsAirbnb } from "./articles/direct-booking-vs-airbnb";
import { guide as reduceOtaCommission } from "./articles/how-to-reduce-ota-commission";
import { guide as increaseBookings } from "./articles/increase-bookings-small-bnb";
import { guide as directBookingStats } from "./articles/direct-booking-statistics";
import { guide as moveAirbnbGuestsDirect } from "./articles/move-airbnb-guests-to-direct-booking";
import { guide as takingBookingsOffAirbnbPenalty } from "./articles/taking-bookings-off-airbnb-penalty";
import { guide as otaCommissionCalculator } from "./articles/ota-commission-calculator";
import { guide as airbnbHostFeeCalculator } from "./articles/airbnb-host-fee-calculator";
import { guide as bookingComCommissionCalculator } from "./articles/booking-com-commission-calculator";
import { guide as bnbWebsiteCost } from "./articles/how-much-does-a-bnb-website-cost";
import { guide as howMuchHostsLoseToCommission } from "./articles/how-much-hosts-lose-to-commission";
import { guide as avoidAirbnbFeesLegally } from "./articles/how-to-avoid-airbnb-fees-legally";
import { guide as takeDepositsPayments } from "./articles/take-deposits-payments-holiday-let";
import { guide as googleBusinessProfileBnb } from "./articles/google-business-profile-for-bnb";
import { guide as rateParityCheaperOwnWebsite } from "./articles/rate-parity-cheaper-own-website";
import { guide as isBookingComGeniusWorthIt } from "./articles/is-booking-com-genius-worth-it";
import { guide as cleaningFeeCommission } from "./articles/does-airbnb-charge-commission-cleaning-fee";
import { guide as cancellationsCommission } from "./articles/does-booking-com-charge-commission-cancellations";
import { guide as localSeoBnb } from "./articles/local-seo-for-bnb";
import { guide as bookingsWithoutAirbnb } from "./articles/how-to-get-bookings-without-airbnb";
import { guide as ukStlRegistration } from "./articles/uk-short-term-let-registration-scheme";
import { guide as airbnb155Fee2026 } from "./articles/airbnb-15-5-host-fee-2026";
import { guide as emailMarketingBnbs } from "./articles/email-marketing-for-bnbs";
import { guide as directBookingChecklist } from "./articles/direct-booking-website-checklist";

// Ordered for the hub — pillars first, then supporting guides.
export const GUIDES: Guide[] = [
  otaCommissionCalculator,
  bookingCommissionCompared,
  howMuchHostsLoseToCommission,
  moveAirbnbGuestsDirect,
  takingBookingsOffAirbnbPenalty,
  airbnbHostFeeCalculator,
  bookingComCommissionCalculator,
  avoidAirbnbFeesLegally,
  airbnb155Fee2026,
  isBookingComGeniusWorthIt,
  rateParityCheaperOwnWebsite,
  cleaningFeeCommission,
  cancellationsCommission,
  howToGetDirectBookings,
  bookingsWithoutAirbnb,
  googleBusinessProfileBnb,
  localSeoBnb,
  emailMarketingBnbs,
  ukStlRegistration,
  doINeedAWebsite,
  takeBookingsOwnWebsite,
  takeDepositsPayments,
  directBookingChecklist,
  bestWebsiteBuilders,
  bnbWebsiteCost,
  airbnbHostFees,
  bookingComCommission,
  airbnbVsBookingCom,
  directVsAirbnb,
  reduceOtaCommission,
  increaseBookings,
  directBookingStats,
];

export const GUIDES_BY_SLUG: Record<string, Guide> = Object.fromEntries(GUIDES.map((g) => [g.slug, g]));

export const GUIDE_CATEGORIES: GuideCategory[] = [
  "Commissions & fees",
  "Direct bookings",
  "Your website",
  "Growth",
  "Data & research",
];

export function guidesByCategory(): { category: GuideCategory; guides: Guide[] }[] {
  return GUIDE_CATEGORIES.map((category) => ({
    category,
    guides: GUIDES.filter((g) => g.category === category),
  })).filter((c) => c.guides.length > 0);
}
