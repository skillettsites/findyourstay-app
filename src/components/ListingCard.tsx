"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import type { Listing } from "@/lib/types";
import { formatPrice, prettyType } from "@/lib/format";
import { TIER_CONFIG } from "@/lib/types";

export function ListingCard({ listing, hrefSuffix = "" }: { listing: Listing; hrefSuffix?: string }) {
  const [i, setI] = useState(0);
  const [saved, setSaved] = useState(false);
  const photos = listing.photos;
  const hasPhotos = photos.length > 0;
  const badge = TIER_CONFIG[listing.tier].badge;

  const touchX = useRef<number | null>(null);
  const swiped = useRef(false);
  const preloaded = useRef(false);
  function preloadAll() {
    if (preloaded.current || photos.length < 2) return;
    preloaded.current = true;
    photos.forEach((p) => { const im = new window.Image(); im.src = p; });
  }

  function step(d: number) {
    setI((p) => (p + d + photos.length) % photos.length);
  }
  function go(d: number, e: React.MouseEvent) {
    e.preventDefault();
    step(d);
  }
  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0].clientX;
    swiped.current = false;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current == null || photos.length < 2) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) {
      swiped.current = true; // suppress the click-through navigation for this gesture
      step(dx < 0 ? 1 : -1);
    }
    touchX.current = null;
  }

  return (
    <Link
      href={`/rooms/${listing.slug}${hrefSuffix}`}
      className="group block"
      onClickCapture={(e) => { if (swiped.current) { e.preventDefault(); swiped.current = false; } }}
    >
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        onMouseEnter={preloadAll}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative aspect-square rounded-2xl overflow-hidden bg-mist shadow-card group-hover:shadow-float transition-shadow duration-300 touch-pan-y"
      >
        {hasPhotos ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photos[i]}
            alt={listing.propertyName}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <PhotoPlaceholder />
        )}

        {/* subtle gradient for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />

        {badge && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur text-ink text-[11px] font-bold px-2.5 py-1 rounded-full shadow-card">
            {badge}
          </span>
        )}

        <motion.button
          whileTap={{ scale: 0.8 }}
          onClick={(e) => {
            e.preventDefault();
            setSaved((s) => !s);
          }}
          aria-label="Save"
          className="absolute top-3 right-3"
        >
          <motion.svg
            width="26" height="26" viewBox="0 0 24 24"
            animate={saved ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.35 }}
            fill={saved ? "var(--color-brand)" : "rgba(0,0,0,0.5)"}
            stroke="white" strokeWidth="2" className="drop-shadow"
          >
            <path d="M12 21s-7-4.6-9.3-9C1.2 9 2.4 5.5 5.8 5.5c2 0 3.2 1.2 4.2 2.6 1-1.4 2.2-2.6 4.2-2.6 3.4 0 4.6 3.5 3.1 6.5C19 16.4 12 21 12 21Z" />
          </motion.svg>
        </motion.button>

        {photos.length > 1 && (
          <>
            <CarBtn dir="prev" onClick={(e) => go(-1, e)} />
            <CarBtn dir="next" onClick={(e) => go(1, e)} />
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {photos.map((_, d) => (
                <span
                  key={d}
                  className={`rounded-full transition-all duration-300 ${
                    d === i ? "w-2 h-2 bg-white" : "w-1.5 h-1.5 bg-white/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </motion.div>

      <div className="pt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-ink truncate group-hover:text-brand transition-colors">
            {listing.propertyName}
          </h3>
        </div>
        <p className="text-muted text-sm truncate">
          {prettyType(listing.propertyType)} · {listing.cityName}, {listing.country}
        </p>
        {listing.perks.length > 0 ? (
          <p className="text-emerald-700 text-sm font-medium truncate">✓ {listing.perks[0]}{listing.perks.length > 1 ? ` +${listing.perks.length - 1}` : ""}</p>
        ) : (
          <p className="text-muted text-sm">Book direct, no fees</p>
        )}
        <p className="pt-1.5 text-ink">
          <span className="font-bold">{formatPrice(listing.pricePerNight, listing.currency)}</span>
          <span className="text-muted"> night</span>
        </p>
      </div>
    </Link>
  );
}

function CarBtn({ dir, onClick }: { dir: "prev" | "next"; onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir}
      className={`absolute top-1/2 -translate-y-1/2 ${dir === "prev" ? "left-2.5" : "right-2.5"} hidden sm:grid place-items-center w-8 h-8 rounded-full bg-white/95 shadow-card opacity-0 group-hover:opacity-100 transition hover:scale-110 active:scale-95`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <path d={dir === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function PhotoPlaceholder() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-rose-50 to-mist text-muted">
      <div className="text-center">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-brand/60">
          <rect x="3" y="6" width="18" height="14" rx="2" />
          <circle cx="12" cy="13" r="3.5" />
          <path d="M8 6l1.5-2h5L16 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-xs font-medium mt-1.5">Photos coming soon</p>
      </div>
    </div>
  );
}
