"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { BookingActions } from "./BookingActions";
import { formatPrice } from "@/lib/format";
import type { HostAnalytics, SiteAnalytics, EnquiryRow, BookingRow } from "@/lib/db";

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
  payStripe?: string | null;
  payPaypal?: string | null;
}

export interface DashboardData {
  email: string;
  analytics: HostAnalytics;
  siteAnalytics?: SiteAnalytics;
  listings: DashboardListing[];
  enquiries: EnquiryRow[];
  bookings: BookingRow[];
}

type Tab = "overview" | "stays" | "website" | "prostats" | "bookings" | "enquiries" | "askyourstay";
const TABS: { key: Tab; label: string; pro?: boolean; addon?: boolean }[] = [
  { key: "overview", label: "Overview" },
  { key: "stays", label: "Your stays" },
  { key: "website", label: "Website" },
  { key: "prostats", label: "Pro stats", pro: true },
  { key: "bookings", label: "Bookings" },
  { key: "enquiries", label: "Enquiries" },
  { key: "askyourstay", label: "AskYourStay", addon: true },
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

function TrendChart({ series, days = 30 }: { series: HostAnalytics["series"]; days?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...series.map((s) => s.impressions), ...series.map((s) => s.views));
  const h = hover !== null ? series[hover] : null;
  return (
    <div className="border border-line rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Reach, last {days} days</h3>
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
  const [delTarget, setDelTarget] = useState<DashboardListing | null>(null);
  const [delStep, setDelStep] = useState(1);
  const [deleting, setDeleting] = useState(false);
  const [delErr, setDelErr] = useState("");
  const router = useRouter();
  // One stay per host on the current plans, so hide "add" once they have one.
  const atLimit = !demo && listings.length >= 1;

  function askDelete(l: DashboardListing) { setDelTarget(l); setDelStep(1); setDelErr(""); }
  async function confirmDelete() {
    if (!delTarget) return;
    setDeleting(true); setDelErr("");
    try {
      const res = await fetch("/api/host/listing/delete", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: delTarget.id }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(d.error || "Could not delete the stay.");
      setDelTarget(null); setDelStep(1);
      router.refresh();
    } catch (e) {
      setDelErr(e instanceof Error ? e.message : "Could not delete the stay.");
    } finally {
      setDeleting(false);
    }
  }
  const pathname = usePathname();
  const sp = useSearchParams();
  const range = sp.get("range") ?? "30";
  const days = range === "7" ? 7 : range === "90" ? 90 : 30;
  const selectedListing = sp.get("listing") ?? "";
  const setParam = (k: string, v: string) => {
    const p = new URLSearchParams(sp.toString());
    if (v) p.set(k, v); else p.delete(k);
    const qs = p.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  };
  const downloadCSV = () => {
    const sa = data.siteAnalytics;
    const rows: string[] = [
      `FindYourStay analytics, last ${days} days`, "", "Metric,This period,Previous period",
      `Search impressions,${a.totals.impressions},${a.prev.impressions}`,
      `Listing views,${a.totals.views},${a.prev.views}`,
      `Website visits,${a.totals.siteViews},${a.prev.siteViews}`,
      `Enquiries,${a.totals.enquiries},${a.prev.enquiries}`,
      `Booking requests,${a.totals.bookings},${a.prev.bookings}`,
    ];
    if (sa) {
      rows.push("", "Traffic source,Visits", ...sa.sources.map((s) => `${s.label},${s.visits}`));
      rows.push("", "Country,Visits", ...sa.countries.map((c) => `${COUNTRY[c.code] ?? c.code},${c.visits}`));
      rows.push("", "Device,Visits", ...sa.devices.map((d) => `${d.label},${d.visits}`));
      rows.push("", "Page,Visits", ...sa.pages.map((p) => `${PAGE[p.path] ?? p.path},${p.visits}`));
    }
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url; el.download = `findyourstay-analytics-${days}d.csv`;
    document.body.appendChild(el); el.click(); el.remove(); URL.revokeObjectURL(url);
  };
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
    { id: "bookings", label: "Booking requests", value: fmt(a.totals.bookings), sub: `last ${days} days`, cur: a.totals.bookings, prev: a.prev.bookings },
    { id: "enquiries", label: "Enquiries", value: fmt(a.totals.enquiries), sub: `last ${days} days`, cur: a.totals.enquiries, prev: a.prev.enquiries },
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
          <p className="text-sm text-muted">{demo ? `Example data, last ${days} days` : `Signed in as ${data.email}`}{selectedListing && listings.find((l) => l.id === selectedListing) ? ` · ${listings.find((l) => l.id === selectedListing)!.propertyName}` : ""}</p>
        </div>
        {atLimit ? (
          <span className="self-start text-xs text-muted bg-mist rounded-full px-3 py-2">One stay per plan · manage it below</span>
        ) : (
          <Link href="/host/new" className="self-start bg-brand-gradient bg-brand-gradient-hover text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-glow">
            {demo ? "Get started" : "+ Add listing"}
          </Link>
        )}
      </div>

      {/* Controls: date range, per-listing filter, CSV export */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <div className="inline-flex rounded-full border border-line p-0.5">
          {[["7", "7 days"], ["30", "30 days"], ["90", "90 days"]].map(([v, l]) => (
            <button key={v} onClick={() => setParam("range", v === "30" ? "" : v)} className={`px-3 py-1.5 text-xs font-semibold rounded-full transition ${range === v ? "bg-ink text-white" : "text-muted hover:text-ink"}`}>{l}</button>
          ))}
        </div>
        {listings.length > 1 && (
          <select value={selectedListing} onChange={(e) => setParam("listing", e.target.value)} className="text-xs font-semibold border border-line rounded-full px-3 py-2 bg-white outline-none cursor-pointer">
            <option value="">All listings</option>
            {listings.map((l) => <option key={l.id} value={l.id}>{l.propertyName}</option>)}
          </select>
        )}
        <button onClick={downloadCSV} className="text-xs font-semibold border border-line rounded-full px-3 py-2 hover:bg-mist inline-flex items-center gap-1.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></svg>
          Export CSV
        </button>
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
              {t.pro && <span className="ml-1.5 inline-block bg-brand-gradient text-white text-[9px] font-bold px-1.5 py-0.5 rounded align-middle">PRO</span>}
              {t.addon && <span className="ml-1.5 inline-block bg-ink text-white text-[9px] font-bold px-1.5 py-0.5 rounded align-middle">£4.99</span>}
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
            <TrendChart series={a.series} days={days} />
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
                <div key={l.id} className="border border-line rounded-xl p-3">
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {l.photo ? <img src={l.photo} alt="" className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover bg-mist shrink-0" /> : <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-mist shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{l.propertyName}</p>
                      <p className="text-sm text-muted truncate">{l.cityName}, {l.country} · {formatPrice(l.pricePerNight, l.currency)}/night{l.hasBookingSite && <span className="ml-2 text-brand font-medium">· Booking website</span>}</p>
                      <p className="text-xs text-muted mt-0.5 truncate">{fmt(p?.impressions ?? 0)} impressions · {fmt(p?.views ?? 0)} views · {fmt(p?.enquiries ?? 0)} enquiries</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Link href={editHref(l.slug)} className="text-sm font-semibold border border-line rounded-full px-4 py-2 hover:bg-mist text-center">Edit stay</Link>
                    <Link href={calHref(l.slug)} className="text-sm font-semibold border border-line rounded-full px-4 py-2 hover:bg-mist text-center">Calendar</Link>
                    <Link href={viewHref(l.slug)} className="text-sm font-semibold border border-line rounded-full px-4 py-2 hover:bg-mist text-center">View</Link>
                    {!demo && (
                      <button type="button" onClick={() => askDelete(l)} className="text-sm font-semibold text-rose-600 border border-rose-200 rounded-full px-4 py-2 hover:bg-rose-50 text-center ml-auto">Delete</button>
                    )}
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
                <div className="mt-3">
                  {l.payStripe || l.payPaypal ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 rounded-full px-3 py-1.5 text-xs font-semibold">
                      ✓ Guests can pay you{l.payStripe && l.payPaypal ? " · Stripe + PayPal" : l.payStripe ? " · Stripe" : " · PayPal"}
                    </span>
                  ) : (
                    <Link href={editHref(l.slug)} className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-full px-3 py-1.5 text-xs font-semibold">
                      ⚠ Add your Stripe / PayPal link so guests can pay you →
                    </Link>
                  )}
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

      {/* ---- Pro stats ---- */}
      {tab === "prostats" && (
        sites.length === 0 ? (
          <div className="border border-dashed border-line rounded-2xl p-8 text-center">
            <span className="inline-block bg-brand-gradient text-white text-[10px] font-bold px-2 py-0.5 rounded mb-3">PRO</span>
            <h3 className="font-semibold text-lg">Full website analytics</h3>
            <p className="text-muted mt-1 max-w-md mx-auto">Add a booking website and unlock Pro stats: who&apos;s visiting, where from, what device, which pages, and how many turn into bookings.</p>
            <Link href="/host/new" className="inline-block mt-4 bg-brand-gradient text-white font-semibold px-6 py-3 rounded-full shadow-glow">Add a booking website</Link>
          </div>
        ) : !data.siteAnalytics || data.siteAnalytics.visits === 0 ? (
          <Empty>Your website analytics will appear here as visitors arrive, traffic sources, countries, devices and pages, all in one place.</Empty>
        ) : (
          <ProStats sa={data.siteAnalytics} enquiries={a.totals.enquiries} bookings={a.totals.bookings} days={days} />
        )
      )}

      {/* ---- Bookings ---- */}
      {tab === "bookings" && (
        bookings.length === 0 ? (
          <Empty>No booking requests yet. They appear here when a guest requests dates on a listing with a booking site.</Empty>
        ) : (
          <div className="space-y-2">
            {bookings.map((b) => (
              <div key={b.id} className="border border-line rounded-xl p-3.5">
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{b.listingName}</p>
                  <p className="text-sm text-muted">{b.guestEmail} · {b.checkIn} → {b.checkOut}{b.guests ? ` · ${b.guests} guests` : ""}</p>
                </div>
                <BookingActions bookingId={b.id} guestEmail={b.guestEmail} initialStatus={b.status} demo={demo} />
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

      {/* ---- AskYourStay add-on ---- */}
      {tab === "askyourstay" && (
        <div>
          <div className="rounded-2xl bg-ink text-white p-6 sm:p-8">
            <span className="inline-block bg-white/10 text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded">Optional add-on · £4.99/mo</span>
            <h3 className="mt-3 text-2xl font-display font-bold">Add an AI concierge to your stay</h3>
            <p className="mt-2 text-white/70 max-w-2xl">AskYourStay answers your guests&apos; questions on your booking site around the clock, check-in times, parking, what&apos;s nearby, so you spend less time replying. Every conversation shows up right here.</p>
            <a href="https://askyourstay.com" target="_blank" rel="noreferrer" className="inline-block mt-5 bg-brand-gradient text-white font-semibold px-6 py-3 rounded-full shadow-glow">Add AskYourStay · £4.99/mo</a>
          </div>

          <p className="text-sm font-semibold mt-7 mb-3">A preview of what you&apos;d see</p>
          <div className="space-y-3">
            {[
              { who: "Guest · 2h ago", q: "What time is check-in, and can I drop bags earlier?", a: "Check-in is from 3pm. If you arrive earlier you're welcome to leave your bags with us, just message on the day." },
              { who: "Guest · yesterday", q: "Is there parking nearby?", a: "Yes, there's free street parking right outside, and a secure car park a two-minute walk away (about £8/day)." },
              { who: "Guest · 3 days ago", q: "Where would you eat dinner near here?", a: "For seafood try Taberna do Largo (5 min walk), and Manteigaria for the best pastéis de nata on your way back." },
            ].map((c, i) => (
              <div key={i} className="border border-line rounded-xl p-4">
                <p className="text-xs text-muted mb-2">{c.who}</p>
                <p className="bg-mist rounded-2xl rounded-bl-sm px-3.5 py-2 text-sm inline-block max-w-[85%]">{c.q}</p>
                <div className="mt-2 flex justify-end">
                  <p className="bg-brand-gradient text-white rounded-2xl rounded-br-sm px-3.5 py-2 text-sm inline-block max-w-[88%]">{c.a}</p>
                </div>
                <p className="text-xs text-emerald-600 font-semibold mt-2">✓ Answered automatically</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete stay — double confirmation, warns about the website */}
      {delTarget && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/50 px-4" onClick={() => !deleting && setDelTarget(null)}>
          <div className="bg-white rounded-2xl shadow-float max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            {delStep === 1 ? (
              <>
                <h3 className="text-lg font-display font-bold">Delete {delTarget.propertyName}?</h3>
                <p className="text-sm text-muted mt-2">This permanently removes your stay from FindYourStay. Travellers won&apos;t be able to find it, and its enquiries and bookings history will be gone. This can&apos;t be undone.</p>
                {delTarget.hasBookingSite && (
                  <div className="mt-3 flex items-start gap-2.5 bg-rose-50 border border-rose-100 rounded-xl p-3">
                    <span className="text-lg leading-none">⚠️</span>
                    <p className="text-sm text-rose-700">This will also take down your booking website{delTarget.domain ? <> at <b>{delTarget.domain}</b></> : ""}. It will stop working immediately.</p>
                  </div>
                )}
                {delErr && <p className="text-sm text-brand mt-3">{delErr}</p>}
                <div className="flex gap-2 justify-end mt-5">
                  <button type="button" onClick={() => setDelTarget(null)} className="font-semibold px-4 py-2.5 rounded-full hover:bg-mist">Cancel</button>
                  <button type="button" onClick={() => { setDelErr(""); setDelStep(2); }} className="font-semibold px-5 py-2.5 rounded-full bg-rose-600 text-white hover:bg-rose-700">Yes, continue</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-display font-bold">Are you absolutely sure?</h3>
                <p className="text-sm text-muted mt-2">Last check. This permanently deletes <b>{delTarget.propertyName}</b>{delTarget.hasBookingSite ? " and its booking website" : ""}. There&apos;s no way back.</p>
                {delErr && <p className="text-sm text-brand mt-3">{delErr}</p>}
                <div className="flex gap-2 justify-end mt-5">
                  <button type="button" disabled={deleting} onClick={() => setDelStep(1)} className="font-semibold px-4 py-2.5 rounded-full hover:bg-mist disabled:opacity-50">Back</button>
                  <button type="button" disabled={deleting} onClick={confirmDelete} className="font-semibold px-5 py-2.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50">{deleting ? "Deleting…" : "Permanently delete"}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Pro website analytics ---------------- */

const COUNTRY: Record<string, string> = {
  GB: "United Kingdom", US: "United States", FR: "France", DE: "Germany", PT: "Portugal", ES: "Spain",
  NL: "Netherlands", IE: "Ireland", IT: "Italy", BE: "Belgium", CH: "Switzerland", SE: "Sweden", NO: "Norway",
  DK: "Denmark", CA: "Canada", AU: "Australia", BR: "Brazil", PL: "Poland", AT: "Austria", FI: "Finland",
};
const PAGE: Record<string, string> = { home: "Home", rooms: "The Rooms", gallery: "Gallery", location: "Location", book: "Book" };
const SOURCE_DOT: Record<string, string> = {
  Google: "bg-blue-500", Bing: "bg-teal-500", DuckDuckGo: "bg-orange-500", Direct: "bg-stone-400",
  ChatGPT: "bg-emerald-500", Gemini: "bg-indigo-500", Perplexity: "bg-purple-500", Social: "bg-pink-500", Referral: "bg-amber-500",
};
const flag = (cc: string) => (cc && cc.length === 2 ? cc.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0))) : "🌍");

function BarList({ title, subtitle, items, total }: { title: string; subtitle?: string; items: { label: string; value: number; lead?: ReactNode }[]; total: number }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="border border-line rounded-2xl p-5">
      <h3 className="font-semibold">{title}</h3>
      {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      <div className="space-y-3 mt-4">
        {items.map((it) => (
          <div key={it.label}>
            <div className="flex justify-between text-sm mb-1 gap-2">
              <span className="flex items-center gap-1.5 min-w-0">{it.lead}<span className="truncate">{it.label}</span></span>
              <span className="text-muted whitespace-nowrap">{it.value.toLocaleString()} · {Math.round((it.value / total) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-mist overflow-hidden"><div className="h-full bg-brand rounded-full" style={{ width: `${(it.value / max) * 100}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VisitsChart({ series, days = 30 }: { series: { date: string; visits: number }[]; days?: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(1, ...series.map((s) => s.visits));
  const h = hover !== null ? series[hover] : null;
  return (
    <div className="border border-line rounded-2xl p-5">
      <h3 className="font-semibold mb-4">Website visitors, last {days} days</h3>
      <div className="relative">
        {h && hover !== null && (
          <div className="absolute -top-1 z-10 -translate-x-1/2 -translate-y-full pointer-events-none" style={{ left: `${((hover + 0.5) / series.length) * 100}%` }}>
            <div className="bg-ink text-white rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-lg">
              <p className="font-semibold mb-0.5">{dayLabel(h.date)}</p>
              <p>{h.visits.toLocaleString()} visits</p>
            </div>
          </div>
        )}
        <div className="flex items-end gap-[3px] h-32" onMouseLeave={() => setHover(null)}>
          {series.map((s, i) => (
            <div key={s.date} onMouseEnter={() => setHover(i)} className="relative flex-1 h-full flex items-end cursor-pointer">
              <div className={`absolute inset-x-0 bottom-0 rounded-t-sm transition-colors ${hover === i ? "bg-brand-dark" : "bg-brand"}`} style={{ height: `${(s.visits / max) * 100}%` }} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between text-[11px] text-muted mt-2"><span>{dayLabel(series[0]?.date ?? "")}</span><span>Today</span></div>
    </div>
  );
}

function ProStats({ sa, enquiries, bookings, days = 30 }: { sa: SiteAnalytics; enquiries: number; bookings: number; days?: number }) {
  const avgDay = Math.round(sa.visits / days);
  const bookingRate = sa.visits ? Math.round((bookings / sa.visits) * 1000) / 10 : 0;
  const totalCountries = sa.countries.reduce((s, c) => s + c.visits, 0) || 1;
  const totalDevices = sa.devices.reduce((s, d) => s + d.visits, 0) || 1;
  const totalPages = sa.pages.reduce((s, p) => s + p.visits, 0) || 1;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="border border-line rounded-xl p-4"><p className="text-xs text-muted">Website visits</p><p className="text-2xl font-semibold mt-1">{sa.visits.toLocaleString()}</p><div className="mt-1"><Delta cur={sa.visits} prev={sa.prevVisits} /></div></div>
        <div className="border border-line rounded-xl p-4"><p className="text-xs text-muted">Avg per day</p><p className="text-2xl font-semibold mt-1">{avgDay.toLocaleString()}</p><p className="text-xs text-muted mt-1">over 30 days</p></div>
        <div className="border border-line rounded-xl p-4"><p className="text-xs text-muted">Countries reached</p><p className="text-2xl font-semibold mt-1">{sa.countries.length.toLocaleString()}</p><p className="text-xs text-muted mt-1">worldwide</p></div>
        <div className="border border-line rounded-xl p-4"><p className="text-xs text-muted">Visit → booking</p><p className="text-2xl font-semibold mt-1">{bookingRate}%</p><p className="text-xs text-muted mt-1">conversion</p></div>
      </div>

      <VisitsChart series={sa.series} days={days} />

      <div className="grid md:grid-cols-2 gap-4">
        <BarList title="Where visitors come from" subtitle="Traffic sources" total={sa.visits} items={sa.sources.slice(0, 7).map((s) => ({ label: s.label, value: s.visits, lead: <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${SOURCE_DOT[s.label] ?? "bg-stone-400"}`} /> }))} />
        <BarList title="Top countries" subtitle="Where in the world" total={totalCountries} items={sa.countries.slice(0, 8).map((c) => ({ label: COUNTRY[c.code] ?? c.code, value: c.visits, lead: <span className="text-base leading-none">{flag(c.code)}</span> }))} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <BarList title="Devices" subtitle="What they browse on" total={totalDevices} items={sa.devices.map((d) => ({ label: d.label, value: d.visits }))} />
        <BarList title="Most-visited pages" subtitle="On your site" total={totalPages} items={sa.pages.slice(0, 6).map((p) => ({ label: PAGE[p.path] ?? p.path, value: p.visits }))} />
      </div>

      <div className="border border-line rounded-2xl p-5">
        <h3 className="font-semibold mb-4">From visit to booking</h3>
        <div className="space-y-3">
          {([["Website visits", sa.visits], ["Enquiries", enquiries], ["Booking requests", bookings]] as [string, number][]).map(([label, val], idx) => (
            <div key={label}>
              <div className="flex justify-between text-sm mb-1"><span>{label}</span><span className="font-semibold">{val.toLocaleString()}</span></div>
              <div className="h-3 rounded-full bg-mist overflow-hidden"><div className={`h-full rounded-full ${idx === 0 ? "bg-brand" : idx === 1 ? "bg-brand/70" : "bg-brand/50"}`} style={{ width: `${sa.visits ? Math.max(4, (val / sa.visits) * 100) : 0}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
