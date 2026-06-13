'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { publicApiFetch, resolvePlatformAdmin, setAuthSession } from '../../../lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [tenantName, setTenantName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await publicApiFetch<{
        accessToken: string;
        workspaceId?: string;
        isPlatformAdmin?: boolean;
      }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, tenantName }),
      });

      let workspaceId = data.workspaceId;
      if (!workspaceId) {
        const workspaces = await publicApiFetch<Array<{ id: string }>>('/workspaces', {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        });
        workspaceId = workspaces[0]?.id;
      }

      if (!workspaceId) {
        throw new Error('Registration succeeded but no workspace was created');
      }

      setAuthSession(
        data.accessToken,
        workspaceId,
        resolvePlatformAdmin({ isPlatformAdmin: data.isPlatformAdmin }),
        email.trim(),
      );
      router.replace('/brands');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Create your BraneIQ account</h1>
          <p className="mt-2 text-slate-400">Start monitoring your brand in minutes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-8">
          {error && (
            <div className="rounded-lg border border-red-800 bg-red-900/20 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300">Company name</label>
            <input
              type="text"
              required
              minLength={2}
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
              placeholder="Acme Corp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
