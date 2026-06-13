'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Radio, Trash2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '../../../lib/api';

type Integration = {
  id: string;
  platform: string;
  authType: string;
  status: string;
  label?: string;
  lastVerifiedAt?: string;
};

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400',
  error: 'bg-red-500/20 text-red-400',
  disabled: 'bg-slate-500/20 text-slate-400',
  verifying: 'bg-yellow-500/20 text-yellow-400',
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? STATUS_STYLES.disabled}`}>
      {status}
    </span>
  );
}

const emptyForm = {
  platform: 'reddit',
  label: '',
  clientId: '',
  clientSecret: '',
  bearerToken: '',
  userAgent: 'BraneIQ/1.0',
};

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const loadIntegrations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Integration[]>('/integrations');
      setIntegrations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load integrations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadIntegrations();
  }, [loadIntegrations]);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  }

  async function createIntegration(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const credentials: Record<string, string> = { userAgent: form.userAgent };
    if (form.platform === 'reddit') {
      credentials.clientId = form.clientId;
      credentials.clientSecret = form.clientSecret;
    } else {
      credentials.bearerToken = form.bearerToken;
    }

    try {
      await apiFetch('/integrations', {
        method: 'POST',
        body: JSON.stringify({
          platform: form.platform,
          authType: form.platform === 'reddit' ? 'oauth2' : 'bearer',
          label: form.label || `${form.platform} integration`,
          credentials,
        }),
      });
      setShowModal(false);
      setForm(emptyForm);
      showToast('Integration added — click Verify to test credentials');
      await loadIntegrations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create integration');
    } finally {
      setSubmitting(false);
    }
  }

  async function verifyIntegration(id: string) {
    setVerifyingId(id);
    try {
      const result = await apiFetch<{ status: string; health?: { status: string; message?: string } }>(
        `/integrations/${id}/verify`,
        { method: 'POST' },
      );
      const msg = result.health?.message ?? `Status: ${result.status}`;
      showToast(result.status === 'active' ? `Verified: ${msg}` : msg);
      await loadIntegrations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verify failed');
    } finally {
      setVerifyingId(null);
    }
  }

  async function deleteIntegration(id: string) {
    if (!confirm('Delete this integration? Connector rules using it will stop working.')) return;
    try {
      await apiFetch(`/integrations/${id}`, { method: 'DELETE' });
      showToast('Integration deleted');
      await loadIntegrations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="rounded-lg border border-emerald-800 bg-emerald-900/30 px-4 py-3 text-sm text-emerald-300">
          {toast}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Integrations</h1>
          <p className="mt-1 text-slate-400">Connect Reddit or X/Twitter to fetch real mentions</p>
        </div>
        <button
          type="button"
          onClick={() => { setShowModal(true); setError(null); }}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" /> Add Integration
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-300">{error}</div>
      )}

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-slate-400">
        <strong className="text-slate-300">Next step:</strong> after adding an integration, go to{' '}
        <Link href="/connector-rules" className="text-indigo-400 hover:text-indigo-300">
          Connector Rules
        </Link>{' '}
        to define keywords and brands to monitor.
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((int) => (
            <div key={int.id} className="rounded-xl border border-slate-800 bg-slate-900 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Radio className="h-5 w-5 text-indigo-400" />
                  <div>
                    <p className="font-medium text-white">{int.label ?? int.platform}</p>
                    <p className="text-sm capitalize text-slate-400">{int.platform}</p>
                  </div>
                </div>
                <StatusBadge status={int.status} />
              </div>
              {int.lastVerifiedAt && (
                <p className="mt-2 text-xs text-slate-500">
                  Last verified {new Date(int.lastVerifiedAt).toLocaleString()}
                </p>
              )}
              {int.status === 'error' && (
                <p className="mt-2 flex items-start gap-1 text-xs text-red-400">
                  <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
                  Verification failed — check credentials or API credits (X requires paid tier).
                </p>
              )}
              {int.status === 'active' && (
                <p className="mt-2 flex items-center gap-1 text-xs text-green-400">
                  <CheckCircle2 className="h-3 w-3" /> Ready for connector rules
                </p>
              )}
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  disabled={verifyingId === int.id}
                  onClick={() => verifyIntegration(int.id)}
                  className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-50"
                >
                  {verifyingId === int.id ? 'Verifying…' : 'Verify'}
                </button>
                <button
                  type="button"
                  onClick={() => deleteIntegration(int.id)}
                  className="rounded-lg border border-red-800 px-3 py-1.5 text-xs text-red-400 hover:bg-red-900/20"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
          {!integrations.length && (
            <div className="col-span-full rounded-xl border border-dashed border-slate-700 p-12 text-center text-slate-500">
              <Radio className="mx-auto mb-3 h-8 w-8 text-slate-600" />
              <p>No integrations configured.</p>
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="mt-3 text-sm text-indigo-400 hover:text-indigo-300"
              >
                Add your first integration
              </button>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={createIntegration}
            className="w-full max-w-md space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-6"
          >
            <h2 className="text-lg font-semibold text-white">Add Integration</h2>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Platform</label>
              <select
                value={form.platform}
                onChange={(e) => setForm({ ...form, platform: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white"
              >
                <option value="reddit">Reddit</option>
                <option value="twitter">X / Twitter</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-500">Label (optional)</label>
              <input
                placeholder="e.g. Production Reddit"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white"
              />
            </div>

            {form.platform === 'reddit' ? (
              <>
                <input
                  placeholder="Client ID *"
                  value={form.clientId}
                  onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white"
                  required
                />
                <input
                  type="password"
                  placeholder="Client Secret *"
                  value={form.clientSecret}
                  onChange={(e) => setForm({ ...form, clientSecret: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white"
                  required
                />
              </>
            ) : (
              <>
                <input
                  type="password"
                  placeholder="Bearer Token *"
                  value={form.bearerToken}
                  onChange={(e) => setForm({ ...form, bearerToken: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white"
                  required
                />
                <p className="text-xs text-slate-500">
                  Paste the raw token from the X portal (ends with =). X API requires paid credits for search.
                </p>
              </>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-lg bg-indigo-600 py-2 text-sm text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {submitting ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
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
