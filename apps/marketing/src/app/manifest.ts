import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = getSiteUrl();

  return {
    name: 'BraneIQ — Social Listening',
    short_name: 'BraneIQ',
    description: 'Social listening and brand intelligence for comms and marketing teams.',
    start_url: `${siteUrl}/en`,
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#4f46e5',
    lang: 'en',
    categories: ['business', 'productivity'],
  };
}
