// Domain availability + pricing for the booking-website add-on.
// Availability is real (RDAP, the IANA registration-data protocol). Pricing is
// the annual registration cost we pay to register on the host's behalf — we only
// ever offer TLDs at or under the £15/yr cap so the add-on stays profitable.
import "server-only";

export const MAX_PRICE = 15; // £/year — we never offer a domain above this

// Annual registration price (GBP) per TLD we support. Kept a little conservative
// so we never under-quote what it costs us through the registrar.
const TLD_PRICE: Record<string, number> = {
  "co.uk": 9,
  uk: 9,
  com: 12,
  org: 12,
  net: 13,
  info: 13,
};
// Cheapest first — drives both candidate order and "suggest cheaper" sorting.
const TLDS = Object.keys(TLD_PRICE).sort((a, b) => TLD_PRICE[a] - TLD_PRICE[b]);

export interface DomainOption {
  domain: string;
  tld: string;
  price: number;
  available: boolean;
}

export interface DomainSearchResult {
  query: string;
  base: string;
  exact: DomainOption | null; // the host's typed domain, if they gave a TLD (may be taken/over budget)
  options: DomainOption[]; // available, ≤ £15/yr, cheapest first
}

const clean = (s: string) => s.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "").slice(0, 40);

// Reduce a typed value ("seaview.com", "Sea View Guesthouse") to the bare label.
export function baseLabel(input: string): string {
  let s = input.trim().toLowerCase();
  for (const tld of TLDS) if (s.endsWith("." + tld)) { s = s.slice(0, -(tld.length + 1)); break; }
  s = s.replace(/\.[a-z.]{2,}$/, ""); // strip any other trailing tld
  return clean(s);
}

function variations(base: string): string[] {
  if (!base) return [];
  const v = [base, `${base}stay`, `stayat${base}`, `${base}bnb`, `${base}rooms`, `the${base}`, `visit${base}`, `${base}house`];
  return [...new Set(v.map(clean).filter((x) => x.length >= 3 && x.length <= 40))];
}

// True = unregistered (available), false = registered, null = couldn't tell.
// We only trust a definitive 404/200 so an unsupported TLD never reads "available".
async function isAvailable(domain: string): Promise<boolean | null> {
  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 4500);
    const res = await fetch(`https://rdap.org/domain/${domain}`, { signal: ac.signal, headers: { accept: "application/rdap+json" } });
    clearTimeout(t);
    if (res.status === 404) return true;
    if (res.status === 200) return false;
    return null;
  } catch {
    return null;
  }
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (it: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx]); }
    }),
  );
  return out;
}

const tldOf = (d: string) => TLDS.find((t) => d.endsWith("." + t)) ?? d.split(".").slice(1).join(".");

export async function searchDomains(input: string): Promise<DomainSearchResult> {
  const raw = input.trim().toLowerCase();
  const base = baseLabel(input);
  if (!base) return { query: raw, base, exact: null, options: [] };

  // Their exact name across every affordable TLD, then a handful of name
  // variations on the two cheapest TLDs so there are always alternatives.
  const cands = new Set<string>();
  for (const tld of TLDS) cands.add(`${base}.${tld}`);
  for (const vbase of variations(base).slice(1)) for (const tld of TLDS.slice(0, 2)) cands.add(`${vbase}.${tld}`);
  const list = [...cands].slice(0, 18);

  const checked = await mapLimit(list, 8, async (d) => ({ d, ok: await isAvailable(d) }));

  const options: DomainOption[] = checked
    .filter((r) => r.ok === true)
    .map((r) => { const tld = tldOf(r.d); return { domain: r.d, tld, price: TLD_PRICE[tld] ?? 999, available: true }; })
    .filter((o) => o.price <= MAX_PRICE)
    .sort((a, b) => a.price - b.price || a.domain.length - b.domain.length)
    .slice(0, 9);

  // If they typed a full domain, report its exact status so the UI can say
  // "that one's taken" and fall back to the cheaper alternatives below.
  let exact: DomainOption | null = null;
  const typedTld = TLDS.find((t) => raw.endsWith("." + t));
  if (typedTld) {
    const d = `${base}.${typedTld}`;
    const found = checked.find((r) => r.d === d);
    exact = { domain: d, tld: typedTld, price: TLD_PRICE[typedTld] ?? 999, available: found?.ok === true };
  }
  return { query: raw, base, exact, options };
}
