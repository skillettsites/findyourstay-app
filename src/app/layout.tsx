import type { Metadata } from "next";
import { Geist, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "FindYourStay - Book direct, no fees", template: "%s | FindYourStay" },
  description:
    "Browse independent guesthouses, B&Bs and apartments worldwide and book direct with the owner. No platform fees.",
  openGraph: { siteName: "FindYourStay", type: "website" },
};

const orgLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "FindYourStay",
  url: SITE,
  potentialAction: { "@type": "SearchAction", target: `${SITE}/s?q={query}`, "query-input": "required name=query" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${display.variable} h-full antialiased`}>
      <head>
        <link rel="preconnect" href="https://u6tymn7wo0dz2c1b.public.blob.vercel-storage.com" />
        <link rel="dns-prefetch" href="https://picsum.photos" />
        <link rel="dns-prefetch" href="https://a.tile.openstreetmap.org" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-ink">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
        {children}
      </body>
    </html>
  );
}
