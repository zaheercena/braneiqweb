import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';

export async function CtaBanner() {
  const t = await getTranslations('home.cta');

  return (
    <section className="bg-indigo-600 py-20 text-white">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{t('title')}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-indigo-100">{t('subtitle')}</p>
        <Link
          href="/request-demo"
          className="mt-8 inline-flex rounded-lg bg-white px-8 py-3 font-semibold text-indigo-700 transition hover:bg-indigo-50"
        >
          {t('button')}
        </Link>
      </div>
    </section>
  );
}
