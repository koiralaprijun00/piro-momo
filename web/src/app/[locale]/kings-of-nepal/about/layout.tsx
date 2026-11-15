import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';
import PageSeo from '@/components/PageSeo';

// Search title, description and canonical URL for /kings-of-nepal/about (copy lives in lib/seo.ts).
export const generateMetadata = pageMetadata('/kings-of-nepal/about');

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return (
    <>
      {children}
      {/* Structured data + "About this page" text, rendered on the server (lib/seoContent.ts). */}
      <PageSeo path="/kings-of-nepal/about" locale={locale} isGame={false} />
    </>
  );
}
