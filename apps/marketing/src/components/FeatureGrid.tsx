import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/SectionHeading';
import { Bell, LineChart, Search, Users } from 'lucide-react';

export async function FeatureGrid() {
  const t = await getTranslations('home.features');

  const features = [
    { icon: Search, key: 'monitoring' as const },
    { icon: LineChart, key: 'analytics' as const },
    { icon: Bell, key: 'alerts' as const },
    { icon: Users, key: 'teams' as const },
  ];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading title={t('title')} subtitle={t('subtitle')} />

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {features.map(({ icon: Icon, key }) => (
            <article
              key={key}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-8 transition hover:border-indigo-200 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">{t(`${key}.title`)}</h3>
              <p className="mt-3 leading-relaxed text-slate-600">{t(`${key}.body`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
