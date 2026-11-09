import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

// Search title, description and canonical URL for /first-of-nepal (copy lives in lib/seo.ts).
export const generateMetadata = pageMetadata('/first-of-nepal');

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
