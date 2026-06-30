import Link from "next/link";

export function Brand({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-1.5 sm:gap-2 text-brand font-bold ${className}`}>
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-6 h-6 sm:w-7 sm:h-7 shrink-0">
        <path d="M12 2c3.5 0 6 2.6 6 6.2 0 4-3.4 8-5.3 10.9a.8.8 0 0 1-1.4 0C9.4 16.2 6 12.2 6 8.2 6 4.6 8.5 2 12 2Zm0 4.2a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8Z" />
      </svg>
      <span className="font-display font-extrabold text-[17px] sm:text-[20px] tracking-tight">findyourstay</span>
    </Link>
  );
}
