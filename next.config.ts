import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
    images: {
      domains: ['lh3.googleusercontent.com'],
      },
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);