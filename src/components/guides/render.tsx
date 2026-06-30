import Link from "next/link";
import type { ReactNode } from "react";
import type { Block } from "@/lib/guides/types";

// --- tiny inline markdown: **bold**, _italic_, [label](href) ---
export function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|_(.+?)_|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1]) nodes.push(<strong key={i++} className="font-semibold text-ink">{m[1]}</strong>);
    else if (m[2]) nodes.push(<em key={i++}>{m[2]}</em>);
    else if (m[3]) {
      const href = m[4];
      const ext = /^https?:\/\//.test(href);
      nodes.push(
        <Link key={i++} href={href} className="text-brand font-medium underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
          {...(ext ? { target: "_blank", rel: "noopener" } : {})}>
          {m[3]}
        </Link>,
      );
    }
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

const slugifyHeading = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function InlineCTA({ title, body, label, href }: { title: string; body?: string; label: string; href: string }) {
  return (
    <div className="not-prose my-8 rounded-2xl bg-brand-gradient text-white p-6 sm:p-7 shadow-glow">
      <p className="font-display font-bold text-xl sm:text-2xl leading-tight">{title}</p>
      {body && <p className="mt-2 text-white/90 text-sm sm:text-base max-w-xl">{renderInline(body)}</p>}
      <Link href={href} className="inline-block mt-4 bg-white text-brand font-semibold px-6 py-3 rounded-full hover:bg-white/90 transition-transform active:scale-95">
        {label}
      </Link>
    </div>
  );
}

const CALLOUT = {
  win: "border-emerald-200 bg-emerald-50 text-emerald-950",
  info: "border-brand/20 bg-rose-50 text-ink",
  warn: "border-amber-200 bg-amber-50 text-amber-950",
};

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.t) {
          case "h2":
            return (
              <h2 key={i} id={b.id || slugifyHeading(b.text)} className="font-display font-bold text-2xl sm:text-3xl text-ink mt-12 mb-4 scroll-mt-24">
                {b.text}
              </h2>
            );
          case "h3":
            return <h3 key={i} className="font-display font-semibold text-xl text-ink mt-8 mb-3">{b.text}</h3>;
          case "p":
            return <p key={i} className="text-[17px] leading-relaxed text-ink/80 my-4">{renderInline(b.text)}</p>;
          case "ul":
            return (
              <ul key={i} className="my-4 space-y-2">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-3 text-[17px] leading-relaxed text-ink/80">
                    <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-brand shrink-0" />{renderInline(it)}
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="my-4 space-y-2 list-none counter-reset-[item]">
                {b.items.map((it, j) => (
                  <li key={j} className="flex gap-3 text-[17px] leading-relaxed text-ink/80">
                    <span className="grid place-items-center h-6 w-6 shrink-0 rounded-full bg-ink text-white text-xs font-bold">{j + 1}</span>{renderInline(it)}
                  </li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={i} className="not-prose my-7 overflow-x-auto rounded-2xl border border-line shadow-card">
                <table className="w-full text-sm">
                  <thead className="bg-ink text-white">
                    <tr>{b.head.map((h, j) => <th key={j} className="text-left font-semibold px-4 py-3 whitespace-nowrap">{renderInline(h)}</th>)}</tr>
                  </thead>
                  <tbody>
                    {b.rows.map((row, j) => (
                      <tr key={j} className={j % 2 ? "bg-mist" : "bg-white"}>
                        {row.map((c, k) => <td key={k} className="px-4 py-3 align-top text-ink/80 border-t border-line">{renderInline(c)}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {b.caption && <p className="text-xs text-muted px-4 py-2 bg-mist border-t border-line">{renderInline(b.caption)}</p>}
              </div>
            );
          case "callout":
            return (
              <div key={i} className={`not-prose my-7 rounded-2xl border p-5 ${CALLOUT[b.tone || "info"]}`}>
                {b.title && <p className="font-display font-bold mb-1">{b.title}</p>}
                <p className="leading-relaxed">{renderInline(b.text)}</p>
              </div>
            );
          case "stats":
            return (
              <div key={i} className="not-prose my-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {b.items.map((s, j) => (
                  <div key={j} className="rounded-2xl border border-line bg-mist p-5 text-center">
                    <p className="font-display font-extrabold text-3xl text-gradient-brand">{s.value}</p>
                    <p className="text-xs text-muted mt-1 leading-snug">{s.label}</p>
                  </div>
                ))}
              </div>
            );
          case "quote":
            return (
              <blockquote key={i} className="not-prose my-7 border-l-4 border-brand pl-5 py-1">
                <p className="font-serif text-xl text-ink/90 italic leading-relaxed">{renderInline(b.text)}</p>
                {b.cite && <cite className="block mt-2 text-sm text-muted not-italic">— {b.cite}</cite>}
              </blockquote>
            );
          case "cta":
            return <InlineCTA key={i} {...b} />;
          default:
            return null;
        }
      })}
    </>
  );
}
