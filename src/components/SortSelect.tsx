"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function SortSelect() {
  const router = useRouter();
  const params = useSearchParams();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const p = new URLSearchParams(params.toString());
    if (e.target.value === "featured") p.delete("sort");
    else p.set("sort", e.target.value);
    router.push(`/s?${p.toString()}`);
  }

  return (
    <select
      defaultValue={params.get("sort") ?? "featured"}
      onChange={onChange}
      className="border border-line rounded-full text-sm px-4 py-2 font-medium hover:shadow-sm outline-none cursor-pointer"
    >
      <option value="featured">Featured</option>
      <option value="price_asc">Price: low to high</option>
      <option value="price_desc">Price: high to low</option>
      <option value="rating">Top rated</option>
    </select>
  );
}
