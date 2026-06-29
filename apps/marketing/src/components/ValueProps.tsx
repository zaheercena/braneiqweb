import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/SectionHeading';
import { ShieldAlert, MessageSquareOff, BarChart3, TrendingUp, Heart, UserCheck } from 'lucide-react';

export async function ValueProps() {
  const t = await getTranslations('home.valueProps');

  const cards = [
    { icon: ShieldAlert, key: 'crisis' as const, accent: 'from-red-500/10 to-red-500/5', border: 'border-red-500/20', icon_bg: 'bg-red-500/10', icon_color: 'text-red-400' },
    { icon: MessageSquareOff, key: 'spam' as const, accent: 'from-amber-500/10 to-amber-500/5', border: 'border-amber-500/20', icon_bg: 'bg-amber-500/10', icon_color: 'text-amber-400' },
    { icon: TrendingUp, key: 'competitors' as const, accent: 'from-cyan-500/10 to-cyan-500/5', border: 'border-cyan-500/20', icon_bg: 'bg-cyan-500/10', icon_color: 'text-cyan-400' },
    { icon: BarChart3, key: 'campaigns' as const, accent: 'from-indigo-500/10 to-indigo-500/5', border: 'border-indigo-500/20', icon_bg: 'bg-indigo-500/10', icon_color: 'text-indigo-400' },
    { icon: Heart, key: 'sentiment' as const, accent: 'from-violet-500/10 to-violet-500/5', border: 'border-violet-500/20', icon_bg: 'bg-violet-500/10', icon_color: 'text-violet-400' },
    { icon: UserCheck, key: 'executive' as const, accent: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-500/20', icon_bg: 'bg-emerald-500/10', icon_color: 'text-emerald-400' },
  ];

  return (
    <section className="bg-slate-950 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
          align="center"
          dark
        />

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ icon: Icon, key, accent, border, icon_bg, icon_color }) => (
            <article
              key={key}
              className={`group relative overflow-hidden rounded-2xl border ${border} bg-gradient-to-br ${accent} p-6 transition hover:-translate-y-0.5 hover:shadow-lg`}
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${icon_bg}`}>
                <Icon className={`h-5 w-5 ${icon_color}`} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">{t(`${key}.title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{t(`${key}.body`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
