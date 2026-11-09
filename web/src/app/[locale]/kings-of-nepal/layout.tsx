import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

// Search title, description and canonical URL for /kings-of-nepal (copy lives in lib/seo.ts).
export const generateMetadata = pageMetadata('/kings-of-nepal');

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
