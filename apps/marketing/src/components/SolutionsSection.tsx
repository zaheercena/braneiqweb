import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/SectionHeading';
import { Ear, LineChart, ShieldAlert } from 'lucide-react';

export async function SolutionsSection() {
  const t = await getTranslations('home.solutions');

  const items = [
    { icon: Ear, key: 'listening' as const },
    { icon: LineChart, key: 'sentiment' as const },
    { icon: ShieldAlert, key: 'crisis' as const },
  ];

  return (
    <section id="solutions" className="scroll-mt-24 bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {items.map(({ icon: Icon, key }) => (
            <article
              key={key}
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-8 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
            >
              <div className="absolute inset-x-0 top-0 h-1 scale-x-0 bg-gradient-to-r from-indigo-500 to-cyan-500 transition group-hover:scale-x-100" />
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-slate-900">{t(`${key}.title`)}</h3>
              <p className="mt-3 leading-relaxed text-slate-600">{t(`${key}.body`)}</p>
              <ul className="mt-6 space-y-2">
                {[1, 2, 3].map((n) => (
                  <li key={n} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                    {t(`${key}.points.${n}`)}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
