import { getTranslations } from 'next-intl/server';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildCanonicalUrl, getAppUrl, getSiteUrl } from '@/lib/seo';

const FAQ_KEYS = ['what', 'sources', 'teams', 'crisis', 'moderation', 'pricing', 'demo'] as const;

type Props = {
  locale: string;
};

export async function HomeJsonLd({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  const faq = await getTranslations({ locale, namespace: 'home.faq.items' });
  const siteUrl = getSiteUrl();
  const pageUrl = buildCanonicalUrl(locale);

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'BraneIQ',
    url: siteUrl,
    logo: `${siteUrl}/icon`,
    description: t('defaultDescription'),
    email: 'support@braneiq.com',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'support@braneiq.com',
      availableLanguage: ['English', 'German', 'French', 'Japanese', 'Chinese'],
    },
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: t('siteName'),
    url: siteUrl,
    description: t('defaultDescription'),
    publisher: { '@id': `${siteUrl}/#organization` },
    inLanguage: locale,
  };

  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}/#webpage`,
    url: pageUrl,
    name: t('home.title'),
    description: t('home.description'),
    isPartOf: { '@id': `${siteUrl}/#website` },
    about: { '@id': `${siteUrl}/#organization` },
    inLanguage: locale,
  };

  const software = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'BraneIQ',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: getAppUrl(),
    description: t('defaultDescription'),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Contact for pricing',
    },
  };

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_KEYS.map((key) => ({
      '@type': 'Question',
      name: faq(`${key}.q`),
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq(`${key}.a`),
      },
    })),
  };

  return <JsonLd data={[organization, website, webPage, software, faqPage]} />;
}
