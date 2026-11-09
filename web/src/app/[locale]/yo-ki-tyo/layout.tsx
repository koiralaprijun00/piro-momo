import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

// Search title, description and canonical URL for /yo-ki-tyo (copy lives in lib/seo.ts).
export const generateMetadata = pageMetadata('/yo-ki-tyo');

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
