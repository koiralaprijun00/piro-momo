import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

// Search title, description and canonical URL for /name-districts (copy lives in lib/seo.ts).
export const generateMetadata = pageMetadata('/name-districts');

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
