import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = getSiteUrl();

  return {
    name: 'BraneIQ — Social Listening & Brand Intelligence',
    short_name: 'BraneIQ',
    description:
      'Monitor brand mentions, analyze sentiment, and protect your reputation across social channels with BraneIQ.',
    start_url: `${siteUrl}/en`,
    scope: siteUrl,
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#4f46e5',
    lang: 'en',
    categories: ['business', 'productivity', 'marketing'],
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
