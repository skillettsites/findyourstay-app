"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

export interface MapPoint {
  id: string;
  slug: string;
  name: string;
  lat: number;
  lng: number;
  price: number | null;
  currency: string;
}

export default function ResultsMapInner({ points, approxArea = false }: { points: MapPoint[]; approxArea?: boolean }) {
  if (points.length === 0) {
    return <div className="w-full h-full grid place-items-center text-muted text-sm">No stays to map</div>;
  }

  const center: [number, number] = [points[0].lat, points[0].lng];

  // Single-listing view: show a general-area circle instead of an exact pin.
  if (approxArea && points.length === 1) {
    const p = points[0];
    return (
      <MapContainer center={[p.lat, p.lng]} zoom={14} scrollWheelZoom className="w-full h-full">
        <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Circle center={[p.lat, p.lng]} radius={450} pathOptions={{ color: "#e8385a", fillColor: "#e8385a", fillOpacity: 0.12, weight: 1.5 }} />
      </MapContainer>
    );
  }

  return (
    <MapContainer center={center} zoom={12} scrollWheelZoom className="w-full h-full">
      <TileLayer attribution="&copy; OpenStreetMap" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FitBounds points={points} />
      {points.map((p) => (
        <Marker key={p.id} position={[p.lat, p.lng]} icon={priceIcon(p.price, p.currency)}>
          <Popup>
            <Link href={`/rooms/${p.slug}`} className="font-semibold text-brand">
              {p.name}
            </Link>
            <div className="text-xs text-muted">{formatPrice(p.price, p.currency)} / night</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

function FitBounds({ points }: { points: MapPoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [points, map]);
  return null;
}

function priceIcon(price: number | null, currency: string) {
  const label = price == null ? "View" : formatPrice(price, currency);
  return L.divIcon({
    className: "",
    html: `<div class="fys-price-pin">${label}</div>`,
    iconSize: [1, 1],
    iconAnchor: [0, 0],
  });
}
