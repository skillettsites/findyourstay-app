import Link from "next/link";
import { Header } from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header showSearch={false} />
      <main className="flex-1 grid place-items-center px-6 py-24 text-center">
        <div>
          <p className="text-6xl font-display font-extrabold text-gradient-brand">404</p>
          <h1 className="text-2xl font-semibold mt-4">We couldn&apos;t find that stay</h1>
          <p className="text-muted mt-2">It may have been removed, or the link is wrong.</p>
          <Link href="/" className="inline-block mt-6 bg-brand-gradient bg-brand-gradient-hover text-white font-semibold px-6 py-3 rounded-full shadow-glow">
            Back to home
          </Link>
        </div>
      </main>
    </>
  );
}
