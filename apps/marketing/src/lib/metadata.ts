import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildAlternateLanguages, buildCanonicalUrl, getOgLocale, getSiteUrl } from './seo';
import { OG_IMAGE, SITE_ICONS } from './site-seo';

type PageMetaOptions = {
  locale: string;
  path?: string;
  titleKey: string;
  descriptionKey: string;
};

export async function buildPageMetadata({
  locale,
  path = '',
  titleKey,
  descriptionKey,
}: PageMetaOptions): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const canonical = buildCanonicalUrl(locale, path);
  const title = t(titleKey);
  const description = t(descriptionKey);
  const siteName = t('siteName');
  const siteUrl = getSiteUrl();
  const ogImage = { ...OG_IMAGE, alt: `${title} | ${siteName}` };

  return {
    title,
    description,
    keywords: t('keywords'),
    applicationName: siteName,
    metadataBase: new URL(siteUrl),
    authors: [{ name: 'Cozmot Inc', url: siteUrl }],
    creator: 'BraneIQ',
    publisher: 'Cozmot Inc',
    alternates: {
      canonical,
      languages: buildAlternateLanguages(path),
    },
    icons: SITE_ICONS,
    openGraph: {
      type: 'website',
      locale: getOgLocale(locale),
      url: canonical,
      siteName,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    category: 'technology',
    other: {
      'ai-content-declaration': 'human-authored',
      'link:llms': `${siteUrl}/llms.txt`,
      'link:llms-full': `${siteUrl}/llms-full.txt`,
    },
  };
}

export async function buildRootMetadata(locale: string): Promise<Metadata> {
  const base = await buildPageMetadata({
    locale,
    titleKey: 'defaultTitle',
    descriptionKey: 'defaultDescription',
  });
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    ...base,
    title: {
      default: t('defaultTitle'),
      template: `%s | ${t('siteName')}`,
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}
