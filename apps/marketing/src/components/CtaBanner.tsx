import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight, Calendar } from 'lucide-react';

export async function CtaBanner() {
  const t = await getTranslations('home.cta');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 py-24 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.3),transparent_60%)]" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">{t('title')}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-indigo-100">{t('subtitle')}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/request-demo"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
          >
            {t('button')}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/request-demo"
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white transition hover:bg-white/20"
          >
            <Calendar className="h-4 w-4" aria-hidden="true" />
            {t('buttonSecondary')}
          </Link>
        </div>
      </div>
    </section>
  );
}
