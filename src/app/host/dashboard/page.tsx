import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { BackButton } from "@/components/BackButton";
import { BookingActions } from "@/components/host/BookingActions";
import { getUser, ensureHost } from "@/lib/auth";
import {
  getListingsByHost, getListingStats, getEnquiriesForListings, getBookingsForListings,
} from "@/lib/db";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

function when(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default async function Dashboard() {
  const user = await getUser();
  if (!user) redirect("/login?next=/host/dashboard");
  await ensureHost(user!);

  const myListings = await getListingsByHost(user!.id, 50);
  const [stats, enquiries, bookings] = await Promise.all([
    Promise.all(myListings.map(async (l) => ({ listing: l, ...(await getListingStats(l.id)) }))),
    getEnquiriesForListings(myListings, 30),
    getBookingsForListings(myListings, 30),
  ]);
  const totalViews = stats.reduce((s, x) => s + x.views, 0);
  const hasListings = myListings.length > 0;
  const pendingBookings = bookings.filter((b) => b.status === "requested").length;

  return (
    <>
      <Header />
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 py-6">
        <div className="mb-4">
          <BackButton fallback="/" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold">Your dashboard</h1>
            <p className="text-sm text-muted">Signed in as {user!.email}</p>
          </div>
          <Link href="/host/new" className="self-start bg-brand-gradient bg-brand-gradient-hover text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-glow">
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
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
              {[
                ["Views", String(totalViews)],
                ["Enquiries", String(enquiries.length)],
                ["Booking requests", String(pendingBookings)],
                ["Listings", String(myListings.length)],
              ].map(([label, value]) => (
                <div key={label} className="border border-line rounded-xl p-4">
                  <p className="text-xs text-muted">{label}</p>
                  <p className="text-xl font-semibold mt-1">{value}</p>
                </div>
              ))}
            </div>

            {/* Listings */}
            <h2 className="font-display font-bold text-lg mb-3">Listings</h2>
            <div className="space-y-3">
              {stats.map(({ listing: l, views, enquiries: ec }) => (
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
                    <p className="text-xs text-muted mt-0.5">{views} views · {ec} enquiries</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                    <Link href={`/host/calendar/${l.slug}`} className="text-sm font-semibold border border-line rounded-full px-4 py-2 hover:bg-mist text-center">
                      Calendar
                    </Link>
                    <Link href={`/rooms/${l.slug}`} className="text-sm font-semibold border border-line rounded-full px-4 py-2 hover:bg-mist text-center">
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Booking requests */}
            <h2 className="font-display font-bold text-lg mt-10 mb-3">Booking requests</h2>
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
                    <BookingActions bookingId={b.id} initialStatus={b.status} />
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
                      <a href={`mailto:${e.guestEmail}`} className="text-brand font-medium">{e.guestEmail}</a>
                      {e.checkIn ? ` · ${e.checkIn}${e.checkOut ? ` → ${e.checkOut}` : ""}` : ""}
                      {e.guests ? ` · ${e.guests} guests` : ""}
                    </p>
                    {e.message && <p className="text-sm mt-1.5 text-ink/80">{e.message}</p>}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
