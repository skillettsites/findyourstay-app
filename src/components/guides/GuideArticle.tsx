import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Motion";
import { Blocks, renderInline } from "./render";
import { StickyAddStay } from "./StickyAddStay";
import type { Guide } from "@/lib/guides/types";
import { GUIDES_BY_SLUG } from "@/lib/guides/registry";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export function GuideArticle({ guide }: { guide: Guide }) {
  const url = `${SITE}/guides/${guide.slug}`;
  const related = (guide.related || []).map((s) => GUIDES_BY_SLUG[s]).filter(Boolean).slice(0, 3);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.h1,
    description: guide.description,
    datePublished: guide.date,
    dateModified: guide.updated || guide.date,
    author: { "@type": "Organization", name: "FindYourStay" },
    publisher: { "@type": "Organization", name: "FindYourStay", url: SITE },
    mainEntityOfPage: url,
    keywords: guide.keywords.join(", "),
    articleSection: guide.category,
    // Mark the answer-first + takeaways as the extractable answer for voice/AI.
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["#answer-first", "#key-takeaways"] },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Guides", item: `${SITE}/guides` },
      { "@type": "ListItem", position: 3, name: guide.h1, item: url },
    ],
  };
  const faqLd = guide.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: guide.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <>
      <Header />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}

      <main className="flex-1">
        <article className="mx-auto max-w-3xl px-4 sm:px-6 pt-8 pb-20">
          {/* Breadcrumb */}
          <nav className="text-xs text-muted mb-6 flex flex-wrap items-center gap-1.5">
            <Link href="/" className="hover:text-ink">Home</Link><span>/</span>
            <Link href="/guides" className="hover:text-ink">Guides</Link><span>/</span>
            <span className="text-ink/70">{guide.category}</span>
          </nav>

          {/* Header */}
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">{guide.category}</p>
            <h1 className="mt-3 font-display font-extrabold text-3xl sm:text-4xl xl:text-5xl tracking-tight leading-[1.08] text-ink">{guide.h1}</h1>
            <p className="mt-4 text-lg text-muted leading-relaxed">{guide.dek}</p>
            <p className="mt-4 text-xs text-muted">
              Updated {fmtDate(guide.updated || guide.date)} · {guide.readMins} min read
            </p>
          </Reveal>

          {/* Answer-first TL;DR — the block LLMs & snippets lift verbatim */}
          {guide.answerFirst ? (
            <div id="answer-first" className="not-prose mt-8 rounded-2xl border-l-4 border-brand bg-rose-50/70 p-5 sm:p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand mb-2">Short answer</p>
              <p className="text-[17px] leading-relaxed text-ink/90">{renderInline(guide.answerFirst)}</p>
            </div>
          ) : null}

          {/* Key takeaways — snippet + LLM friendly */}
          {guide.takeaways?.length ? (
            <div id="key-takeaways" className="not-prose mt-6 rounded-2xl border border-line bg-mist p-5 sm:p-6">
              <p className="font-display font-bold text-ink mb-3">Key takeaways</p>
              <ul className="space-y-2">
                {guide.takeaways.map((t, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink/80">
                    <span className="text-brand mt-0.5">✓</span>{renderInline(t)}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Body */}
          <div className="mt-8">
            <Blocks blocks={guide.blocks} />
          </div>

          {/* FAQ */}
          {guide.faqs?.length ? (
            <section className="mt-14">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-ink mb-5">Frequently asked questions</h2>
              <div className="divide-y divide-line border-y border-line">
                {guide.faqs.map((f, i) => (
                  <details key={i} className="group py-4">
                    <summary className="flex justify-between items-center cursor-pointer list-none font-semibold text-ink">
                      {f.q}<span className="text-brand transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                    </summary>
                    <p className="mt-3 text-ink/75 leading-relaxed">{renderInline(f.a)}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          {/* Closing CTA */}
          <div className="not-prose mt-14 rounded-3xl bg-ink text-white p-8 sm:p-10 text-center">
            <h2 className="font-display font-bold text-2xl sm:text-3xl">Stop paying commission on every booking</h2>
            <p className="mt-3 text-white/70 max-w-lg mx-auto">See exactly what your own direct-booking website would look like — free, no signup. Built and hosted for you, on your own domain.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/host/build" className="bg-brand-gradient bg-brand-gradient-hover font-semibold px-7 py-3.5 rounded-full shadow-glow transition-transform active:scale-95">See your free site →</Link>
              <Link href="/host" className="border border-white/30 font-semibold px-7 py-3.5 rounded-full hover:bg-white/10 transition">How it works</Link>
            </div>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <section className="mt-14">
              <h2 className="font-display font-bold text-xl text-ink mb-4">Keep reading</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link key={r.slug} href={`/guides/${r.slug}`} className="group rounded-2xl border border-line p-5 hover:shadow-card hover:border-ink/20 transition">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-brand">{r.category}</p>
                    <p className="mt-2 font-display font-semibold text-ink leading-snug group-hover:text-brand transition">{r.h1}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>

      <StickyAddStay />
      <Footer />
    </>
  );
}
