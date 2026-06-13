import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { BarChart3, Globe2, Shield, Zap } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd';
import { buildPageMetadata } from '@/lib/metadata';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return buildPageMetadata({
    locale: params.locale,
    path: '/platform',
    titleKey: 'platform.title',
    descriptionKey: 'platform.description',
  });
}

export default async function PlatformPage({ params }: Props) {
  setRequestLocale(params.locale);
  const t = await getTranslations('platform');
  const meta = await getTranslations({ locale: params.locale, namespace: 'metadata' });

  const pillars = [
    { icon: Globe2, title: t('pillars.monitoring.title'), body: t('pillars.monitoring.body') },
    { icon: BarChart3, title: t('pillars.analytics.title'), body: t('pillars.analytics.body') },
    { icon: Shield, title: t('pillars.security.title'), body: t('pillars.security.body') },
    { icon: Zap, title: t('pillars.automation.title'), body: t('pillars.automation.body') },
  ];

  return (
    <div className="bg-slate-50">
      <BreadcrumbJsonLd locale={params.locale} path="/platform" title={meta('platform.title')} />
      <section className="border-b border-slate-200 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 py-20 text-white">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-300">
            {t('eyebrow')}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">{t('title')}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-300">{t('subtitle')}</p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-2">
          {pillars.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-6 text-xl font-semibold text-slate-900">{title}</h2>
              <p className="mt-3 leading-relaxed text-slate-600">{body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
