"use client";

import { useState } from "react";
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
  siteTheme?: "classic" | "modern" | "coastal";
  domain?: string;
}

export interface DashboardData {
  email: string;
  analytics: HostAnalytics;
  listings: DashboardListing[];
  enquiries: EnquiryRow[];
  bookings: BookingRow[];
}

type Tab = "overview" | "stays" | "website" | "bookings" | "enquiries";
const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "stays", label: "Your stays" },
  { key: "website", label: "Website" },
  { key: "bookings", label: "Bookings" },
  { key: "enquiries", label: "Enquiries" },
];
const THEME_LABEL = { classic: "Classic", modern: "Modern", coastal: "Coastal" } as const;

const fmt = (n: number) => n.toLocaleString();
const pct = (cur: number, prev: number) => (prev <= 0 ? (cur > 0 ? 100 : 0) : Math.round(((cur - prev) / prev) * 100));
function when(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function Delta({ cur, prev }: { cur: number; prev: number }) {
  const d = pct(cur, prev);
  if (d === 0) return <span className="text-xs text-muted">No change</span>;
  const up = d > 0;
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${up ? "text-emerald-600" : "text-rose-500"}`}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={up ? "" : "rotate-180"}><path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
      {Math.abs(d)}%
    </span>
  );
}

function Stat({ label, value, sub, cur, prev }: { label: string; value: string; sub?: string; cur?: number; prev?: number }) {
  return (
    <div className="border border-line rounded-xl p-4">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
      <div className="mt-1 flex items-center justify-between">
        {sub && <span className="text-xs text-muted">{sub}</span>}
        {cur !== undefined && prev !== undefined && <Delta cur={cur} prev={prev} />}
      </div>
    </div>
  );
}

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
            <div className="absolute inset-x-0 bottom-0 bg-line rounded-t-sm transition-all group-hover:bg-line/70" style={{ height: `${(s.impressions / max) * 100}%` }} />
            <div className="absolute inset-x-0 bottom-0 bg-brand rounded-t-sm" style={{ height: `${(s.views / max) * 100}%` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

const Empty = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-muted border border-dashed border-line rounded-xl p-5">{children}</p>
);

export function DashboardView({ data, demo = false }: { data: DashboardData; demo?: boolean }) {
  const { analytics: a, listings, enquiries, bookings } = data;
  const [tab, setTab] = useState<Tab>("overview");
  const perById = new Map(a.perListing.map((p) => [p.id, p]));
  const pendingBookings = bookings.filter((b) => b.status === "requested").length;
  const sites = listings.filter((l) => l.hasBookingSite);
  const editHref = (slug: string) => (demo ? "/host/new" : `/host/listing/${slug}/edit`);
  const calHref = (slug: string) => (demo ? "/host/new" : `/host/calendar/${slug}`);
  const viewHref = (slug: string) => (demo ? "/host/new" : `/rooms/${slug}`);
  const avgRate = listings.length
    ? Math.round(listings.reduce((s, l) => s + (l.pricePerNight ?? 0), 0) / listings.length)
    : 0;

  return (
    <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 py-6">
      {demo && (
        <div className="mb-5 rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink"><b>Sample dashboard.</b> A live preview with example data, so you can see exactly what you&apos;ll get. Your real numbers appear here once you list.</p>
          <Link href="/host/new" className="bg-brand-gradient text-white text-sm font-semibold px-4 py-2 rounded-full whitespace-nowrap">List your stay</Link>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-display font-bold">{demo ? "Host dashboard preview" : "Your dashboard"}</h1>
          <p className="text-sm text-muted">{demo ? "Example data, last 30 days" : `Signed in as ${data.email}`}</p>
        </div>
        <Link href="/host/new" className="self-start bg-brand-gradient bg-brand-gradient-hover text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-glow">
          {demo ? "Get started" : "+ Add listing"}
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-line overflow-x-auto no-scrollbar">
        {TABS.map((t) => {
          const badge = t.key === "bookings" && pendingBookings ? pendingBookings : 0;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 -mb-px transition ${tab === t.key ? "border-brand text-brand" : "border-transparent text-muted hover:text-ink"}`}
            >
              {t.label}
              {badge > 0 && <span className="ml-1.5 inline-grid place-items-center min-w-5 h-5 px-1 rounded-full bg-brand text-white text-[10px] align-middle">{badge}</span>}
            </button>
          );
        })}
      </div>

      {/* ---- Overview ---- */}
      {tab === "overview" && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <Stat label="Search impressions" value={fmt(a.totals.impressions)} sub="shown in search" cur={a.totals.impressions} prev={a.prev.impressions} />
            <Stat label="Listing views" value={fmt(a.totals.views)} sub="opened your listing" cur={a.totals.views} prev={a.prev.views} />
            <Stat label="Website visits" value={fmt(a.totals.siteViews)} sub="your booking site" cur={a.totals.siteViews} prev={a.prev.siteViews} />
            <Stat label="Booking requests" value={fmt(a.totals.bookings)} sub="last 30 days" cur={a.totals.bookings} prev={a.prev.bookings} />
            <Stat label="Enquiries" value={fmt(a.totals.enquiries)} sub="last 30 days" cur={a.totals.enquiries} prev={a.prev.enquiries} />
            <Stat label="Enquiry rate" value={`${a.enquiryRate}%`} sub="per listing view" />
            <Stat label="Active listings" value={fmt(listings.length)} sub="published" />
            <Stat label="Avg nightly rate" value={avgRate ? formatPrice(avgRate, listings[0]?.currency ?? "gbp") : "—"} sub="across your stays" />
          </div>

          <TrendChart series={a.series} />

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="border border-line rounded-2xl p-5">
              <h3 className="font-semibold mb-3">Top performing stay</h3>
              {listings.length === 0 ? (
                <Empty>Add a stay to see how it performs.</Empty>
              ) : (
                (() => {
                  const top = [...listings].sort((x, y) => (perById.get(y.id)?.views ?? 0) - (perById.get(x.id)?.views ?? 0))[0];
                  const p = perById.get(top.id);
                  return (
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {top.photo ? <img src={top.photo} alt="" className="w-14 h-14 rounded-lg object-cover" /> : <div className="w-14 h-14 rounded-lg bg-mist" />}
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{top.propertyName}</p>
                        <p className="text-xs text-muted">{fmt(p?.views ?? 0)} views · {fmt(p?.enquiries ?? 0)} enquiries</p>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>
            <div className="border border-line rounded-2xl p-5">
              <h3 className="font-semibold mb-3">Recent activity</h3>
              <ul className="space-y-2 text-sm text-muted">
                <li className="flex justify-between"><span>New booking requests</span><span className="font-semibold text-ink">{pendingBookings}</span></li>
                <li className="flex justify-between"><span>New enquiries</span><span className="font-semibold text-ink">{enquiries.length}</span></li>
                <li className="flex justify-between"><span>Live booking websites</span><span className="font-semibold text-ink">{sites.length}</span></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ---- Your stays ---- */}
      {tab === "stays" && (
        <div className="space-y-3">
          {listings.length === 0 ? (
            <Empty>No listings yet. Add your first stay to start getting direct bookings.</Empty>
          ) : (
            listings.map((l) => {
              const p = perById.get(l.id);
              return (
                <div key={l.id} className="flex items-center gap-4 border border-line rounded-xl p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {l.photo ? <img src={l.photo} alt="" className="w-20 h-20 rounded-lg object-cover bg-mist" /> : <div className="w-20 h-20 rounded-lg bg-mist" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{l.propertyName}</p>
                    <p className="text-sm text-muted truncate">{l.cityName}, {l.country} · {formatPrice(l.pricePerNight, l.currency)}/night{l.hasBookingSite && <span className="ml-2 text-brand font-medium">· Booking website</span>}</p>
                    <p className="text-xs text-muted mt-0.5">{fmt(p?.impressions ?? 0)} impressions · {fmt(p?.views ?? 0)} views · {fmt(p?.enquiries ?? 0)} enquiries</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <Link href={editHref(l.slug)} className="text-sm font-semibold border border-line rounded-full px-4 py-2 hover:bg-mist text-center">Edit stay</Link>
                    <Link href={calHref(l.slug)} className="text-sm font-semibold border border-line rounded-full px-4 py-2 hover:bg-mist text-center">Calendar</Link>
                    <Link href={viewHref(l.slug)} className="text-sm font-semibold border border-line rounded-full px-4 py-2 hover:bg-mist text-center">View</Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ---- Website ---- */}
      {tab === "website" && (
        <div className="space-y-4">
          {sites.length === 0 ? (
            <div className="border border-dashed border-line rounded-2xl p-8 text-center">
              <h3 className="font-semibold text-lg">No booking website yet</h3>
              <p className="text-muted mt-1 max-w-md mx-auto">Add a fully built, hosted and secured booking website on your own domain, ranked on Google and ready for AI discovery.</p>
              <Link href="/host/new" className="inline-block mt-4 bg-brand-gradient text-white font-semibold px-6 py-3 rounded-full shadow-glow">Add a booking website</Link>
            </div>
          ) : (
            sites.map((l) => (
              <div key={l.id} className="border border-line rounded-2xl p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-lg">{l.propertyName}</p>
                    <p className="text-sm text-muted">{l.domain ?? "your own domain"} · <span className="text-ink">{l.siteTheme ? THEME_LABEL[l.siteTheme] : "Classic"}</span> template</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={editHref(l.slug)} className="text-sm font-semibold bg-ink text-white rounded-full px-4 py-2">Edit website</Link>
                    <Link href={demo ? `/sites/${l.slug}` : l.domain ? `https://${l.domain}` : `/sites/${l.slug}`} target="_blank" rel="noreferrer" className="text-sm font-semibold border border-line rounded-full px-4 py-2 hover:bg-mist">View live</Link>
                  </div>
                </div>
                <div className="mt-4 grid sm:grid-cols-2 gap-2">
                  {[
                    ["Secure (HTTPS)", "Padlock and SSL handled and auto-renewed"],
                    ["Indexed on Google & Bing", "Submitted for indexing, sitemap + IndexNow live"],
                    ["AI-ready (llms.txt)", "Readable by ChatGPT and Gemini"],
                    ["Calendar synced", "Two-way iCal with Airbnb & Booking.com"],
                  ].map(([t, d]) => (
                    <div key={t} className="flex items-start gap-2.5 bg-mist/60 rounded-lg px-3 py-2.5">
                      <span className="grid place-items-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] shrink-0 mt-0.5">✓</span>
                      <div><p className="text-sm font-semibold">{t}</p><p className="text-xs text-muted">{d}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ---- Bookings ---- */}
      {tab === "bookings" && (
        bookings.length === 0 ? (
          <Empty>No booking requests yet. They appear here when a guest requests dates on a listing with a booking site.</Empty>
        ) : (
          <div className="space-y-2">
            {bookings.map((b) => (
              <div key={b.id} className="flex flex-wrap items-center gap-3 justify-between border border-line rounded-xl p-3.5">
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{b.listingName}</p>
                  <p className="text-sm text-muted">{b.guestEmail} · {b.checkIn} → {b.checkOut}{b.guests ? ` · ${b.guests} guests` : ""}</p>
                </div>
                {demo ? <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-mist capitalize">{b.status}</span> : <BookingActions bookingId={b.id} initialStatus={b.status} />}
              </div>
            ))}
          </div>
        )
      )}

      {/* ---- Enquiries ---- */}
      {tab === "enquiries" && (
        enquiries.length === 0 ? (
          <Empty>No enquiries yet. When a traveller messages you about a listing, it shows here and we email you.</Empty>
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
                  {e.checkIn ? ` · ${e.checkIn}${e.checkOut ? ` → ${e.checkOut}` : ""}` : ""}{e.guests ? ` · ${e.guests} guests` : ""}
                </p>
                {e.message && <p className="text-sm mt-1.5 text-ink/80">{e.message}</p>}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
