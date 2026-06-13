import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight, TrendingUp } from 'lucide-react';

export async function Hero() {
  const t = await getTranslations('home.hero');

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.3),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(6,182,212,0.15),transparent_50%)]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <p className="inline-flex rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-200">
            {t('eyebrow')}
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl lg:leading-[1.1]">
            {t('title')}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-300">{t('subtitle')}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/request-demo"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400"
            >
              {t('ctaPrimary')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/platform"
              className="inline-flex items-center rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:mx-0">
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-2 text-xs text-slate-400">BraneIQ Dashboard</span>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4">
              <div className="col-span-2 rounded-lg border border-white/10 bg-slate-800/60 p-4">
                <p className="text-xs text-slate-400">{t('preview.mentions')}</p>
                <p className="mt-1 text-2xl font-bold text-white">2,847</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-emerald-400">
                  <TrendingUp className="h-3 w-3" /> +18% {t('preview.vsLastWeek')}
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-slate-800/60 p-4">
                <p className="text-xs text-slate-400">{t('preview.sentiment')}</p>
                <p className="mt-1 text-xl font-bold text-emerald-400">72%</p>
                <p className="text-xs text-slate-500">{t('preview.positive')}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-slate-800/60 p-4">
                <p className="text-xs text-slate-400">{t('preview.alerts')}</p>
                <p className="mt-1 text-xl font-bold text-amber-400">3</p>
                <p className="text-xs text-slate-500">{t('preview.active')}</p>
              </div>
              <div className="col-span-2 space-y-2 rounded-lg border border-white/10 bg-slate-800/40 p-3">
                {[t('preview.sample1'), t('preview.sample2')].map((line) => (
                  <div key={line} className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
