"use client";

import { useState } from "react";

const DOW = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function iso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function todayISO() {
  const t = new Date();
  return iso(t.getFullYear(), t.getMonth(), t.getDate());
}
export function formatNice(isoStr?: string) {
  if (!isoStr) return null;
  const [y, m, d] = isoStr.split("-").map(Number);
  return `${d} ${MONTHS[m - 1].slice(0, 3)}`;
}

export function MonthCalendar({
  checkIn,
  checkOut,
  onChange,
  months = 2,
}: {
  checkIn?: string;
  checkOut?: string;
  onChange: (ci?: string, co?: string) => void;
  months?: number;
}) {
  const now = new Date();
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const min = todayISO();

  function pick(day: string) {
    if (!checkIn || (checkIn && checkOut)) {
      onChange(day, undefined);
    } else if (day > checkIn) {
      onChange(checkIn, day);
    } else {
      onChange(day, undefined);
    }
  }

  function shift(delta: number) {
    setCursor((c) => {
      const d = new Date(c.y, c.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  }

  const grids = Array.from({ length: months }, (_, i) => {
    const d = new Date(cursor.y, cursor.m + i, 1);
    return { y: d.getFullYear(), m: d.getMonth() };
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <button type="button" onClick={() => shift(-1)} className="w-9 h-9 grid place-items-center rounded-full hover:bg-mist" aria-label="Previous month">
          <Chevron dir="left" />
        </button>
        <button type="button" onClick={() => shift(1)} className="w-9 h-9 grid place-items-center rounded-full hover:bg-mist" aria-label="Next month">
          <Chevron dir="right" />
        </button>
      </div>
      <div className={`grid ${months > 1 ? "sm:grid-cols-2" : "grid-cols-1"} gap-8`}>
        {grids.map((g) => (
          <Grid key={`${g.y}-${g.m}`} y={g.y} m={g.m} min={min} checkIn={checkIn} checkOut={checkOut} onPick={pick} />
        ))}
      </div>
    </div>
  );
}

function Grid({ y, m, min, checkIn, checkOut, onPick }: { y: number; m: number; min: string; checkIn?: string; checkOut?: string; onPick: (d: string) => void }) {
  const first = new Date(y, m, 1);
  const startDow = (first.getDay() + 6) % 7; // Mon=0
  const days = new Date(y, m + 1, 0).getDate();

  return (
    <div>
      <div className="text-center font-semibold mb-3">{MONTHS[m]} {y}</div>
      <div className="grid grid-cols-7 gap-y-1 text-center text-[11px] text-muted mb-1">
        {DOW.map((d) => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: startDow }).map((_, i) => <div key={`b${i}`} />)}
        {Array.from({ length: days }, (_, i) => {
          const d = iso(y, m, i + 1);
          const disabled = d < min;
          const isStart = d === checkIn;
          const isEnd = d === checkOut;
          const inRange = checkIn && checkOut && d > checkIn && d < checkOut;
          return (
            <div key={d} className="flex justify-center">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onPick(d)}
                className={`w-9 h-9 rounded-full text-sm transition relative
                  ${disabled ? "text-line line-through cursor-not-allowed" : "hover:border hover:border-ink"}
                  ${isStart || isEnd ? "bg-ink text-white font-semibold" : ""}
                  ${inRange ? "bg-mist" : ""}`}
              >
                {i + 1}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
