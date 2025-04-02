import "../globals.css"; 
import NavBar from "../components/NavBar";
import "mapbox-gl/dist/mapbox-gl.css";
import { NextIntlClientProvider } from 'next-intl';
import { AuthProvider } from './providers';
import { SpeedInsights } from "@vercel/speed-insights/next"

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
    <AuthProvider>
      <NextIntlClientProvider locale={resolvedLocale} messages={messages}>
        <NavBar />
        {children}
        <SpeedInsights/>
      </NextIntlClientProvider>
    </AuthProvider>
  );
}