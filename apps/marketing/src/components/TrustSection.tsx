import { getTranslations } from 'next-intl/server';
import { SectionHeading } from '@/components/SectionHeading';
import { Lock, Server, Zap, ShieldCheck, Clock, Cloud } from 'lucide-react';

export async function TrustSection() {
  const t = await getTranslations('home.trust');

  const items = [
    { icon: Lock, key: 'security' as const },
    { icon: Server, key: 'multiTenant' as const },
    { icon: Zap, key: 'realtime' as const },
    { icon: ShieldCheck, key: 'gdpr' as const },
    { icon: Clock, key: 'uptime' as const },
    { icon: Cloud, key: 'cloud' as const },
  ];

  const badges = ['GDPR Ready', 'Enterprise Grade', '99.9% Uptime', 'Cloud Infrastructure'];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} align="center" />

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {badges.map((badge) => (
            <span key={badge} className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              {badge}
            </span>
          ))}
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, key }) => (
            <div
              key={key}
              className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-indigo-200 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{t(`${key}.title`)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{t(`${key}.body`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
