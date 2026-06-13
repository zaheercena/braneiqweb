import { JsonLd } from '@/components/seo/JsonLd';
import { buildCanonicalUrl, getSiteUrl } from '@/lib/seo';

type Props = {
  locale: string;
  path: string;
  title: string;
};

export function BreadcrumbJsonLd({ locale, path, title }: Props) {
  const siteUrl = getSiteUrl();
  const homeUrl = buildCanonicalUrl(locale);
  const pageUrl = buildCanonicalUrl(locale, path);

  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: homeUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: title,
        item: pageUrl,
      },
    ],
  };

  return <JsonLd data={data} />;
}
