import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConciergeChat } from "@/components/ConciergeChat";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "For travellers - FindYourStay",
  description: "Find independent guesthouses, B&Bs and rentals worldwide and book direct with the owner, with no platform fees. Ask our trip assistant for ideas.",
};

export default function GuestsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="bg-gradient-to-b from-rose-50 to-white border-b border-line">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-white text-brand text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full shadow-card">For travellers</span>
              <h1 className="mt-5 text-4xl sm:text-5xl font-display font-bold tracking-tight leading-[1.05]">Stay somewhere real. Book direct.</h1>
              <p className="mt-5 text-lg text-muted max-w-xl">
                Browse independent guesthouses, B&amp;Bs and homes around the world and book straight with the owner,
                with no platform booking fees. Not sure where to start? Ask our trip assistant.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/s" className="bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-6 py-3 rounded-full shadow-glow transition-transform active:scale-95">Browse all stays</Link>
                <Link href="/host" className="border border-ink font-semibold px-6 py-3 rounded-full hover:bg-mist transition">Are you a host?</Link>
              </div>
            </div>
            <ConciergeChat />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              ["Book direct, no fees", "Pay the owner directly. No platform booking fees added on top of your stay."],
              ["Independent places only", "Real guesthouses, B&Bs and homes with character, not faceless chains."],
              ["Talk to your host", "Send the owner your dates and questions, and book with a real person."],
            ].map(([t, d]) => (
              <div key={t} className="border border-line rounded-2xl p-6">
                <h3 className="font-display font-bold text-lg">{t}</h3>
                <p className="text-muted mt-2 text-sm leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
