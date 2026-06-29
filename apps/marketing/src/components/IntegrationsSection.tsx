import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/SectionHeading';

const platforms = [
  { name: 'Facebook', emoji: '🔵', color: 'bg-blue-50 border-blue-200 text-blue-800' },
  { name: 'Instagram', emoji: '📸', color: 'bg-pink-50 border-pink-200 text-pink-800' },
  { name: 'YouTube', emoji: '▶️', color: 'bg-red-50 border-red-200 text-red-800' },
  { name: 'Reddit', emoji: '🟠', color: 'bg-orange-50 border-orange-200 text-orange-800' },
  { name: 'X / Twitter', emoji: '✖', color: 'bg-slate-50 border-slate-200 text-slate-800' },
  { name: 'News Websites', emoji: '📰', color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
  { name: 'Blogs', emoji: '✍️', color: 'bg-violet-50 border-violet-200 text-violet-800' },
  { name: 'Forums', emoji: '💬', color: 'bg-teal-50 border-teal-200 text-teal-800' },
  { name: 'RSS Feeds', emoji: '📡', color: 'bg-amber-50 border-amber-200 text-amber-800' },
];

const comingSoon = [
  { name: 'TikTok', emoji: '🎵', color: 'bg-slate-50 border-dashed border-slate-200 text-slate-500' },
  { name: 'LinkedIn', emoji: '💼', color: 'bg-slate-50 border-dashed border-slate-200 text-slate-500' },
];

export async function IntegrationsSection() {
  const t = await getTranslations('home.integrations');

  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} align="center" />

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          {platforms.map(({ name, emoji, color }) => (
            <span
              key={name}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium shadow-sm ${color}`}
            >
              <span aria-hidden="true">{emoji}</span>
              {name}
            </span>
          ))}
          {comingSoon.map(({ name, emoji, color }) => (
            <span
              key={name}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${color}`}
            >
              <span aria-hidden="true">{emoji}</span>
              {name}
              <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                {t('comingSoon')}
              </span>
            </span>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">{t('more')}</p>
      </div>
    </section>
  );
}
