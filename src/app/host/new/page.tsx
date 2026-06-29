import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { BackButton } from "@/components/BackButton";
import { ListingWizard } from "@/components/host/ListingWizard";
import { getUser } from "@/lib/auth";

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
