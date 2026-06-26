"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { CATEGORIES } from "@/lib/format";

export function CategoryRow() {
  const params = useSearchParams();
  const pathname = usePathname();
  const active = params.get("type") ?? "";
  const base = pathname === "/s" ? params.toString() : "";

  return (
    <div className="sticky top-[60px] sm:top-[68px] z-20 glass border-b border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex gap-8 overflow-x-auto no-scrollbar py-3">
          {CATEGORIES.map((c) => {
            const p = new URLSearchParams(base);
            if (c.key) p.set("type", c.key);
            else p.delete("type");
            const isActive = active === c.key;
            return (
              <Link
                key={c.key || "all"}
                href={`/s?${p.toString()}`}
                className={`group relative flex flex-col items-center gap-1.5 min-w-fit pb-2.5 pt-1 transition-colors ${
                  isActive ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                <span className={`text-2xl leading-none transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                  {c.icon}
                </span>
                <span className="text-xs font-semibold whitespace-nowrap">{c.label}</span>
                {isActive && (
                  <motion.span
                    layoutId="cat-underline"
                    className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-ink rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
