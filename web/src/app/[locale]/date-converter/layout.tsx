import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

// Search title, description and canonical URL for /date-converter (copy lives in lib/seo.ts).
export const generateMetadata = pageMetadata('/date-converter');

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
