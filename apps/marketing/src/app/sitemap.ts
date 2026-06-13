import type { MetadataRoute } from 'next';
import { buildAlternateLanguages, getSiteUrl, PUBLIC_PATHS } from '@/lib/seo';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  return routing.locales.flatMap((locale) =>
    PUBLIC_PATHS.map((path) => {
      const url = `${siteUrl}/${locale}${path}`;
      return {
        url,
        lastModified: now,
        changeFrequency:
          path === '' ? 'weekly' : path === '/privacy-policy' || path === '/terms-of-service' ? 'monthly' : 'weekly',
        priority: path === '' ? 1 : path === '/request-demo' ? 0.9 : 0.8,
        alternates: {
          languages: buildAlternateLanguages(path),
        },
      };
    }),
  );
}
