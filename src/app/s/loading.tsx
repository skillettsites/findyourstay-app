import { Suspense } from "react";
import { Header } from "@/components/Header";
import { CategoryRow } from "@/components/CategoryRow";
import { SearchBar } from "@/components/SearchBar";

// /s renders at request time (it reads search params) so it can't be ISR, and
// the page component awaits a database call before returning anything. Without
// this file, Next.js has no streaming boundary for that route: the browser
// gets nothing at all, not even the header, until the query finishes, which
// reads as a blank/broken page. This mirrors the real layout so there is no
// jump when the actual results replace it.
export default function Loading() {
  return (
    <>
      <Header />
      <div className="md:hidden px-4 sm:px-6 pt-3 pb-1">
        <SearchBar compact fullWidth />
      </div>
      <Suspense fallback={<div className="h-16" />}>
        <CategoryRow />
      </Suspense>

      <div className="flex flex-1">
        <div className="flex-1 px-4 sm:px-6 py-5 lg:max-w-[60%]">
          <div className="mb-4 h-9 w-20 rounded-full bg-mist animate-pulse" />
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-2">
              <div className="h-7 w-56 rounded-md bg-mist animate-pulse" />
              <div className="h-4 w-64 rounded-md bg-mist animate-pulse" />
            </div>
            <div className="hidden sm:block h-9 w-36 rounded-full bg-mist animate-pulse" />
          </div>

          <p role="status" className="sr-only">Loading stays…</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-square rounded-2xl bg-mist animate-pulse" />
                <div className="pt-3 space-y-2">
                  <div className="h-4 w-3/4 rounded-md bg-mist animate-pulse" />
                  <div className="h-3.5 w-1/2 rounded-md bg-mist animate-pulse" />
                  <div className="h-4 w-1/3 rounded-md bg-mist animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map column */}
        <div className="hidden lg:block w-[40%] sticky top-[120px] h-[calc(100vh-120px)] border-l border-line bg-mist animate-pulse" />
      </div>
    </>
  );
}
