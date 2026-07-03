"use client";

import Script from "next/script";

// Same GA4 property the previous findyourstay.com site used, so history carries
// over. The measurement ID is public (it ships in every page), so a hard-coded
// fallback is fine; NEXT_PUBLIC_GA_ID can override it.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-S98VPKL2RP";

export function GoogleAnalytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
