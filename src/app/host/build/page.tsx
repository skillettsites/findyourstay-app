import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BackButton } from "@/components/BackButton";
import { SiteBuilder } from "@/components/SiteBuilder";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Build your booking website - FindYourStay",
  description: "See your own booking website before you sign up. Pick a style, add your details, and watch it come to life. Make it live in minutes.",
};

export default function BuildPage() {
  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-6 py-8">
        <div className="mb-5"><BackButton fallback="/host" /></div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-block bg-rose-50 text-brand text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full">Free preview, no signup</span>
          <h1 className="mt-4 text-3xl sm:text-4xl font-display font-bold">See what your booking website would look like</h1>
          <p className="mt-3 text-muted text-lg">Pick a style, add a few details, and watch your own site build itself live. Love it? Make it live in minutes.</p>
        </div>
        <SiteBuilder />
      </main>
      <Footer />
    </>
  );
}
