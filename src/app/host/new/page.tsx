import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { BackButton } from "@/components/BackButton";
import { ListingWizard } from "@/components/host/ListingWizard";
import { getUser } from "@/lib/auth";
import { getListingsByHost, planAllowance } from "@/lib/db";

export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function NewListingPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const tier = one(sp.tier) || "featured";
  const build = one(sp.website) === "1";
  const name = one(sp.name);
  const city = one(sp.city);
  const price = one(sp.price);
  const theme = one(sp.theme);

  // Listing requires a host account so the listing is owned by them.
  const user = await getUser();
  if (!user) {
    const qs = new URLSearchParams();
    qs.set("tier", tier);
    if (build) qs.set("website", "1");
    if (name) qs.set("name", name);
    if (city) qs.set("city", city);
    if (price) qs.set("price", price);
    if (theme) qs.set("theme", theme);
    redirect(`/login?next=${encodeURIComponent(`/host/new?${qs.toString()}`)}`);
  }

  // Enforce the plan's property allowance (Pro = 5, everyone else = 1). If they've
  // used it up, send them to manage their stays rather than start another.
  const existing = await getListingsByHost(user!.id, 10);
  const allow = planAllowance(existing);
  if (existing.length >= allow.properties) {
    const l = existing[0];
    return (
      <>
        <Header />
        <main className="mx-auto max-w-xl w-full px-4 sm:px-6 py-12">
          <div className="mb-6">
            <BackButton fallback="/host/dashboard" />
          </div>
          <div className="text-center bg-white border border-line rounded-2xl shadow-card p-8">
            <div className="mx-auto w-14 h-14 rounded-full bg-rose-50 text-brand grid place-items-center text-2xl">🏡</div>
            <h1 className="text-2xl font-display font-bold mt-4">{allow.properties === 1 ? "You already have a stay" : "You've used all your stays"}</h1>
            <p className="text-muted mt-2">Your plan includes {allow.properties} {allow.properties === 1 ? "stay" : "stays"}{allow.isPro ? "" : ", each with its own booking website"}. {allow.properties === 1 ? <>You can edit <b>{l.propertyName}</b> any time, or upgrade to Pro to list up to 5.</> : "Manage your stays from your dashboard, or delete one to add another."}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <Link href={`/host/listing/${l.slug}/edit`} className="bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-6 py-3 rounded-full shadow-glow">Edit your stay</Link>
              <Link href="/host/dashboard" className="border border-ink font-semibold px-6 py-3 rounded-full hover:bg-mist">Go to dashboard</Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl w-full px-4 sm:px-6 py-8">
        <div className="mb-6">
          <BackButton fallback="/host" />
        </div>
        <ListingWizard initialTier={tier} initialBuild={build} userEmail={user!.email} initialName={name} initialCity={city} initialPrice={price} initialTheme={theme} />
      </main>
    </>
  );
}
