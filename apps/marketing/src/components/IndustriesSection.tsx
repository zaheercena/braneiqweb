import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/SectionHeading';
import { Building2, Megaphone, ShoppingBag, Trophy } from 'lucide-react';

export async function IndustriesSection() {
  const t = await getTranslations('home.industries');

  const items = [
    { icon: Megaphone, key: 'agencies' as const },
    { icon: Building2, key: 'enterprise' as const },
    { icon: ShoppingBag, key: 'retail' as const },
    { icon: Trophy, key: 'sports' as const },
  ];

  return (
    <section id="industries" className="scroll-mt-24 bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {items.map(({ icon: Icon, key }) => (
            <article
              key={key}
              className="flex gap-5 rounded-2xl border border-slate-200 p-6 transition hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{t(`${key}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(`${key}.body`)}</p>
                <p className="mt-4 text-2xl font-bold text-indigo-600">{t(`${key}.stat`)}</p>
                <p className="mt-1 text-xs text-slate-500">{t(`${key}.statLabel`)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
