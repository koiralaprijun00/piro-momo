import "./globals.css";
import { Metadata } from "next";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from 'next/script';
import { getLocale } from 'next-intl/server';
import { HTML_LANG, type SiteLocale } from '@/lib/site';

const GA_MEASUREMENT_ID = 'G-X744G6P5C9';

export const metadata: Metadata = {
  // Fallback only: every page sets its own title in lib/seo.ts.
  title: {
    default: "Piromomo: The Fun Side of Nepal You Didn't Know You Needed!",
    template: "%s | Piromomo",
  },
  description:
    "Interactive Nepali games like guess the king, gau khane katha, and other quizzes for connecting with Nepali culture and friends abroad.",
  metadataBase: new URL("https://piromomo.com"),
  openGraph: {
    title: "Piromomo: The Fun Side of Nepal You Didn't Know You Needed!",
    description:
      "Interactive Nepali games like guess the king, gau khane katha, and other quizzes for connecting with Nepali culture and friends abroad.",
    url: "https://piromomo.com",
    siteName: "Piromomo",
    images: [
      {
        url: "https://piromomo.com/momo.png",
        width: 800,
        height: 600,
        alt: "Piromomo - Fun Nepali Games Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Piromomo: The Fun Side of Nepal You Didn't Know You Needed!",
    description:
      "Interactive Nepali games like guess the king, gau khane katha, and other quizzes for connecting with Nepali culture and friends abroad.",
    images: ["https://piromomo.com/momo.png"],
  },
  // No site-wide canonical: a single canonical here marked every page as a copy of the
  // home page. Language versions are listed in /sitemap.xml instead.
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 'np' pages are Nepali, whose language code is 'ne'.
  const locale = (await getLocale()) as SiteLocale;
  const lang = HTML_LANG[locale] ?? 'en';

  return (
    <html lang={lang} translate="no" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="google" content="notranslate" />
        <link
          rel="preload"
          href="/spend-money.png"
          as="image"
          type="image/png"
          fetchPriority="high"
        />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <Script
          id="adsbygoogle-init"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4708248697764153`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        {children}
        <SpeedInsights />
        <Analytics />
        <Script
          id="gtag-script"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        {/* Starts Google Analytics. Without this, gtag.js loads but records nothing. */}
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
        </Script>
      </body>
    </html>
  );
} 