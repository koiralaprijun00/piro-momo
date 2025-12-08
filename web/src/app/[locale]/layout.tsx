import "../globals.css"; 
import NavBar from '@/components/NavBar';
import "mapbox-gl/dist/mapbox-gl.css";
import { NextIntlClientProvider } from 'next-intl';
import { SpeedInsights } from "@vercel/speed-insights/next"
import Script from "next/script"; // Import Script component

// RootLayout as an async server component with params as a Promise
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // Updated type for Next.js 15
}) {
  // Await params to resolve the locale
  const { locale } = await params;

  // Default to 'en' if locale is undefined or invalid
  const validLocales = ['en', 'np'];
  const resolvedLocale = validLocales.includes(locale) ? locale : 'en';

  // Dynamically import the messages for the current locale
  let messages;
  let firstOfNepalMessages;
  let LifeChecklistMessages;
  let kingsofnepalMessages;
  let nameDistrictMessages;
  
  try {
    // Load main messages
    messages = (await import(`../../../messages/${resolvedLocale}.json`)).default;
    
    // Try to load First of Nepal specific messages
    try {
      firstOfNepalMessages = (await import(`../../../messages/first-of-nepal-${resolvedLocale}.json`)).default;
      LifeChecklistMessages = (await import(`../../../messages/life-checklist-${resolvedLocale}.json`)).default;
      kingsofnepalMessages = (await import(`../../../messages/kings-of-nepal-${resolvedLocale}.json`)).default;
      nameDistrictMessages = (await import(`../../../messages/name-district-${resolvedLocale}.json`)).default;
      
      // Merge the messages - this will add the First of Nepal content to the main messages
      messages = {
        ...messages,
        ...firstOfNepalMessages,
        ...LifeChecklistMessages,
        ...kingsofnepalMessages,
        ...nameDistrictMessages
      };
    } catch (firstOfNepalError) {
      // If First of Nepal messages can't be loaded, continue with just the main messages
      console.log(`No separate First of Nepal messages found for "${resolvedLocale}", continuing with main messages only.`);
    }
  } catch (error) {
    // Fallback to English if the locale file is not found
    messages = (await import('../../../messages/en.json')).default;
    console.error(`Failed to load messages for locale "${resolvedLocale}", falling back to "en":`, error);
    
    // Try to load English First of Nepal messages as fallback
    try {
      const enFirstOfNepalMessages = (await import('../../../messages/first-of-nepal-en.json')).default;
      const enLifeChecklistMessages = (await import('../../../messages/life-checklist-en.json')).default;
      const enkingsofnepalMessages = (await import('../../../messages/kings-of-nepal-en.json')).default;
      const ennameDistrictMessages = (await import('../../../messages/name-district-en.json')).default;

      messages = {
        ...messages,
        ...enFirstOfNepalMessages,
        ...enLifeChecklistMessages,
        ...enkingsofnepalMessages,
        ...ennameDistrictMessages
      };
    } catch (firstOfNepalError) {
      console.log('No English First of Nepal messages found for fallback.');
    }
  }

  return (
    <NextIntlClientProvider locale={resolvedLocale} messages={messages}>
        {/* AdSense Script - Updated to use a more compatible approach */}
        <Script
          id="adsbygoogle-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: "ca-pub-4708248697764153",
                enable_page_level_ads: true
              });
            `
          }}
        />
        <Script
          id="adsbygoogle-js"
          strategy="afterInteractive"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          crossOrigin="anonymous"
        />
        <NavBar />
        {children}
        <SpeedInsights/>
    </NextIntlClientProvider>
  );
}