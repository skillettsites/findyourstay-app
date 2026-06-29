import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-mist mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h4 className="font-semibold mb-3">Travellers</h4>
          <ul className="space-y-2 text-muted">
            <li><Link href="/s" className="hover:underline">Browse stays</Link></li>
            <li><Link href="/s?type=guest_house" className="hover:underline">Guesthouses</Link></li>
            <li><Link href="/s?type=villa" className="hover:underline">Villas</Link></li>
            <li><Link href="/s?type=apartment" className="hover:underline">Apartments</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Hosts</h4>
          <ul className="space-y-2 text-muted">
            <li><Link href="/host" className="hover:underline">What we do</Link></li>
            <li><Link href="/host/new" className="hover:underline">List your stay</Link></li>
            <li><Link href="/host#pricing" className="hover:underline">Pricing</Link></li>
            <li><Link href="/host/dashboard" className="hover:underline">Host dashboard</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Why direct</h4>
          <ul className="space-y-2 text-muted">
            <li>No platform booking fees</li>
            <li>Pay the owner directly</li>
            <li>Independent stays only</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">About</h4>
          <ul className="space-y-2 text-muted">
            <li>FindYourStay is a directory. We are not the provider and not a party to any booking.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 text-xs text-muted flex flex-wrap gap-x-4 gap-y-1 justify-between">
          <span>© {new Date().getFullYear()} FindYourStay</span>
          <span>Seed location data © OpenStreetMap contributors</span>
        </div>
      </div>
    </footer>
  );
}
