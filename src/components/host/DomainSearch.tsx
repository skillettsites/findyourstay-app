"use client";

import { useEffect, useRef, useState } from "react";

interface DomainOption { domain: string; tld: string; price: number; available: boolean }
interface SearchResult { query: string; base: string; exact: DomainOption | null; options: DomainOption[] }

// Domain picker for the builder: the host searches a name, we show real
// available addresses (all ≤ £15/yr, cheapest first) and they pick one. The
// chosen address is locked in once the site is built, so it lives only here on
// Add Listing, never on Edit.
export function DomainSearch({ value, onSelect, defaultQuery = "" }: { value: string; onSelect: (domain: string) => void; defaultQuery?: string }) {
  const [query, setQuery] = useState(defaultQuery);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ranInitial = useRef(false);

  async function run(q: string) {
    if (q.trim().length < 2) { setResult(null); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`/api/host/domain-search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not check domains.");
      setResult(data as SearchResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not check domains.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  // Auto-run once on mount when we already have a suggested name.
  useEffect(() => {
    if (!ranInitial.current && defaultQuery.trim().length >= 2) { ranInitial.current = true; run(defaultQuery); }
  }, [defaultQuery]);

  function onChange(v: string) {
    setQuery(v);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => run(v), 450);
  }

  const exactTaken = result?.exact && !result.exact.available;
  const exactOk = result?.exact && result.exact.available && result.exact.price <= 15;

  return (
    <div>
      <p className="text-sm font-semibold mb-1.5">Find your web address</p>
      <div className="relative">
        <input
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. sea view guesthouse"
          className="w-full border border-line rounded-xl px-4 py-3 text-sm outline-none focus:border-ink bg-white pr-24"
        />
        <button
          type="button"
          onClick={() => run(query)}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-ink text-white text-xs font-semibold px-3.5 py-2 rounded-full hover:bg-ink/90"
        >
          {loading ? "Checking…" : "Search"}
        </button>
      </div>
      <p className="text-xs text-muted mt-1.5">We register it for you and build your site on it. Every option is under £15/year, included in your add-on.</p>

      {error && <p className="text-xs text-brand mt-2">{error}</p>}

      {exactTaken && (
        <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mt-3">
          <b>{result!.exact!.domain}</b> is already taken. Here are available addresses you can use instead:
        </p>
      )}

      {result && (
        <div className="mt-3 space-y-2">
          {result.options.length === 0 && !loading ? (
            <p className="text-sm text-muted border border-dashed border-line rounded-xl p-4">
              No available addresses under £15/year for that name. Try a different or shorter name above.
            </p>
          ) : (
            result.options.map((o) => {
              const selected = value === o.domain;
              const isExact = exactOk && result.exact!.domain === o.domain;
              return (
                <button
                  key={o.domain}
                  type="button"
                  onClick={() => onSelect(o.domain)}
                  className={`w-full flex items-center justify-between gap-3 text-left rounded-xl border-2 px-4 py-3 transition bg-white ${selected ? "border-brand ring-1 ring-brand/30" : "border-line hover:border-ink"}`}
                >
                  <span className="min-w-0">
                    <span className="font-semibold block truncate">{o.domain}</span>
                    <span className="text-xs text-emerald-700 font-medium">✓ Available{isExact ? " · your first choice" : ""}</span>
                  </span>
                  <span className="flex items-center gap-2 shrink-0">
                    <span className="text-sm text-muted">£{o.price}/yr</span>
                    <span className={`grid place-items-center w-5 h-5 rounded-full text-[11px] ${selected ? "bg-brand text-white" : "border border-line text-transparent"}`}>✓</span>
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}

      {value && (
        <p className="text-xs text-ink bg-mist rounded-lg px-3 py-2 mt-3">
          Selected: <b>{value}</b>. Your web address can&apos;t be changed once your site is built, so choose carefully.
        </p>
      )}
    </div>
  );
}
