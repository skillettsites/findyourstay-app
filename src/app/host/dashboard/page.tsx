import Link from "next/link";
import { Header } from "@/components/Header";
import { BackButton } from "@/components/BackButton";
import { getHostListings, getListingStats } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

// Shows the host's real created listings with REAL view/enquiry counts from the
// events table (honest: a brand-new listing shows real, low numbers).
export default async function Dashboard() {
  const myListings = await getHostListings(10);
  const stats = await Promise.all(
    myListings.map(async (l) => ({ listing: l, ...(await getListingStats(l.id)) })),
  );
  const totalViews = stats.reduce((s, x) => s + x.views, 0);
  const totalEnquiries = stats.reduce((s, x) => s + x.enquiries, 0);
  const hasListings = myListings.length > 0;
  const nav = ["Listings", "Calendar", "Enquiries", "Booking site", "Billing", "Verify (KYC)"];

  return (
    <>
      <Header />
      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-6 grid md:grid-cols-[200px_1fr] gap-8">
        <aside className="hidden md:block">
          <nav className="space-y-1 text-sm">
            {nav.map((n, i) => (
              <button key={n} className={`w-full text-left px-3 py-2 rounded-lg ${i === 0 ? "bg-mist font-semibold" : "text-muted hover:bg-mist"}`}>
                {n}
              </button>
            ))}
          </nav>
        </aside>

        <main>
          <div className="mb-4">
            <BackButton fallback="/host" />
          </div>
          <div className="bg-amber-50 border border-amber-200 text-amber-900 text-sm rounded-xl px-4 py-2.5 mb-6">
            Local preview. Billing, Stripe Connect onboarding and calendar sync are stubbed and wired up at deploy time.
          </div>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-display font-bold">Your listings</h1>
            <Link href="/host/new" className="bg-brand-gradient bg-brand-gradient-hover text-white text-sm font-semibold px-4 py-2 rounded-full shadow-glow">
              + Add listing
            </Link>
          </div>

          {!hasListings ? (
            <div className="text-center border border-dashed border-line rounded-2xl py-16 px-6">
              <div className="text-4xl">🏠</div>
              <h2 className="font-semibold text-lg mt-3">No listings yet</h2>
              <p className="text-muted mt-1 max-w-sm mx-auto">Add your first stay and start getting direct bookings. It takes about five minutes.</p>
              <Link href="/host/new" className="inline-block mt-5 bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-6 py-3 rounded-full shadow-glow">
                List your stay
              </Link>
            </div>
          ) : (
            <>
              {/* Stat cards (real counts from the events table) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  ["Views", String(totalViews)],
                  ["Enquiries", String(totalEnquiries)],
                  ["Listings", String(myListings.length)],
                  ["Plan", "Active"],
                ].map(([label, value]) => (
                  <div key={label} className="border border-line rounded-xl p-4">
                    <p className="text-xs text-muted">{label}</p>
                    <p className="text-xl font-semibold mt-1">{value}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted mb-6">Stats are live and start counting the moment your listing is published.</p>

              <div className="space-y-3">
                {stats.map(({ listing: l, views, enquiries }) => (
                  <div key={l.id} className="flex items-center gap-4 border border-line rounded-xl p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {l.photos[0] ? (
                      <img src={l.photos[0]} alt="" className="w-20 h-20 rounded-lg object-cover bg-mist" />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-rose-50 to-mist grid place-items-center text-brand/50 text-xs">Soon</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{l.propertyName}</p>
                      <p className="text-sm text-muted truncate">
                        {l.cityName}, {l.country} · {formatPrice(l.pricePerNight, l.currency)}/night
                        {l.hasBookingSite && <span className="ml-2 text-brand font-medium">· Booking website</span>}
                      </p>
                      <p className="text-xs text-muted mt-0.5">{views} views · {enquiries} enquiries</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link href={`/host/calendar/${l.slug}`} className="text-sm font-semibold border border-line rounded-full px-4 py-2 hover:bg-mist">
                        Calendar
                      </Link>
                      <Link href={`/rooms/${l.slug}`} className="text-sm font-semibold border border-line rounded-full px-4 py-2 hover:bg-mist">
                        Preview
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 bg-mist rounded-xl p-4">
                <p className="text-sm font-medium">Did you get a booking from FindYourStay this month?</p>
                <div className="flex gap-2">
                  <button className="bg-ink text-white text-sm font-semibold px-4 py-2 rounded-full">Yes</button>
                  <button className="border border-line text-sm font-semibold px-4 py-2 rounded-full">Not yet</button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
