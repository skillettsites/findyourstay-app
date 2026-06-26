import { notFound } from "next/navigation";
import { MicrositeView } from "@/components/MicrositeView";
import { getListingByDomain } from "@/lib/db";

export const dynamic = "force-dynamic";

// The LIVE booking site served on a host's own domain. Middleware rewrites a
// custom hostname here; we resolve domain -> listing and render the real site.
export default async function ByDomainPage({ params }: { params: Promise<{ host: string }> }) {
  const { host } = await params;
  const listing = await getListingByDomain(decodeURIComponent(host));
  if (!listing) notFound();
  return <MicrositeView listing={listing} domain={host} />;
}
