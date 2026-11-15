import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';
import PageSeo from '@/components/PageSeo';

// Search title, description and canonical URL for /general-knowledge (copy lives in lib/seo.ts).
export const generateMetadata = pageMetadata('/general-knowledge');

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
      <PageSeo path="/general-knowledge" locale={locale} />
    </>
  );
}
