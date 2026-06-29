'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

type Status = 'idle' | 'loading' | 'success' | 'error';

const inputClass =
  'mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50';

export function RequestDemoForm() {
  const t = useTranslations('demo');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const form = event.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      company: (form.elements.namedItem('company') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.error ?? 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }

      setStatus('success');
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  }

  return (
    <div className="bg-slate-50 py-20">
      <div className="mx-auto max-w-xl px-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('title')}</h1>
        <p className="mt-4 text-slate-600">{t('subtitle')}</p>

        {status === 'success' ? (
          <div className="mt-10 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
            <p className="text-emerald-800">{t('success')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-5" noValidate>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                {t('form.name')} <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                disabled={status === 'loading'}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                {t('form.email')} <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={status === 'loading'}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-slate-700">
                {t('form.company')}
              </label>
              <input
                id="company"
                name="company"
                type="text"
                autoComplete="organization"
                disabled={status === 'loading'}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700">
                {t('form.message')}
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                disabled={status === 'loading'}
                className={inputClass}
              />
            </div>

            {status === 'error' && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
              {status === 'loading' ? 'Sending…' : t('form.submit')}
            </button>

            <p className="text-center text-xs text-slate-400">
              Your details are sent securely to{' '}
              <span className="font-medium text-slate-500">support@braneiq.com</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
