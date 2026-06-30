import { redirect, notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { BackButton } from "@/components/BackButton";
import { EditListing } from "@/components/host/EditListing";
import { getUser } from "@/lib/auth";
import { getListingBySlug } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EditListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const user = await getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/host/listing/${slug}/edit`)}`);

  const listing = await getListingBySlug(slug);
  if (!listing) notFound();
  if (listing.hostId !== user!.id) redirect("/host/dashboard");

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl w-full px-4 sm:px-6 py-8">
        <div className="mb-5">
          <BackButton fallback="/host/dashboard" />
        </div>
        <h1 className="text-2xl font-display font-bold mb-1">Edit {listing.propertyName}</h1>
        <p className="text-sm text-muted mb-6">Update your details, photos and template. Changes go live instantly.</p>
        <EditListing listing={listing} />
      </main>
    </>
  );
}
