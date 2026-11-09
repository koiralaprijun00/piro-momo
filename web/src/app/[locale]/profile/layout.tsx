import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { PRIVATE_PAGE_METADATA } from '@/lib/seo';

// Account pages are kept out of search results.
export const metadata: Metadata = {
  ...PRIVATE_PAGE_METADATA,
  title: 'Your Profile',
  alternates: {},
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
