import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight, Play, TrendingUp, TrendingDown, ShieldAlert, Activity } from 'lucide-react';

export async function Hero() {
  const t = await getTranslations('home.hero');

  return (
    <section aria-label="Hero" className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.25),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(6,182,212,0.1),transparent_55%)]" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwIDEgMSAwIDEgMC0yIDB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9nPjwvc3ZnPg==')] opacity-40" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
            {t('eyebrow')}
          </p>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
            {t('title')}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-300">{t('subtitle')}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/request-demo"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-6 py-3 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-400"
            >
              {t('ctaPrimary')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/platform"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40"
            >
              <Play className="h-4 w-4 fill-white" aria-hidden="true" />
              {t('ctaSecondary')}
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-500">No credit card required &middot; Setup in 48 hours &middot; Cancel anytime</p>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:mx-0">
          <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-indigo-500/15 via-cyan-500/10 to-transparent blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/90 shadow-2xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs font-medium text-slate-400">BraneIQ Intelligence Dashboard</span>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Live
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 p-4">
              <div className="rounded-xl border border-white/10 bg-slate-800/70 p-3">
                <p className="text-[10px] text-slate-400">{t('preview.mentions')}</p>
                <p className="mt-1 text-xl font-bold text-white">2,847</p>
                <p className="mt-0.5 flex items-center gap-0.5 text-[10px] text-emerald-400">
                  <TrendingUp className="h-3 w-3" aria-hidden="true" /> +18%
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-800/70 p-3">
                <p className="text-[10px] text-slate-400">{t('preview.sentiment')}</p>
                <p className="mt-1 text-xl font-bold text-emerald-400">72%</p>
                <p className="mt-0.5 text-[10px] text-slate-500">{t('preview.positive')}</p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
                <p className="text-[10px] text-slate-400">{t('preview.alerts')}</p>
                <p className="mt-1 text-xl font-bold text-amber-400">3</p>
                <p className="mt-0.5 text-[10px] text-amber-500/80">{t('preview.active')}</p>
              </div>
            </div>

            <div className="mx-4 mb-3 rounded-xl border border-white/10 bg-slate-800/50 p-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">Sentiment Trend — 7d</p>
                <TrendingDown className="h-3 w-3 text-emerald-400" aria-hidden="true" />
              </div>
              <div className="mt-2 flex items-end gap-1 h-10">
                {[35, 50, 42, 68, 55, 72, 65].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-indigo-500/60"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="mx-4 mb-4 space-y-1.5">
              {[
                { icon: ShieldAlert, color: 'text-amber-400', bg: 'bg-amber-500/10', text: t('preview.sample1') },
                { icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10', text: t('preview.sample2') },
                { icon: ShieldAlert, color: 'text-emerald-400', bg: 'bg-emerald-500/10', text: t('preview.sample3') },
              ].map(({ icon: Icon, color, bg, text }) => (
                <div key={text} className={`flex items-center gap-2 rounded-lg ${bg} px-3 py-2`}>
                  <Icon className={`h-3 w-3 shrink-0 ${color}`} aria-hidden="true" />
                  <p className="text-[11px] text-slate-300 leading-tight">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
