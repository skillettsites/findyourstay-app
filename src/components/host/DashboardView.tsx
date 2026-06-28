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

function Stat({ label, value, sub, cur, prev, active = false, onClick }: { label: string; value: string; sub?: string; cur?: number; prev?: number; active?: boolean; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`text-left w-full border rounded-xl p-4 transition group cursor-pointer ${active ? "border-brand ring-1 ring-brand/40 bg-rose-50/40" : "border-line hover:border-ink hover:shadow-sm"}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs text-muted">{label}</p>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`shrink-0 transition-transform ${active ? "rotate-180 text-brand" : "text-muted/50 group-hover:text-ink"}`}><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
      <p className="text-2xl font-semibold mt-1">{value}</p>
      <div className="mt-1 flex items-center justify-between">
        {sub && <span className="text-xs text-muted">{sub}</span>}
        {cur !== undefined && prev !== undefined && <Delta cur={cur} prev={prev} />}
      </div>
    </button>
  );
}

const dayLabel = (d: string) => { const dt = new Date(d); return Number.isNaN(dt.getTime()) ? d : dt.toLocaleDateString("en-GB", { day: "numeric", month: "short" }); };

function TrendChart({ series }: { series: HostAnalytics["series"] }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...series.map((s) => s.impressions), ...series.map((s) => s.views));
  const h = hover !== null ? series[hover] : null;
  return (
    <div className="border border-line rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Reach over the last 30 days</h3>
        <div className="flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-line" /> Impressions</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-brand" /> Views</span>
        </div>
      </div>
      <div className="relative">
        {h && hover !== null && (
          <div className="absolute -top-1 z-10 -translate-x-1/2 -translate-y-full pointer-events-none" style={{ left: `${((hover + 0.5) / series.length) * 100}%` }}>
            <div className="bg-ink text-white rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg">
              <p className="font-semibold mb-1">{dayLabel(h.date)}</p>
              <p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-white/40" /> {h.impressions.toLocaleString()} impressions</p>
              <p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm bg-brand" /> {h.views.toLocaleString()} views</p>
            </div>
          </div>
        )}
        <div className="flex items-end gap-[3px] h-36" onMouseLeave={() => setHover(null)}>
          {series.map((s, i) => (
            <div key={s.date} onMouseEnter={() => setHover(i)} className="relative flex-1 h-full flex items-end cursor-pointer">
              <div className={`absolute inset-x-0 bottom-0 rounded-t-sm transition-colors ${hover === i ? "bg-line/90" : "bg-line"}`} style={{ height: `${(s.impressions / max) * 100}%` }} />
              <div className={`absolute inset-x-0 bottom-0 rounded-t-sm transition-colors ${hover === i ? "bg-brand-dark" : "bg-brand"}`} style={{ height: `${(s.views / max) * 100}%` }} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between text-[11px] text-muted mt-2"><span>{dayLabel(series[0]?.date ?? "")}</span><span>Today</span></div>
    </div>
  );
}

function StatDetailPanel({ metric, a, listings, onClose }: { metric: string; a: HostAnalytics; listings: DashboardListing[]; onClose: () => void }) {
  const nameById = new Map(listings.map((l) => [l.id, l.propertyName]));
  const avg = listings.length ? Math.round(listings.reduce((s, l) => s + (l.pricePerNight ?? 0), 0) / listings.length) : 0;
  const META: Record<string, { title: string; explain: string; cur?: number; prev?: number; per?: "impressions" | "views" | "enquiries"; value?: string }> = {
    impressions: { title: "Search impressions", explain: "Every time one of your stays appears in a search or city page. More impressions means more chances to be discovered.", cur: a.totals.impressions, prev: a.prev.impressions, per: "impressions" },
    views: { title: "Listing views", explain: "Travellers who clicked through and opened your listing to read more.", cur: a.totals.views, prev: a.prev.views, per: "views" },
    siteViews: { title: "Website visits", explain: "Visits to your own booking website, where guests book and pay you direct.", cur: a.totals.siteViews, prev: a.prev.siteViews },
    bookings: { title: "Booking requests", explain: "Guests who requested specific dates. Confirm or decline them from the Bookings tab.", cur: a.totals.bookings, prev: a.prev.bookings },
    enquiries: { title: "Enquiries", explain: "Messages from travellers asking about your stay before they book.", cur: a.totals.enquiries, prev: a.prev.enquiries, per: "enquiries" },
    enquiryRate: { title: "Enquiry rate", explain: "The share of listing views that become an enquiry. Higher means your listing is turning browsers into interested guests.", value: `${a.enquiryRate}%` },
    listings: { title: "Active listings", explain: "The stays you have published and live on FindYourStay.", value: String(listings.length) },
    avgRate: { title: "Average nightly rate", explain: "The average price per night across your published stays.", value: avg ? formatPrice(avg, listings[0]?.currency ?? "gbp") : "—" },
  };
  const m = META[metric];
  if (!m) return null;
  const rows = m.per ? a.perListing.map((p) => ({ name: nameById.get(p.id) ?? "Listing", val: p[m.per!] })).sort((x, y) => y.val - x.val) : [];
  const max = Math.max(1, ...rows.map((r) => r.val));
  return (
    <div className="mt-3 border border-brand/30 bg-rose-50/30 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold">{m.title}</h3>
          <p className="text-sm text-muted mt-1 max-w-xl">{m.explain}</p>
        </div>
        <button onClick={onClose} aria-label="Close" className="text-muted hover:text-ink text-lg leading-none">✕</button>
      </div>
      {m.cur !== undefined && m.prev !== undefined ? (
        <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-2">
          <div><p className="text-xs text-muted">This 30 days</p><p className="text-2xl font-bold">{fmt(m.cur)}</p></div>
          <div><p className="text-xs text-muted">Previous 30 days</p><p className="text-2xl font-bold text-muted">{fmt(m.prev)}</p></div>
          <Delta cur={m.cur} prev={m.prev} />
        </div>
      ) : m.value ? (
        <p className="mt-4 text-3xl font-bold">{m.value}</p>
      ) : null}
      {m.per && rows.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">By listing</p>
          <div className="space-y-2.5">
            {rows.map((r) => (
              <div key={r.name}>
                <div className="flex justify-between text-sm mb-1"><span className="truncate pr-2">{r.name}</span><span className="font-semibold">{fmt(r.val)}</span></div>
                <div className="h-2 rounded-full bg-white overflow-hidden"><div className="h-full bg-brand rounded-full" style={{ width: `${(r.val / max) * 100}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const Empty = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-muted border border-dashed border-line rounded-xl p-5">{children}</p>
);

export function DashboardView({ data, demo = false }: { data: DashboardData; demo?: boolean }) {
  const { analytics: a, listings, enquiries, bookings } = data;
  const [tab, setTab] = useState<Tab>("overview");
  const [openStat, setOpenStat] = useState<string | null>(null);
  const perById = new Map(a.perListing.map((p) => [p.id, p]));
  const pendingBookings = bookings.filter((b) => b.status === "requested").length;
  const sites = listings.filter((l) => l.hasBookingSite);
  const editHref = (slug: string) => (demo ? "/host/new" : `/host/listing/${slug}/edit`);
  const calHref = (slug: string) => (demo ? "/host/new" : `/host/calendar/${slug}`);
  const viewHref = (slug: string) => (demo ? "/host/new" : `/rooms/${slug}`);
  const avgRate = listings.length
    ? Math.round(listings.reduce((s, l) => s + (l.pricePerNight ?? 0), 0) / listings.length)
    : 0;
  const statCards = [
    { id: "impressions", label: "Search impressions", value: fmt(a.totals.impressions), sub: "shown in search", cur: a.totals.impressions, prev: a.prev.impressions },
    { id: "views", label: "Listing views", value: fmt(a.totals.views), sub: "opened your listing", cur: a.totals.views, prev: a.prev.views },
    { id: "siteViews", label: "Website visits", value: fmt(a.totals.siteViews), sub: "your booking site", cur: a.totals.siteViews, prev: a.prev.siteViews },
    { id: "bookings", label: "Booking requests", value: fmt(a.totals.bookings), sub: "last 30 days", cur: a.totals.bookings, prev: a.prev.bookings },
    { id: "enquiries", label: "Enquiries", value: fmt(a.totals.enquiries), sub: "last 30 days", cur: a.totals.enquiries, prev: a.prev.enquiries },
    { id: "enquiryRate", label: "Enquiry rate", value: `${a.enquiryRate}%`, sub: "per listing view", cur: undefined as number | undefined, prev: undefined as number | undefined },
    { id: "listings", label: "Active listings", value: fmt(listings.length), sub: "published", cur: undefined as number | undefined, prev: undefined as number | undefined },
    { id: "avgRate", label: "Avg nightly rate", value: avgRate ? formatPrice(avgRate, listings[0]?.currency ?? "gbp") : "—", sub: "across your stays", cur: undefined as number | undefined, prev: undefined as number | undefined },
  ];

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
          <p className="text-xs text-muted mb-2">Tap any stat for a breakdown.</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {statCards.map((s) => (
              <Stat key={s.id} label={s.label} value={s.value} sub={s.sub} cur={s.cur} prev={s.prev} active={openStat === s.id} onClick={() => setOpenStat(openStat === s.id ? null : s.id)} />
            ))}
          </div>
          {openStat && <StatDetailPanel metric={openStat} a={a} listings={listings} onClose={() => setOpenStat(null)} />}

          <div className="mt-6">
            <TrendChart series={a.series} />
          </div>

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
