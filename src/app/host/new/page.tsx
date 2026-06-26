import { Header } from "@/components/Header";
import { BackButton } from "@/components/BackButton";
import { ListingWizard } from "@/components/host/ListingWizard";

export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function NewListingPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const tier = (Array.isArray(sp.tier) ? sp.tier[0] : sp.tier) ?? "featured";
  const build = (Array.isArray(sp.website) ? sp.website[0] : sp.website) === "1";

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl w-full px-4 sm:px-6 py-8">
        <div className="mb-6">
          <BackButton fallback="/host" />
        </div>
        <ListingWizard initialTier={tier} initialBuild={build} />
      </main>
    </>
  );
}
