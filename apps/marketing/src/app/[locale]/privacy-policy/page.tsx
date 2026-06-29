import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { buildPageMetadata } from '@/lib/metadata';
import { getSiteUrl } from '@/lib/seo';
import { PRODUCT_URLS } from '@/lib/products';

type Props = {
  params: { locale: string };
};

const SECTIONS = [
  'operator',
  'scope',
  'collection',
  'googleUserData',
  'googleLimitedUse',
  'metaUserData',
  'analytics',
  'use',
  'sharing',
  'storage',
  'retention',
  'security',
  'rights',
  'revokeAccess',
  'changes',
  'contact',
] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return buildPageMetadata({
    locale: params.locale,
    path: '/privacy-policy',
    titleKey: 'privacy.title',
    descriptionKey: 'privacy.description',
  });
}

export default async function PrivacyPolicyPage({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations('privacy');
  const meta = await getTranslations({ locale: params.locale, namespace: 'metadata' });
  const siteUrl = getSiteUrl();

  return (
    <div className="py-20">
      <BreadcrumbJsonLd
        locale={params.locale}
        path="/privacy-policy"
        title={meta('privacy.title')}
      />
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('title')}</h1>
        <p className="mt-4 text-sm text-slate-500">{t('updated')}</p>

        <div className="mt-8 rounded-xl border border-indigo-100 bg-indigo-50/60 p-6 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">{t('operatorBox.title')}</p>
          <ul className="mt-3 space-y-1">
            <li>
              <span className="font-medium">{t('operatorBox.application')}:</span> BraneIQ
            </li>
            <li>
              <span className="font-medium">{t('operatorBox.operator')}:</span> Cozmot Inc
            </li>
            <li>
              <span className="font-medium">{t('operatorBox.website')}:</span>{' '}
              <a href={siteUrl} className="text-indigo-600 hover:underline">
                {siteUrl}
              </a>
            </li>
            <li>
              <span className="font-medium">{t('operatorBox.products')}:</span> BraneIQ Listen (
              <a href={PRODUCT_URLS.listen} className="text-indigo-600 hover:underline">
                {PRODUCT_URLS.listen}
              </a>
              ), BraneIQ Moderator (
              <a href={PRODUCT_URLS.moderator} className="text-indigo-600 hover:underline">
                {PRODUCT_URLS.moderator}
              </a>
              )
            </li>
            <li>
              <span className="font-medium">{t('operatorBox.contact')}:</span>{' '}
              <a href="mailto:support@braneiq.com" className="text-indigo-600 hover:underline">
                support@braneiq.com
              </a>
            </li>
          </ul>
        </div>

        <p className="mt-8 leading-relaxed text-slate-600">{t('intro')}</p>

        <div className="mt-12 space-y-10">
          {SECTIONS.map((section) => {
            const bullets = t.raw(`sections.${section}.bullets`) as string[] | undefined;

            return (
              <section key={section} id={section}>
                <h2 className="text-xl font-semibold text-slate-900">
                  {t(`sections.${section}.title`)}
                </h2>
                <p className="mt-3 leading-relaxed text-slate-600">{t(`sections.${section}.body`)}</p>
                {Array.isArray(bullets) && bullets.length > 0 && (
                  <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-600">
                    {bullets.map((item) => (
                      <li key={item} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
