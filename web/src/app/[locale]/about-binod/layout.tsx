import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

// Search title, description and canonical URL for /about-binod (copy lives in lib/seo.ts).
export const generateMetadata = pageMetadata('/about-binod');

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
