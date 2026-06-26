"use client";

import dynamic from "next/dynamic";
export type { MapPoint } from "./ResultsMapInner";
import type { MapPoint } from "./ResultsMapInner";

// Load Leaflet only on the client. react-leaflet touches `window` at import
// time, so it must never be evaluated during SSR.
const Inner = dynamic(() => import("./ResultsMapInner"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-mist animate-pulse" />,
});

export function ResultsMap({ points }: { points: MapPoint[] }) {
  return <Inner points={points} />;
}
