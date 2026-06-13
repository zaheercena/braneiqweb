import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/SectionHeading';

const sources = ['X / Twitter', 'Reddit', 'Facebook', 'YouTube', 'News & RSS'];

export async function IntegrationsSection() {
  const t = await getTranslations('home.integrations');

  return (
    <section className="border-y border-slate-200 bg-slate-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
          align="center"
        />

        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {sources.map((source) => (
            <span
              key={source}
              className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm"
            >
              {source}
            </span>
          ))}
          <span className="rounded-full border border-dashed border-indigo-300 bg-indigo-50 px-5 py-2.5 text-sm font-medium text-indigo-700">
            {t('more')}
          </span>
        </div>
      </div>
    </section>
  );
}
