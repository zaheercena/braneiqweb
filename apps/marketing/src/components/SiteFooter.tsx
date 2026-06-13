import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getAppUrl } from '@/lib/env';

export async function SiteFooter() {
  const t = await getTranslations('footer');
  const year = new Date().getFullYear();
  const appUrl = getAppUrl();

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="text-lg font-bold text-white">
            Brane<span className="text-indigo-400">IQ</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">{t('tagline')}</p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            {t('product')}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/#solutions" className="hover:text-white">
                {t('solutions')}
              </Link>
            </li>
            <li>
              <Link href="/platform" className="hover:text-white">
                {t('platform')}
              </Link>
            </li>
            <li>
              <Link href="/#industries" className="hover:text-white">
                {t('industries')}
              </Link>
            </li>
            <li>
              <Link href="/request-demo" className="hover:text-white">
                {t('demo')}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            {t('resources')}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/#faq" className="hover:text-white">
                {t('faq')}
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-white">
                {t('privacy')}
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="hover:text-white">
                {t('terms')}
              </Link>
            </li>
            <li>
              <a href="/llms.txt" className="hover:text-white">
                {t('llmsTxt')}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            {t('contact')}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="mailto:hello@braneiq.com" className="hover:text-white">
                hello@braneiq.com
              </a>
            </li>
            <li>
              <a href={`${appUrl}/login`} className="hover:text-white">
                {t('login')}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 px-6 py-6 text-center text-xs text-slate-500">
        © {year} BraneIQ. {t('rights')}
      </div>
    </footer>
  );
}
