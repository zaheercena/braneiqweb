import type { NextRequest } from 'next/server';
import { routing, type Locale } from '@/i18n/routing';

const OG_LOCALE: Record<Locale, string> = {
  en: 'en_US',
  de: 'de_DE',
  fr: 'fr_FR',
  ja: 'ja_JP',
  zh: 'zh_CN',
};

/** Production defaults when env vars are missing (e.g. during Docker build). */
const PRODUCTION_SITE_URL = 'https://braneiq.com';
const PRODUCTION_APP_URL = 'https://app.braneiq.com';
const DEV_SITE_URL = 'http://localhost:3001';
const DEV_APP_URL = 'http://localhost:3000';

export const CANONICAL_HOST = 'braneiq.com';

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, '');
}

/** Always use apex braneiq.com in production (no www). */
export function toCanonicalSiteUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.protocol = 'https:';
    parsed.hostname = CANONICAL_HOST;
    parsed.port = '';
    return stripTrailingSlash(parsed.toString());
  } catch {
    return PRODUCTION_SITE_URL;
  }
}

function isLocalhost(url: string): boolean {
  return url.includes('localhost') || url.includes('127.0.0.1');
}

function productionFallback(site: 'marketing' | 'app'): string {
  if (process.env.NODE_ENV === 'production') {
    return site === 'marketing' ? PRODUCTION_SITE_URL : PRODUCTION_APP_URL;
  }
  return site === 'marketing' ? DEV_SITE_URL : DEV_APP_URL;
}

export function getSiteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env && !isLocalhost(env)) {
    return toCanonicalSiteUrl(env);
  }
  if (env && process.env.NODE_ENV !== 'production') {
    return stripTrailingSlash(env);
  }
  return productionFallback('marketing');
}

export function getAppUrl(): string {
  const env = process.env.NEXT_PUBLIC_APP_URL;
  if (env && !isLocalhost(env)) {
    return stripTrailingSlash(env);
  }
  if (env && process.env.NODE_ENV !== 'production') {
    return stripTrailingSlash(env);
  }
  return productionFallback('app');
}

/** Prefer the incoming request host so /llms.txt always lists the correct domain. */
export function resolveSiteUrl(request?: NextRequest): string {
  if (request) {
    const rawHost = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
    const host = rawHost?.split(',')[0].split(':')[0].trim();
    if (host && !host.includes('localhost') && !host.includes('127.0.0.1')) {
      const proto = request.headers.get('x-forwarded-proto') ?? 'https';
      return toCanonicalSiteUrl(`${proto}://${host}`);
    }
  }
  return getSiteUrl();
}

export function resolveAppUrl(_request?: NextRequest): string {
  return getAppUrl();
}

export function buildCanonicalUrl(locale: string, path = ''): string {
  const normalized = path.startsWith('/') ? path : path ? `/${path}` : '';
  return `${getSiteUrl()}/${locale}${normalized}`;
}

export function buildAlternateLanguages(path = ''): Record<string, string> {
  const normalized = path.startsWith('/') ? path : path ? `/${path}` : '';
  const siteUrl = getSiteUrl();
  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    languages[locale] = `${siteUrl}/${locale}${normalized}`;
  }
  languages['x-default'] = `${siteUrl}/en${normalized}`;

  return languages;
}

export function getOgLocale(locale: string): string {
  return OG_LOCALE[locale as Locale] ?? 'en_US';
}

export const PUBLIC_PATHS = [
  '',
  '/platform',
  '/request-demo',
  '/privacy-policy',
  '/terms-of-service',
] as const;
