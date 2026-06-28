import Link from "next/link";
import { BookingActions } from "./BookingActions";
import { formatPrice } from "@/lib/format";
import type { HostAnalytics, EnquiryRow, BookingRow } from "@/lib/db";

export interface DashboardListing {
  id: string;
  slug: string;
  propertyName: string;
  cityName: string;
  country: string;
  pricePerNight: number | null;
  currency: string;
  photo?: string;
  hasBookingSite: boolean;
}

export interface DashboardData {
  email: string;
  analytics: HostAnalytics;
  listings: DashboardListing[];
  enquiries: EnquiryRow[];
  bookings: BookingRow[];
}

function when(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const fmt = (n: number) => n.toLocaleString();

/* 30-day trend: faint impression bars with view bars in front. */
function TrendChart({ series }: { series: HostAnalytics["series"] }) {
  const max = Math.max(1, ...series.map((s) => s.impressions), ...series.map((s) => s.views));
  return (
    <div className="border border-line rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Reach over the last 30 days</h3>
        <div className="flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-line" /> Impressions</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-brand" /> Views</span>
        </div>
      </div>
      <div className="flex items-end gap-[3px] h-32">
        {series.map((s) => (
          <div key={s.date} className="relative flex-1 h-full flex items-end group" title={`${s.date} · ${s.impressions} impressions · ${s.views} views`}>
            <div className="absolute inset-x-0 bottom-0 bg-line rounded-t-sm" style={{ height: `${(s.impressions / max) * 100}%` }} />
            <div className="absolute inset-x-0 bottom-0 bg-brand rounded-t-sm" style={{ height: `${(s.views / max) * 100}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="border border-line rounded-xl p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
      {sub && <p className="text-xs text-muted mt-0.5">{sub}</p>}
    </div>
  );
}

export function DashboardView({ data, demo = false }: { data: DashboardData; demo?: boolean }) {
  const { analytics: a, listings, enquiries, bookings } = data;
  const perById = new Map(a.perListing.map((p) => [p.id, p]));
  const pendingBookings = bookings.filter((b) => b.status === "requested").length;

  return (
    <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 py-6">
      {demo && (
        <div className="mb-5 rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink"><b>Sample dashboard.</b> This is a preview with example data, so you can see what you&apos;ll get. Your real numbers appear here once you list.</p>
          <Link href="/host/new" className="bg-brand-gradient text-white text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap">List your stay</Link>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">{demo ? "Host dashboard preview" : "Your dashboard"}</h1>
          <p className="text-sm text-muted">{demo ? "Example data" : `Signed in as ${data.email}`}</p>
        </div>
        <Link href={demo ? "/host/new" : "/host/new"} className="self-start bg-brand-gradient bg-brand-gradient-hover text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-glow">
          {demo ? "Get started" : "+ Add listing"}
        </Link>
      </div>

      {/* Headline stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <Stat label="Search impressions" value={fmt(a.totals.impressions)} sub="times shown in search · 30d" />
        <Stat label="Listing views" value={fmt(a.totals.views)} sub="opened your listing · 30d" />
        <Stat label="Website visits" value={fmt(a.totals.siteViews)} sub="your booking site · 30d" />
        <Stat label="Enquiries" value={fmt(a.totals.enquiries)} sub="last 30 days" />
        <Stat label="Booking requests" value={fmt(a.totals.bookings)} sub="last 30 days" />
        <Stat label="Enquiry rate" value={`${a.enquiryRate}%`} sub="enquiries per view" />
      </div>

      {/* Trend */}
      <div className="mb-8">
        <TrendChart series={a.series} />
      </div>

      {/* Listings */}
      <h2 className="font-display font-bold text-lg mb-3">Listings</h2>
      {listings.length === 0 ? (
        <div className="text-center border border-dashed border-line rounded-2xl py-16 px-6">
          <div className="text-4xl">🏠</div>
          <h3 className="font-semibold text-lg mt-3">No listings yet</h3>
          <p className="text-muted mt-1 max-w-sm mx-auto">Add your first stay and start getting direct bookings.</p>
          <Link href="/host/new" className="inline-block mt-5 bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-6 py-3 rounded-full shadow-glow">List your stay</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((l) => {
            const p = perById.get(l.id);
            return (
              <div key={l.id} className="flex items-center gap-4 border border-line rounded-xl p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {l.photo ? (
                  <img src={l.photo} alt="" className="w-20 h-20 rounded-lg object-cover bg-mist" />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-rose-50 to-mist grid place-items-center text-brand/50 text-xs">Soon</div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{l.propertyName}</p>
                  <p className="text-sm text-muted truncate">
                    {l.cityName}, {l.country} · {formatPrice(l.pricePerNight, l.currency)}/night
                    {l.hasBookingSite && <span className="ml-2 text-brand font-medium">· Booking website</span>}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{fmt(p?.impressions ?? 0)} impressions · {fmt(p?.views ?? 0)} views · {fmt(p?.enquiries ?? 0)} enquiries</p>
                </div>
                {!demo && (
                  <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <Link href={`/host/listing/${l.slug}/edit`} className="text-sm font-semibold border border-line rounded-full px-4 py-2 hover:bg-mist text-center">Edit</Link>
                    <Link href={`/host/calendar/${l.slug}`} className="text-sm font-semibold border border-line rounded-full px-4 py-2 hover:bg-mist text-center">Calendar</Link>
                    <Link href={`/rooms/${l.slug}`} className="text-sm font-semibold border border-line rounded-full px-4 py-2 hover:bg-mist text-center">View</Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Booking requests */}
      <h2 className="font-display font-bold text-lg mt-10 mb-3">Booking requests{pendingBookings ? ` · ${pendingBookings} new` : ""}</h2>
      {bookings.length === 0 ? (
        <p className="text-sm text-muted border border-dashed border-line rounded-xl p-5">No booking requests yet. They appear here when a guest requests dates on a listing with a booking site.</p>
      ) : (
        <div className="space-y-2">
          {bookings.map((b) => (
            <div key={b.id} className="flex flex-wrap items-center gap-3 justify-between border border-line rounded-xl p-3.5">
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{b.listingName}</p>
                <p className="text-sm text-muted">{b.guestEmail} · {b.checkIn} → {b.checkOut}{b.guests ? ` · ${b.guests} guests` : ""}</p>
              </div>
              {demo ? (
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-mist capitalize">{b.status}</span>
              ) : (
                <BookingActions bookingId={b.id} initialStatus={b.status} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Enquiries */}
      <h2 className="font-display font-bold text-lg mt-10 mb-3">Recent enquiries</h2>
      {enquiries.length === 0 ? (
        <p className="text-sm text-muted border border-dashed border-line rounded-xl p-5">No enquiries yet. When a traveller messages you about a listing, it shows here and we email you.</p>
      ) : (
        <div className="space-y-2">
          {enquiries.map((e) => (
            <div key={e.id} className="border border-line rounded-xl p-3.5">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-sm truncate">{e.listingName}</p>
                <span className="text-xs text-muted shrink-0">{when(e.createdAt)}</span>
              </div>
              <p className="text-sm text-muted">
                {demo ? <span className="text-brand font-medium">{e.guestEmail}</span> : <a href={`mailto:${e.guestEmail}`} className="text-brand font-medium">{e.guestEmail}</a>}
                {e.checkIn ? ` · ${e.checkIn}${e.checkOut ? ` → ${e.checkOut}` : ""}` : ""}
                {e.guests ? ` · ${e.guests} guests` : ""}
              </p>
              {e.message && <p className="text-sm mt-1.5 text-ink/80">{e.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
