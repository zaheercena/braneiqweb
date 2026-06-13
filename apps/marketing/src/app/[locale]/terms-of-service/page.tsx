import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { buildPageMetadata } from '@/lib/metadata';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return buildPageMetadata({
    locale: params.locale,
    path: '/terms-of-service',
    titleKey: 'terms.title',
    descriptionKey: 'terms.description',
  });
}

export default async function TermsOfServicePage({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations('terms');
  const meta = await getTranslations({ locale: params.locale, namespace: 'metadata' });

  const sections = [
    'acceptance',
    'service',
    'accounts',
    'acceptableUse',
    'subscription',
    'intellectualProperty',
    'data',
    'disclaimers',
    'liability',
    'termination',
    'governingLaw',
    'contact',
  ] as const;

  return (
    <div className="py-20">
      <BreadcrumbJsonLd
        locale={params.locale}
        path="/terms-of-service"
        title={meta('terms.title')}
      />
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('title')}</h1>
        <p className="mt-4 text-sm text-slate-500">{t('updated')}</p>
        <p className="mt-8 leading-relaxed text-slate-600">{t('intro')}</p>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section}>
              <h2 className="text-xl font-semibold text-slate-900">{t(`sections.${section}.title`)}</h2>
              <p className="mt-3 leading-relaxed text-slate-600">{t(`sections.${section}.body`)}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
