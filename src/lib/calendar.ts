// Calendar engine on Supabase. iCal import/export, availability, request-to-book.
import "server-only";
import { sb, T } from "./sb";

export interface CalBlock {
  id: string;
  start: string;
  end: string;
  source: string;
}

type Row = Record<string, unknown>;

function isoFromIcalDate(v: string): string | null {
  const m = v.match(/(\d{4})(\d{2})(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

export function parseIcal(text: string): { uid: string; start: string; end: string }[] {
  const out: { uid: string; start: string; end: string }[] = [];
  const events = text.split(/BEGIN:VEVENT/).slice(1);
  for (const ev of events) {
    const body = ev.split(/END:VEVENT/)[0];
    const uidM = body.match(/UID:([^\r\n]+)/);
    const dtStart = body.match(/DTSTART[^:]*:([0-9TZ]+)/);
    const dtEnd = body.match(/DTEND[^:]*:([0-9TZ]+)/);
    if (!dtStart) continue;
    const start = isoFromIcalDate(dtStart[1]);
    const end = dtEnd ? isoFromIcalDate(dtEnd[1]) : start;
    if (!start || !end) continue;
    out.push({ uid: (uidM?.[1] ?? `${start}-${end}`).trim(), start, end });
  }
  return out;
}

export async function getBlocks(listingId: string): Promise<CalBlock[]> {
  const { data } = await sb
    .from(T.calendar)
    .select("id,start_date,end_date,source")
    .eq("listing_id", listingId)
    .order("start_date", { ascending: true });
  return ((data ?? []) as Row[]).map((r) => ({
    id: String(r.id),
    start: r.start_date as string,
    end: r.end_date as string,
    source: (r.source as string) ?? "manual",
  }));
}

export async function isAvailable(listingId: string, checkIn: string, checkOut: string): Promise<boolean> {
  if (!checkIn || !checkOut || checkOut <= checkIn) return false;
  const { count } = await sb
    .from(T.calendar)
    .select("*", { count: "exact", head: true })
    .eq("listing_id", listingId)
    .lt("start_date", checkOut)
    .gt("end_date", checkIn);
  return (count ?? 0) === 0;
}

export async function addManualBlock(listingId: string, start: string, end: string) {
  await sb.from(T.calendar).insert({ id: crypto.randomUUID(), listing_id: listingId, start_date: start, end_date: end, source: "manual" });
}

export async function removeBlock(id: string) {
  await sb.from(T.calendar).delete().eq("id", id);
}

// Free up a held range (e.g. when a host declines a booking request).
export async function removeBlocksForRange(listingId: string, start: string, end: string, source: string) {
  await sb
    .from(T.calendar)
    .delete()
    .eq("listing_id", listingId)
    .eq("source", source)
    .eq("start_date", start)
    .eq("end_date", end);
}

export async function getIcalUrls(listingId: string): Promise<string[]> {
  const { data } = await sb.from(T.listings).select("external_ical_urls").eq("id", listingId).maybeSingle();
  const v = data?.external_ical_urls;
  return Array.isArray(v) ? (v as string[]) : [];
}

export async function setIcalUrls(listingId: string, urls: string[]) {
  await sb.from(T.listings).update({ external_ical_urls: urls }).eq("id", listingId);
}

export async function buildIcs(listingId: string, propertyName: string): Promise<string> {
  const { data } = await sb
    .from(T.calendar)
    .select("id,start_date,end_date")
    .eq("listing_id", listingId)
    .in("source", ["manual", "fys"]);
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//FindYourStay//EN", "CALSCALE:GREGORIAN", `X-WR-CALNAME:${propertyName} availability`];
  for (const b of (data ?? []) as Row[]) {
    const s = (b.start_date as string).replace(/-/g, "");
    const e = (b.end_date as string).replace(/-/g, "");
    lines.push("BEGIN:VEVENT", `UID:${b.id}@findyourstay`, `DTSTART;VALUE=DATE:${s}`, `DTEND;VALUE=DATE:${e}`, "SUMMARY:Unavailable", "END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function sourceFromUrl(url: string): string {
  const u = url.toLowerCase();
  if (u.includes("airbnb")) return "airbnb";
  if (u.includes("booking")) return "booking";
  if (u.includes("vrbo") || u.includes("homeaway")) return "vrbo";
  return "external";
}

export async function syncListing(listingId: string): Promise<{ imported: number; sources: number }> {
  const urls = await getIcalUrls(listingId);
  let imported = 0;
  for (const url of urls) {
    const source = sourceFromUrl(url);
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 10_000);
      const res = await fetch(url, { signal: ctrl.signal, headers: { "User-Agent": "FindYourStay/1.0" } });
      clearTimeout(t);
      if (!res.ok) continue;
      const events = parseIcal(await res.text());
      const seen = new Set<string>();
      for (const e of events) {
        const id = `${listingId}:${source}:${e.uid}`;
        seen.add(id);
        await sb.from(T.calendar).upsert({ id, listing_id: listingId, start_date: e.start, end_date: e.end, source, external_uid: e.uid });
        imported++;
      }
      const { data: existing } = await sb.from(T.calendar).select("id").eq("listing_id", listingId).eq("source", source);
      for (const row of (existing ?? []) as Row[]) {
        if (!seen.has(String(row.id))) await sb.from(T.calendar).delete().eq("id", String(row.id));
      }
    } catch {
      /* dead feed */
    }
  }
  return { imported, sources: urls.length };
}

export async function listingsWithIcal(): Promise<{ id: string }[]> {
  const { data } = await sb.from(T.listings).select("id,external_ical_urls").eq("source", "host");
  return ((data ?? []) as Row[])
    .filter((r) => Array.isArray(r.external_ical_urls) && (r.external_ical_urls as unknown[]).length > 0)
    .map((r) => ({ id: r.id as string }));
}

export async function requestBooking(input: {
  listingId: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  guests?: number;
}): Promise<{ ok: boolean; bookingId?: string; error?: string }> {
  if (!(await isAvailable(input.listingId, input.checkIn, input.checkOut))) {
    return { ok: false, error: "Those dates are not available." };
  }
  const id = crypto.randomUUID();
  await sb.from(T.bookings).insert({
    id, listing_id: input.listingId, guest_email: input.guestEmail,
    check_in: input.checkIn, check_out: input.checkOut, guests: input.guests ?? null, status: "requested", currency: "gbp",
  });
  await sb.from(T.calendar).insert({ id: crypto.randomUUID(), listing_id: input.listingId, start_date: input.checkIn, end_date: input.checkOut, source: "fys" });
  return { ok: true, bookingId: id };
}
