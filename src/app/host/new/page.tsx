import { redirect } from "next/navigation";
import { Header } from "@/components/Header";
import { BackButton } from "@/components/BackButton";
import { ListingWizard } from "@/components/host/ListingWizard";
import { getUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function NewListingPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const tier = (Array.isArray(sp.tier) ? sp.tier[0] : sp.tier) ?? "featured";
  const build = (Array.isArray(sp.website) ? sp.website[0] : sp.website) === "1";

  // Listing requires a host account so the listing is owned by them.
  const user = await getUser();
  if (!user) {
    const qs = new URLSearchParams();
    if (tier) qs.set("tier", String(tier));
    if (build) qs.set("website", "1");
    redirect(`/login?next=${encodeURIComponent(`/host/new?${qs.toString()}`)}`);
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl w-full px-4 sm:px-6 py-8">
        <div className="mb-6">
          <BackButton fallback="/host" />
        </div>
        <ListingWizard initialTier={tier} initialBuild={build} userEmail={user!.email} />
      </main>
    </>
  );
}
