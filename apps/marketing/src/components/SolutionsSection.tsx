import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/SectionHeading';
import { Radio, MessageSquareWarning, Youtube, Newspaper, ShieldAlert, BarChart3, FileText, UserCheck } from 'lucide-react';

export async function SolutionsSection() {
  const t = await getTranslations('home.solutions');

  const products = [
    { icon: Radio, key: 'socialListening' as const, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
    { icon: MessageSquareWarning, key: 'commentModerator' as const, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { icon: Youtube, key: 'youtubeModeration' as const, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { icon: Newspaper, key: 'newsMonitoring' as const, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
    { icon: ShieldAlert, key: 'crisisMonitoring' as const, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
    { icon: BarChart3, key: 'competitorIntelligence' as const, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { icon: FileText, key: 'aiReporting' as const, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { icon: UserCheck, key: 'executiveDashboards' as const, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
  ];

  return (
    <section id="solutions" className="scroll-mt-24 bg-slate-950 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} align="center" dark />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map(({ icon: Icon, key, color, bg, border }) => (
            <article
              key={key}
              className={`group relative rounded-2xl border ${border} bg-slate-900 p-5 transition hover:-translate-y-0.5 hover:shadow-lg`}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-white">{t(`products.${key}.name`)}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">{t(`products.${key}.body`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
