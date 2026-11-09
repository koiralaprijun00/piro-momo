import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

// Search title, description and canonical URL for /spend (copy lives in lib/seo.ts).
export const generateMetadata = pageMetadata('/spend');

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
