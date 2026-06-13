import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { RequestDemoForm } from '@/components/RequestDemoForm';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { buildPageMetadata } from '@/lib/metadata';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return buildPageMetadata({
    locale: params.locale,
    path: '/request-demo',
    titleKey: 'demo.title',
    descriptionKey: 'demo.description',
  });
}

export default async function RequestDemoPage({ params }: Props) {
  setRequestLocale(params.locale);
  const meta = await getTranslations({ locale: params.locale, namespace: 'metadata' });

  return (
    <>
      <BreadcrumbJsonLd locale={params.locale} path="/request-demo" title={meta('demo.title')} />
      <RequestDemoForm />
    </>
  );
}
