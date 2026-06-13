import { CANONICAL_HOST, getAppUrl } from '@/lib/seo';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

/** Canonical production host (no www). */
export { CANONICAL_HOST } from '@/lib/seo';

function normalizeHost(host: string | null): string {
  return (host ?? '').split(',')[0].split(':')[0].trim().toLowerCase();
}

function hasLocalePrefix(pathname: string): boolean {
  return routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
}

/** Dashboard auth routes that must never be served on the marketing site. */
function isAppAuthPath(pathname: string): boolean {
  if (pathname === '/login' || pathname === '/register') {
    return true;
  }
  return routing.locales.some(
    (locale) =>
      pathname === `/${locale}/login` ||
      pathname === `/${locale}/register` ||
      pathname.startsWith(`/${locale}/login/`) ||
      pathname.startsWith(`/${locale}/register/`),
  );
}

/** /privacy-policy → /en/privacy-policy */
function withDefaultLocale(pathname: string): string {
  if (pathname === '/') {
    return '/en';
  }
  if (hasLocalePrefix(pathname)) {
    return pathname;
  }
  return `/en${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}

function canonicalRedirect(_request: NextRequest, pathname: string): NextResponse {
  const url = new URL(pathname, `https://${CANONICAL_HOST}`);
  return NextResponse.redirect(url, 301);
}

function marketingHomeRedirect(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = '/en';
  url.search = '';
  return NextResponse.redirect(url, 301);
}

function appAuthRedirect(pathname: string): NextResponse {
  const appBase = getAppUrl();
  const suffix = pathname.includes('register') ? '/register' : '/login';
  return NextResponse.redirect(`${appBase}${suffix}`, 302);
}

export default function middleware(request: NextRequest) {
  const host = normalizeHost(request.headers.get('host'));
  const { pathname } = request.nextUrl;

  // Never run locale logic on API routes (health check, etc.)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Marketing site must not show dashboard login/register pages
  if (isAppAuthPath(pathname)) {
    const appBase = getAppUrl();
    const marketingBase = `https://${CANONICAL_HOST}`;
    // If app URL is missing or points at marketing, show homepage instead of a login form
    if (!appBase || appBase === marketingBase || appBase.startsWith(marketingBase)) {
      return marketingHomeRedirect(request);
    }
    return appAuthRedirect(pathname);
  }

  // www.braneiq.com → https://braneiq.com/... (canonical apex)
  if (host === `www.${CANONICAL_HOST}`) {
    return canonicalRedirect(request, withDefaultLocale(pathname));
  }

  // Locale-less paths → /en/... on canonical host
  if (pathname !== '/' && !hasLocalePrefix(pathname)) {
    return canonicalRedirect(request, withDefaultLocale(pathname));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
