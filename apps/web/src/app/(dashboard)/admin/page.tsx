'use client';

import { useCallback, useEffect, useState } from 'react';
import { Shield, Users, Loader2, Plus, Trash2, Pencil } from 'lucide-react';
import { apiFetch } from '../../../lib/api';
import { useRouter } from 'next/navigation';
import { usePlatformAdmin } from '../../../hooks/usePlatformAdmin';

type ClientRow = {
  tenantId: string;
  tenantName: string;
  ownerEmail: string | null;
  ownerName: string | null;
  ownerRole?: string;
  brandsUsed: number;
  maxBrands: number;
  maxMonthlyMentions: number;
  mentionsUsedThisPeriod: number;
  mentionsRemaining: number;
};

const emptyCreateForm = {
  tenantName: '',
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  maxBrands: '10',
  maxMonthlyMentions: '50000',
};

export default function AdminPage() {
  const router = useRouter();
  const { isPlatformAdmin: admin, loading: adminLoading } = usePlatformAdmin();
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<ClientRow | null>(null);
  const [editForm, setEditForm] = useState({ tenantName: '', ownerFirstName: '', ownerLastName: '' });
  const [toast, setToast] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreateForm);

  const load = useCallback(async () => {
    if (!admin) {
      if (!adminLoading) router.replace('/brands');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<ClientRow[]>('/admin/clients');
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load clients');
    } finally {
      setLoading(false);
    }
  }, [router, admin, adminLoading]);

  useEffect(() => {
    if (!adminLoading) load();
  }, [load, adminLoading]);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  }

  async function saveQuota(tenantId: string, maxBrands: number, maxMonthlyMentions: number) {
    setSavingId(tenantId);
    setError(null);
    try {
      await apiFetch(`/admin/clients/${tenantId}/quota`, {
        method: 'PATCH',
        body: JSON.stringify({ maxBrands, maxMonthlyMentions }),
      });
      showToast('Quota updated');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSavingId(null);
    }
  }

  async function createClient(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const result = await apiFetch<{ email: string; tenantId: string }>('/admin/clients', {
        method: 'POST',
        body: JSON.stringify({
          tenantName: createForm.tenantName.trim(),
          email: createForm.email.trim(),
          password: createForm.password,
          firstName: createForm.firstName.trim() || undefined,
          lastName: createForm.lastName.trim() || undefined,
          maxBrands: parseInt(createForm.maxBrands, 10),
          maxMonthlyMentions: parseInt(createForm.maxMonthlyMentions, 10),
        }),
      });
      setShowCreate(false);
      setCreateForm(emptyCreateForm);
      showToast(`Client created: ${result.email}`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create client');
    } finally {
      setCreating(false);
    }
  }

  async function deleteClient(client: ClientRow) {
    const confirmed = window.confirm(
      `Delete client "${client.tenantName}" (${client.ownerEmail ?? 'no email'})?\n\nThis deactivates their workspace. They will no longer be able to sign in.`,
    );
    if (!confirmed) return;

    setDeletingId(client.tenantId);
    setError(null);
    try {
      await apiFetch(`/admin/clients/${client.tenantId}`, { method: 'DELETE' });
      showToast(`Deleted ${client.tenantName}`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  }

  function openEdit(client: ClientRow) {
    const parts = (client.ownerName ?? '').split(' ');
    setEditForm({
      tenantName: client.tenantName,
      ownerFirstName: parts[0] ?? '',
      ownerLastName: parts.slice(1).join(' '),
    });
    setEditingClient(client);
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingClient) return;
    setSavingId(editingClient.tenantId);
    try {
      await apiFetch(`/admin/clients/${editingClient.tenantId}`, {
        method: 'PATCH',
        body: JSON.stringify(editForm),
      });
      showToast('Client updated');
      setEditingClient(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setSavingId(null);
    }
  }

  if (adminLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="space-y-6">
      {toast && (
        <div className="rounded-lg border border-emerald-800 bg-emerald-900/30 px-4 py-3 text-sm text-emerald-300">
          {toast}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20">
            <Shield className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Client Management</h1>
            <p className="text-sm text-slate-400">
              Create, edit, delete clients and set brand / mention quotas
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" /> Create client
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {[
          { label: 'Create', desc: 'New client + owner login' },
          { label: 'Read', desc: 'List all clients below' },
          { label: 'Update', desc: 'Edit name, quotas' },
          { label: 'Delete', desc: 'Deactivate client' },
        ].map((item) => (
          <div key={item.label} className="rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2">
            <p className="text-xs font-semibold uppercase text-indigo-400">{item.label}</p>
            <p className="text-xs text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-300">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        </div>
      ) : clients.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center text-slate-500">
          <Users className="mx-auto mb-3 h-8 w-8" />
          <p>No client accounts yet.</p>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="mt-4 text-sm text-indigo-400 hover:text-indigo-300"
          >
            Create your first client
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Owner / role</th>
                <th className="px-4 py-3 font-medium">Brands</th>
                <th className="px-4 py-3 font-medium">Monthly mentions</th>
                <th className="px-4 py-3 font-medium">Quotas</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <ClientQuotaRow
                  key={c.tenantId}
                  client={c}
                  saving={savingId === c.tenantId}
                  deleting={deletingId === c.tenantId}
                  onSave={saveQuota}
                  onDelete={deleteClient}
                  onEdit={openEdit}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={saveEdit} className="w-full max-w-md space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-lg font-semibold text-white">Edit client</h2>
            <p className="text-sm text-slate-400">{editingClient.ownerEmail}</p>
            <input
              required
              value={editForm.tenantName}
              onChange={(e) => setEditForm({ ...editForm, tenantName: e.target.value })}
              placeholder="Client name"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                value={editForm.ownerFirstName}
                onChange={(e) => setEditForm({ ...editForm, ownerFirstName: e.target.value })}
                placeholder="Owner first name"
                className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white"
              />
              <input
                value={editForm.ownerLastName}
                onChange={(e) => setEditForm({ ...editForm, ownerLastName: e.target.value })}
                placeholder="Owner last name"
                className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white"
              />
            </div>
            <p className="text-xs text-slate-500">
              Role: <span className="capitalize text-slate-300">{editingClient.ownerRole ?? 'owner'}</span> (team roles managed in client workspace)
            </p>
            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={savingId === editingClient.tenantId} className="flex-1 rounded-lg bg-indigo-600 py-2 text-sm text-white disabled:opacity-50">
                Save changes
              </button>
              <button type="button" onClick={() => setEditingClient(null)} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={createClient}
            className="max-h-[90vh] w-full max-w-lg space-y-3 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-6"
          >
            <h2 className="text-lg font-semibold text-white">Create client</h2>
            <p className="text-sm text-slate-400">
              Creates a new tenant, default workspace, owner account, and quotas.
            </p>

            <input
              required
              placeholder="Company / client name *"
              value={createForm.tenantName}
              onChange={(e) => setCreateForm({ ...createForm, tenantName: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white"
            />
            <input
              required
              type="email"
              placeholder="Owner email *"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white"
            />
            <input
              required
              type="password"
              minLength={8}
              placeholder="Password (min 8 chars) *"
              value={createForm.password}
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="First name"
                value={createForm.firstName}
                onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white"
              />
              <input
                placeholder="Last name"
                value={createForm.lastName}
                onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-slate-500">
                Max brands
                <input
                  type="number"
                  min={1}
                  required
                  value={createForm.maxBrands}
                  onChange={(e) => setCreateForm({ ...createForm, maxBrands: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white"
                />
              </label>
              <label className="text-xs text-slate-500">
                Max mentions / month
                <input
                  type="number"
                  min={100}
                  step={1000}
                  required
                  value={createForm.maxMonthlyMentions}
                  onChange={(e) => setCreateForm({ ...createForm, maxMonthlyMentions: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white"
                />
              </label>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={creating}
                className="flex-1 rounded-lg bg-indigo-600 py-2 text-sm text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                {creating ? 'Creating…' : 'Create client'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
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

function ClientQuotaRow({
  client,
  saving,
  deleting,
  onSave,
  onDelete,
  onEdit,
}: {
  client: ClientRow;
  saving: boolean;
  deleting: boolean;
  onSave: (tenantId: string, maxBrands: number, maxMonthlyMentions: number) => void;
  onDelete: (client: ClientRow) => void;
  onEdit: (client: ClientRow) => void;
}) {
  const [maxBrands, setMaxBrands] = useState(String(client.maxBrands));
  const [maxMentions, setMaxMentions] = useState(String(client.maxMonthlyMentions));

  return (
    <tr className="border-b border-slate-800/80 hover:bg-slate-900/50">
      <td className="px-4 py-3 font-medium text-white">{client.tenantName}</td>
      <td className="px-4 py-3 text-slate-400">
        <div>{client.ownerEmail ?? '—'}</div>
        <div className="text-xs capitalize text-slate-500">{client.ownerRole ?? 'owner'}</div>
      </td>
      <td className="px-4 py-3 text-slate-300">
        {client.brandsUsed} / {client.maxBrands}
      </td>
      <td className="px-4 py-3 text-slate-300">
        {client.mentionsUsedThisPeriod.toLocaleString()} / {client.maxMonthlyMentions.toLocaleString()}
        <span className="ml-2 text-xs text-slate-500">({client.mentionsRemaining.toLocaleString()} left)</span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-end gap-2">
          <label className="text-xs text-slate-500">
            Brands
            <input
              type="number"
              min={1}
              value={maxBrands}
              onChange={(e) => setMaxBrands(e.target.value)}
              className="mt-1 block w-20 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-white"
            />
          </label>
          <label className="text-xs text-slate-500">
            Mentions/mo
            <input
              type="number"
              min={100}
              step={1000}
              value={maxMentions}
              onChange={(e) => setMaxMentions(e.target.value)}
              className="mt-1 block w-28 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-white"
            />
          </label>
          <button
            type="button"
            disabled={saving}
            onClick={() => onSave(client.tenantId, parseInt(maxBrands, 10), parseInt(maxMentions, 10))}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onEdit(client)}
            className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={() => onDelete(client)}
            className="flex items-center gap-1 rounded-lg border border-red-800 px-3 py-1.5 text-xs text-red-400 hover:bg-red-900/20 disabled:opacity-50"
          >
            <Trash2 className="h-3 w-3" />
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </td>
    </tr>
  );
}
