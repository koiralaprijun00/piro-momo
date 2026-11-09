import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

// Search title, description and canonical URL for /guess-the-word (copy lives in lib/seo.ts).
export const generateMetadata = pageMetadata('/guess-the-word');

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
