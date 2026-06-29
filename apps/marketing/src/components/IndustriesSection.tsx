import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/SectionHeading';
import { ShoppingBag, Landmark, Building, Wifi, Heart, Hotel, GraduationCap, Megaphone } from 'lucide-react';

export async function IndustriesSection() {
  const t = await getTranslations('home.industries');

  const items = [
    { icon: ShoppingBag, key: 'retail' as const },
    { icon: Landmark, key: 'banking' as const },
    { icon: Building, key: 'government' as const },
    { icon: Wifi, key: 'telecom' as const },
    { icon: Heart, key: 'healthcare' as const },
    { icon: Hotel, key: 'hospitality' as const },
    { icon: GraduationCap, key: 'education' as const },
    { icon: Megaphone, key: 'agencies' as const },
  ];

  return (
    <section id="industries" className="scroll-mt-24 bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} align="center" />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, key }) => (
            <article
              key={key}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">{t(`${key}.title`)}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{t(`${key}.body`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
