import type { Metadata } from 'next';

/** Shared icon and social image config for all public pages. */
export const SITE_ICONS: NonNullable<Metadata['icons']> = {
  icon: [
    { url: '/favicon.ico', sizes: 'any' },
    { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
  ],
  apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  shortcut: ['/favicon.ico'],
};

export const OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'BraneIQ — AI-Powered Digital Intelligence Platform',
} as const;

export const LLM_DISCOVERY_LINKS = [
  { rel: 'llms', href: '/llms.txt', type: 'text/plain' },
  { rel: 'llms-full', href: '/llms-full.txt', type: 'text/plain' },
  { rel: 'alternate', href: '/ai.txt', type: 'text/plain', title: 'AI discovery (alias)' },
] as const;
