"use client";

import { useRef, useState } from "react";

/* eslint-disable @next/next/no-img-element */

// Photo gallery for the room detail page. Mobile gets a full-width swipeable
// carousel (all photos, including the ones hidden in the desktop grid); desktop
// keeps the Airbnb-style 5-up grid.
export function RoomGallery({ photos, name }: { photos: string[]; name: string }) {
  const [i, setI] = useState(0);
  const touchX = useRef<number | null>(null);
  const grid = photos.slice(0, 5);

  function step(d: number) {
    setI((p) => (p + d + photos.length) % photos.length);
  }

  return (
    <>
      {/* Mobile: swipeable carousel */}
      <div
        className="sm:hidden mt-4 relative rounded-3xl overflow-hidden shadow-card bg-mist touch-pan-y"
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchX.current == null || photos.length < 2) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        <img src={photos[i]} alt={name} className="w-full h-72 object-cover" />
        {photos.length > 1 && (
          <>
            <div className="absolute top-3 right-3 bg-black/55 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {i + 1} / {photos.length}
            </div>
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {photos.map((_, d) => (
                <span key={d} className={`rounded-full transition-all ${d === i ? "w-2 h-2 bg-white" : "w-1.5 h-1.5 bg-white/60"}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Desktop: grid */}
      <div className="hidden sm:grid grid-cols-4 grid-rows-2 gap-2 mt-4 rounded-3xl overflow-hidden h-[440px] shadow-card">
        <div className="relative overflow-hidden col-span-2 row-span-2 group/g">
          <img src={grid[0]} alt={name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/g:scale-105" />
        </div>
        {grid.slice(1, 5).map((p, idx) => (
          <div key={idx} className="relative overflow-hidden group/g">
            <img src={p} alt="" className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/g:scale-105" />
          </div>
        ))}
        {grid.length < 2 && (
          <div className="col-span-2 row-span-2 bg-mist flex items-center justify-center text-center p-6">
            <p className="text-muted text-sm">More photos coming soon.</p>
          </div>
        )}
      </div>
    </>
  );
}
