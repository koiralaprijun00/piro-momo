import type { ReactNode } from 'react';
import { pageMetadata } from '@/lib/seo';

// Search title, description and canonical URL for /gau-khane-katha (copy lives in lib/seo.ts).
export const generateMetadata = pageMetadata('/gau-khane-katha');

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
