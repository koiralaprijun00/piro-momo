import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
    images: {
      // Google profile photos (signed-in users' avatars)
      remotePatterns: [{ protocol: 'https', hostname: 'lh3.googleusercontent.com' }],
    },
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);