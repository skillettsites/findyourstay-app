// "Book direct and get..." benefits, shown to guests. Pure markup (server-safe).
export function PerksList({ perks, className = "" }: { perks: string[]; className?: string }) {
  if (!perks?.length) return null;
  return (
    <div className={`rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 ${className}`}>
      <p className="text-sm font-semibold text-emerald-900">Book direct and get</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {perks.map((p) => (
          <span key={p} className="inline-flex items-center gap-1.5 bg-white border border-emerald-200 text-emerald-800 text-sm rounded-full px-3 py-1.5">
            <span className="text-emerald-600">✓</span> {p}
          </span>
        ))}
      </div>
    </div>
  );
}

// Compact one-line indicator for listing cards.
export function PerksPill({ perks }: { perks: string[] }) {
  if (!perks?.length) return null;
  return (
    <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-semibold">
      <span className="text-emerald-600">✓</span>
      {perks[0]}{perks.length > 1 ? ` +${perks.length - 1} more` : ""}
    </span>
  );
}
