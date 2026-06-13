import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildAlternateLanguages, buildCanonicalUrl, getOgLocale, getSiteUrl } from './seo';

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

  return {
    title,
    description,
    keywords: t('keywords'),
    applicationName: siteName,
    metadataBase: new URL(getSiteUrl()),
    alternates: {
      canonical,
      languages: buildAlternateLanguages(path),
    },
    openGraph: {
      type: 'website',
      locale: getOgLocale(locale),
      url: canonical,
      siteName,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
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
    },
  };
}

export async function buildRootMetadata(locale: string): Promise<Metadata> {
  return buildPageMetadata({
    locale,
    titleKey: 'defaultTitle',
    descriptionKey: 'defaultDescription',
  });
}
