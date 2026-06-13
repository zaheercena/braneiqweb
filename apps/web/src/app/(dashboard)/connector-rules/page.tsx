'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Play, Hash, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '../../../lib/api';

type Integration = { id: string; platform: string; label?: string; status: string };
type Brand = { id: string; name: string };

type Rule = {
  id: string;
  platform: string;
  ruleType: string;
  includeKeywords: string[];
  isActive: boolean;
  intervalMinutes: number;
  integration?: { label?: string; status: string };
};

const emptyForm = {
  integrationId: '',
  brandId: '',
  platform: 'reddit',
  ruleType: 'keyword_search',
  includeKeywords: '',
  excludeKeywords: '',
  query: '',
};

export default function ConnectorRulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [rulesData, integrationsData, brandsData] = await Promise.all([
        apiFetch<Rule[]>('/connector-rules'),
        apiFetch<Integration[]>('/integrations'),
        apiFetch<Brand[]>('/brands'),
      ]);
      setRules(rulesData);
      setIntegrations(integrationsData);
      setBrands(brandsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load connector rules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openCreateForm() {
    setForm(emptyForm);
    setError(null);
    setShowForm(true);
    load();
  }

  function onIntegrationChange(integrationId: string) {
    const integration = integrations.find((i) => i.id === integrationId);
    setForm((prev) => ({
      ...prev,
      integrationId,
      platform: integration?.platform ?? prev.platform,
    }));
  }

  async function createRule(e: React.FormEvent) {
    e.preventDefault();
    if (!integrations.length) {
      setError('Add an integration first (Integrations page).');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch('/connector-rules', {
        method: 'POST',
        body: JSON.stringify({
          integrationId: form.integrationId,
          brandId: form.brandId,
          platform: form.platform,
          ruleType: form.ruleType,
          query: form.query || undefined,
          includeKeywords: form.includeKeywords.split(',').map((s) => s.trim()).filter(Boolean),
          excludeKeywords: form.excludeKeywords.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });
      setShowForm(false);
      setForm(emptyForm);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create rule');
    } finally {
      setSubmitting(false);
    }
  }

  async function runNow(id: string, dryRun = false) {
    try {
      await apiFetch(`/connector-rules/${id}/run-now`, {
        method: 'POST',
        body: JSON.stringify({ dryRun }),
      });
      alert('Run triggered — check Connector Runs for status');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Run failed');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Connector Rules</h1>
          <p className="mt-1 text-slate-400">Define what to monitor on each platform</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/connector-runs"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            Run History
          </Link>
          <button
            type="button"
            onClick={openCreateForm}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" /> Create Rule
          </button>
        </div>
      </div>

      {error && !showForm && (
        <div className="rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-300">{error}</div>
      )}

      {!loading && integrations.length === 0 && (
        <div className="rounded-xl border border-amber-800/50 bg-amber-900/10 px-4 py-3 text-sm text-amber-200">
          <strong>Step 1 required:</strong> You have no integrations yet. Go to{' '}
          <Link href="/integrations" className="underline hover:text-amber-100">
            Integrations
          </Link>{' '}
          and add Reddit or X/Twitter credentials before creating a rule.
        </div>
      )}

      <button type="button" onClick={load} className="text-sm text-indigo-400 hover:text-indigo-300">
        {loading ? 'Loading…' : 'Refresh'}
      </button>

      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 p-4"
          >
            <div className="flex items-center gap-3">
              <Hash className="h-5 w-5 text-indigo-400" />
              <div>
                <p className="font-medium capitalize text-white">
                  {rule.platform} — {rule.ruleType.replace('_', ' ')}
                </p>
                <p className="text-sm text-slate-400">
                  {rule.includeKeywords.join(', ') || 'No keywords'}
                  {rule.integration?.label ? ` · ${rule.integration.label}` : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  rule.isActive ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                }`}
              >
                {rule.isActive ? 'active' : 'disabled'}
              </span>
              <button
                type="button"
                onClick={() => runNow(rule.id, true)}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
              >
                Dry Run
              </button>
              <button
                type="button"
                onClick={() => runNow(rule.id)}
                className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-500"
              >
                <Play className="h-3 w-3" /> Run Now
              </button>
            </div>
          </div>
        ))}
        {!loading && !rules.length && (
          <div className="rounded-xl border border-dashed border-slate-700 p-12 text-center text-slate-500">
            <p>No connector rules yet.</p>
            <p className="mt-2 text-sm">
              {integrations.length === 0
                ? 'First add an integration, then create a rule to start fetching mentions.'
                : 'Click Create Rule to define keywords and which brand to monitor.'}
            </p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={createRule}
            className="max-h-[90vh] w-full max-w-md space-y-3 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-6"
          >
            <h2 className="text-lg font-semibold text-white">Create Connector Rule</h2>

            {error && (
              <div className="rounded-lg border border-red-800 bg-red-900/20 px-3 py-2 text-sm text-red-300">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1 block text-xs text-slate-500">Integration *</label>
              {integrations.length === 0 ? (
                <div className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-400">
                  No integrations found.{' '}
                  <Link href="/integrations" className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300">
                    Add one now <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              ) : (
                <select
                  value={form.integrationId}
                  onChange={(e) => onIntegrationChange(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white"
                  required
                >
                  <option value="">Select integration…</option>
                  {integrations.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.label ?? i.platform} ({i.platform}) — {i.status}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Brand *</label>
              <select
                value={form.brandId}
                onChange={(e) => setForm({ ...form, brandId: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white"
                required
              >
                <option value="">Select brand…</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Rule type</label>
              <select
                value={form.ruleType}
                onChange={(e) => setForm({ ...form, ruleType: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white"
              >
                <option value="keyword_search">Keyword Search (Reddit)</option>
                <option value="subreddit">Subreddit (Reddit)</option>
                <option value="recent_search">Recent Search (X / Twitter)</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Include keywords (comma-separated)</label>
              <input
                placeholder="e.g. nike, just do it"
                value={form.includeKeywords}
                onChange={(e) => setForm({ ...form, includeKeywords: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Exclude keywords (optional)</label>
              <input
                placeholder="e.g. jobs, hiring"
                value={form.excludeKeywords}
                onChange={(e) => setForm({ ...form, excludeKeywords: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Query / subreddit (optional)</label>
              <input
                placeholder={form.ruleType === 'subreddit' ? 'e.g. fashion' : 'Advanced query'}
                value={form.query}
                onChange={(e) => setForm({ ...form, query: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={submitting || integrations.length === 0}
                className="flex-1 rounded-lg bg-indigo-600 py-2 text-sm text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {submitting ? 'Creating…' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300"
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
