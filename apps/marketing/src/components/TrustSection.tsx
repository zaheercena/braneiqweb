import { getTranslations } from 'next-intl/server';
import { Lock, Server, Zap } from 'lucide-react';

export async function TrustSection() {
  const t = await getTranslations('home.trust');

  const items = [
    { icon: Lock, key: 'security' as const },
    { icon: Server, key: 'multiTenant' as const },
    { icon: Zap, key: 'realtime' as const },
  ];

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-slate-500">
          {t('title')}
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map(({ icon: Icon, key }) => (
            <div
              key={key}
              className="flex items-start gap-4 rounded-xl border border-slate-200 p-6"
            >
              <Icon className="mt-0.5 h-6 w-6 shrink-0 text-indigo-600" />
              <div>
                <h3 className="font-semibold text-slate-900">{t(`${key}.title`)}</h3>
                <p className="mt-1 text-sm text-slate-600">{t(`${key}.body`)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
