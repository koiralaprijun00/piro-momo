import "./globals.css";
import { GoogleAnalytics } from "@next/third-parties/google";
import "mapbox-gl/dist/mapbox-gl.css"; // Keep this for build-time CSS inclusion
import { Metadata } from "next";
import { AuthProvider } from './[locale]/providers';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from 'next/script';

export const metadata: Metadata = {
  title: "Piromomo: The Fun Side of Nepal You Didn't Know You Needed!",
  description:
    "Discover quirky Nepali games—spend Binod Chaudhary's billions or test your festival knowledge at Piromomo.com!",
  metadataBase: new URL("https://piromomo.com"),
  openGraph: {
    title: "Piromomo: The Fun Side of Nepal You Didn't Know You Needed!",
    description:
      "Discover quirky Nepali games—spend Binod Chaudhary's billions or test your festival knowledge at Piromomo.com!",
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
      "Spend a billionaire's fortune or guess Nepali festivals—play now at Piromomo.com!",
    images: ["https://piromomo.com/momo.png"],
  },
  alternates: {
    canonical: "https://piromomo.com",
  },
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        
        {/* Performance optimizations: Preload LCP image */}
        <link
          rel="preload"
          href="/spend-money.png"
          as="image"
          type="image/png"
          fetchPriority="high"
        />
        
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.mapbox.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://googleads.g.doubleclick.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for third-party domains */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* AdSense script with lazyOnload strategy */}
        <Script
          id="adsbygoogle-init"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4708248697764153`}
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
        
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Mapbox CSS - Using standard loading without client-side event handlers */}
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v3.10.0/mapbox-gl.css"
          rel="stylesheet"
        />

        {/* Script to load Mapbox CSS after page loads */}
        <Script id="mapbox-css-defer" strategy="afterInteractive">
          {`
            // Defer non-critical CSS
            const mapboxLink = document.querySelector('link[href*="mapbox-gl.css"]');
            if (mapboxLink) {
              mapboxLink.setAttribute('media', 'print');
              window.addEventListener('load', () => {
                mapboxLink.setAttribute('media', 'all');
              });
            }
          `}
        </Script>
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
          <SpeedInsights />
          <Analytics />
        </AuthProvider>
        
        {/* Google Analytics with afterInteractive strategy */}
        <Script
          id="gtag-script"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-X744G6P5C9`}
        />
      </body>
    </html>
  );
}   