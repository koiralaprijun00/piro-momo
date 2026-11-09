import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

// Search title, description and canonical URL for /mandir-chineu (copy lives in lib/seo.ts).
export const generateMetadata = pageMetadata('/mandir-chineu');

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
