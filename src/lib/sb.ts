// Shared Supabase admin client (service role). Same project your other sites
// use; FindYourStay tables are all prefixed `fys_`. Server-only.
import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\\n$/, "").trim();
const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").replace(/\\n$/, "").trim();

export const sb = createClient(url, key, { auth: { persistSession: false } });
export const T = {
  listings: "fys_listings",
  hosts: "fys_hosts",
  calendar: "fys_calendar_blocks",
  enquiries: "fys_enquiries",
  bookings: "fys_bookings",
  reports: "fys_reports",
  events: "fys_events",
  domains: "fys_domains",
  citySummary: "fys_city_summary",
} as const;
