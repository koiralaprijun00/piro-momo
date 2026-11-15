import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';

// Create the internationalization middleware
const intlMiddleware = createMiddleware({
  locales: ['en', 'np'],
  defaultLocale: 'en',
  localePrefix: 'always',
  // Don't send next-intl's own hreflang `Link` header: it used the www host, the invalid
  // code 'np' and an x-default that redirects. Each page's <head> has the correct links.
  alternateLinks: false,
});

/** The one public domain. www and any other host get a permanent redirect here. */
const CANONICAL_HOST = 'piromomo.com';

export default function middleware(request: NextRequest) {
  // www.piromomo.com → piromomo.com (permanent), so Google sees one site, not two.
  const host = request.headers.get('host') ?? '';
  if (host === `www.${CANONICAL_HOST}`) {
    const url = request.nextUrl.clone();
    url.host = CANONICAL_HOST;
    url.port = '';
    url.protocol = 'https';
    return NextResponse.redirect(url, 308);
  }

  const response = intlMiddleware(request);

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self), interest-cohort=()');

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};