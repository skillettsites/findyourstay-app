"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Brand } from "./Brand";
import { SearchBar } from "./SearchBar";
import { supabaseBrowser } from "@/lib/supabase-browser";

export function Header({ showSearch = true }: { showSearch?: boolean }) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 12));

  // undefined = still loading; null = signed out; string = signed-in email.
  const [email, setEmail] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    const supabase = supabaseBrowser();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setEmail(session?.user?.email ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{
        boxShadow: scrolled ? "0 4px 24px -8px rgba(0,0,0,0.12)" : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.3 }}
      className={`sticky top-0 z-40 glass border-b transition-colors ${
        scrolled ? "border-line" : "border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-[60px] sm:h-[68px] flex items-center justify-between gap-4">
        <Brand />
        {showSearch && (
          <div className="hidden md:block">
            <SearchBar compact />
          </div>
        )}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link href="/guests" className="hidden lg:inline-block text-sm font-semibold px-3.5 py-2 rounded-full hover:bg-mist transition">
            For travellers
          </Link>
          <Link href="/host" className="hidden lg:inline-block text-sm font-semibold px-3.5 py-2 rounded-full hover:bg-mist transition">
            For hosts
          </Link>

          {/* Auth-aware buttons. Dashboard stays visible on mobile when signed in. */}
          {email !== undefined && (email ? (
            <>
              <Link href="/host/dashboard" className="text-sm font-semibold px-3 sm:px-4 py-2 rounded-full bg-ink text-white hover:bg-ink/90 transition">
                Dashboard
              </Link>
              <a href="/auth/signout" className="text-sm font-semibold px-2.5 sm:px-3 py-2 rounded-full hover:bg-mist transition">
                Logout
              </a>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold px-2.5 sm:px-3 py-2 rounded-full hover:bg-mist transition">
                Login
              </Link>
              <Link href="/host" className="text-sm font-semibold px-3 sm:px-4 py-2 rounded-full bg-brand-gradient bg-brand-gradient-hover text-white shadow-glow transition-transform active:scale-95">
                Sign up
              </Link>
            </>
          ))}

          <Menu />
        </nav>
      </div>
    </motion.header>
  );
}

const EXPLORE = [
  { href: "/s", label: "All stays" },
  { href: "/s?type=guest_house", label: "Guesthouses & B&Bs" },
  { href: "/s?type=apartment", label: "Apartments" },
  { href: "/s?type=villa", label: "Villas" },
  { href: "/s?type=chalet", label: "Cabins & chalets" },
];

function Menu() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    const supabase = supabaseBrowser();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Menu"
        aria-expanded={open}
        className="flex items-center gap-2 border border-line rounded-full pl-3 pr-1.5 py-1.5 bg-white hover:shadow-float transition-shadow"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
        </svg>
        <span className={`grid place-items-center w-7 h-7 rounded-full text-white text-xs font-semibold ${email ? "bg-brand-gradient" : "bg-ink"}`}>
          {email ? email[0].toUpperCase() : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-8 1.7-8 5v1h16v-1c0-3.3-4.7-5-8-5Z" /></svg>
          )}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 bg-white border border-line rounded-2xl shadow-float py-2 text-sm overflow-y-auto max-h-[calc(100vh-6rem)] z-50">
          {email && (
            <p className="px-4 pt-1.5 pb-2 text-xs text-muted truncate border-b border-line mb-1">
              Signed in as <span className="font-semibold text-ink">{email}</span>
            </p>
          )}
          <Item href="/guests" onClick={() => setOpen(false)} strong>For travellers</Item>
          <Item href="/host" onClick={() => setOpen(false)} strong>For hosts</Item>
          <Divider />
          <p className="px-4 pt-1.5 pb-1 text-[11px] font-bold uppercase tracking-wide text-muted">Explore stays</p>
          {EXPLORE.map((l) => (
            <Item key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Item>
          ))}
          <Divider />
          <Item href="/host#pricing" onClick={() => setOpen(false)}>Pricing</Item>
          <Item href="/guides" onClick={() => setOpen(false)}>Host guides</Item>
          <Item href="/host/new" onClick={() => setOpen(false)}>List your stay</Item>
        </div>
      )}
    </div>
  );
}

function Item({ href, children, onClick, strong = false }: { href: string; children: React.ReactNode; onClick: () => void; strong?: boolean }) {
  return (
    <Link href={href} onClick={onClick} className={`block px-4 py-2.5 hover:bg-mist transition ${strong ? "font-semibold text-brand" : "text-ink"}`}>
      {children}
    </Link>
  );
}

function Divider() {
  return <div className="my-1.5 h-px bg-line" />;
}
