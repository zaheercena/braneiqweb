'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  hasPlatformAdminFromToken,
  publicApiFetch,
  resolvePlatformAdmin,
  setAuthSession,
} from '../../../lib/api';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionExpired = searchParams.get('session') === 'expired';
  const nextPath = searchParams.get('next');
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
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      let workspaceId = data.workspaceId;
      if (!workspaceId) {
        const workspaces = await publicApiFetch<Array<{ id: string }>>('/workspaces', {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        });
        workspaceId = workspaces[0]?.id;
      }

      if (!workspaceId) {
        throw new Error('No workspace found for this account');
      }

      const jwtAdmin = hasPlatformAdminFromToken(data.accessToken);
      setAuthSession(data.accessToken, workspaceId, data.isPlatformAdmin ?? jwtAdmin, email.trim());

      // Confirm admin flag from profile (API may omit it on older builds)
      try {
        const profile = await publicApiFetch<{ isPlatformAdmin?: boolean; email: string }>('/auth/me', {
          headers: { Authorization: `Bearer ${data.accessToken}` },
        });
        const isAdmin = resolvePlatformAdmin(profile);
        setAuthSession(data.accessToken, workspaceId, isAdmin, profile.email);
      } catch {
        if (jwtAdmin) {
          setAuthSession(data.accessToken, workspaceId, true, email.trim());
        }
      }

      const isAdmin = resolvePlatformAdmin();
      const fallback = isAdmin ? '/admin' : '/brands';
      const dest =
        nextPath && nextPath.startsWith('/') && !nextPath.startsWith('//') ? nextPath : fallback;
      router.replace(dest);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
            B
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">BraneIQ Social Listening</h1>
          <p className="mt-2 text-slate-400">Ultimate brand visibility powered by AI.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900 p-8">
          {sessionExpired && !error && (
            <div className="rounded-lg border border-amber-800 bg-amber-900/20 px-3 py-2 text-sm text-amber-200">
              Your session expired. Please sign in again.
            </div>
          )}
          {error && (
            <div className="rounded-lg border border-red-800 bg-red-900/20 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2 text-white focus:border-indigo-500 focus:outline-none"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300">Password</label>
            <input
              type="password"
              required
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
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <p className="text-center text-sm text-slate-400">
            No account?{' '}
            <Link href="/register" className="text-indigo-400 hover:text-indigo-300">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
          Loading…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
