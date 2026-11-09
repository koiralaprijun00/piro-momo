import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

// Search title, description and canonical URL for /guess-festival (copy lives in lib/seo.ts).
export const generateMetadata = pageMetadata('/guess-festival');

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
