import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';
import PageSeo from '@/components/PageSeo';

// Public page Google Play links to: how to delete a Piromomo account (copy in lib/seo.ts).
export const generateMetadata = pageMetadata('/delete-account');

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
      <PageSeo path="/delete-account" locale={locale} isGame={false} />
    </>
  );
}
