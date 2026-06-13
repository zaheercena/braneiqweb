'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Zap, Loader2 } from 'lucide-react';
import { apiFetch, getWorkspaceId } from '../../../lib/api';

type Brand = {
  id: string;
  name: string;
  logoUrl?: string | null;
  domains: string[];
  handles: unknown;
  isPrimary: boolean;
  createdAt: string;
};

type BrandForm = {
  name: string;
  description: string;
  website: string;
  keywords: string;
  isPrimary: boolean;
};

const emptyForm: BrandForm = {
  name: '',
  description: '',
  website: '',
  keywords: '',
  isPrimary: false,
};

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<BrandForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [quota, setQuota] = useState<{
    brandsUsed: number;
    maxBrands: number;
    brandsRemaining: number;
    mentionsUsedThisPeriod: number;
    maxMonthlyMentions: number;
    mentionsRemaining: number;
  } | null>(null);

  const loadBrands = useCallback(async () => {
    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      setLoading(false);
      setBrands([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Brand[]>('/brands');
      setBrands(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load brands');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBrands();
    apiFetch<typeof quota>('/quota').then(setQuota).catch(() => undefined);
  }, [loadBrands]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const workspaceId = getWorkspaceId();
    if (!workspaceId) {
      setError('Please select a workspace first. Sign in again if needed.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      website: form.website.trim() || undefined,
      keywords: form.keywords
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      competitors: [] as string[],
      isPrimary: form.isPrimary,
    };

    console.log('[brands] submit started', payload);
    setSubmitting(true);

    try {
      const created = await apiFetch<Brand>('/brands', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      console.log('[brands] create success', created);
      setToast(`Brand "${created.name}" created`);
      setShowModal(false);
      setForm(emptyForm);
      await loadBrands();
      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create brand';
      console.error('[brands] create error', message);
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  function openModal() {
    setError(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="rounded-lg border border-emerald-800 bg-emerald-900/30 px-4 py-3 text-sm text-emerald-300">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Brands</h1>
          <p className="mt-1 text-slate-400">Manage tracked brands and social handles</p>
        </div>
        <button
          type="button"
          onClick={openModal}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" /> Add Brand
        </button>
      </div>

      {quota && (
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-slate-400">
          Quota: <span className="text-white">{quota.brandsUsed}/{quota.maxBrands} brands</span>
          {' · '}
          <span className="text-white">{quota.mentionsUsedThisPeriod.toLocaleString()}/{quota.maxMonthlyMentions.toLocaleString()} mentions this month</span>
        </div>
      )}

      {!getWorkspaceId() && (
        <div className="rounded-lg border border-amber-800 bg-amber-900/20 px-4 py-3 text-sm text-amber-200">
          Please sign in and select a workspace before adding brands.
        </div>
      )}

      {error && !showModal && (
        <div className="rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900 p-12">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
        </div>
      ) : brands.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center text-slate-500">
          No brands configured. Click Add Brand to get started.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => (
            <div key={brand.id} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20">
                  <Zap className="h-5 w-5 text-indigo-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate font-semibold text-white">{brand.name}</h3>
                    {brand.isPrimary && (
                      <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300">
                        Primary
                      </span>
                    )}
                  </div>
                  {brand.domains.length > 0 && (
                    <p className="mt-1 truncate text-sm text-slate-400">{brand.domains.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6"
          >
            <h2 className="text-lg font-semibold text-white">Add Brand</h2>

            {error && (
              <div className="rounded-lg border border-red-800 bg-red-900/20 px-3 py-2 text-sm text-red-300">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300">Brand name *</label>
              <input
                required
                minLength={2}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
                placeholder="Nike"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
                rows={2}
                placeholder="Optional description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Website</label>
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
                placeholder="https://nike.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300">Keywords / handles</label>
              <input
                value={form.keywords}
                onChange={(e) => setForm({ ...form, keywords: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
                placeholder="nike, @nike"
              />
              <p className="mt-1 text-xs text-slate-500">Comma-separated keywords or @handles</p>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={form.isPrimary}
                onChange={(e) => setForm({ ...form, isPrimary: e.target.checked })}
                className="rounded border-slate-600"
              />
              Set as primary brand
            </label>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? 'Creating…' : 'Create Brand'}
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
