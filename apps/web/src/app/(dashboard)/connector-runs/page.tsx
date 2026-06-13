'use client';

import { useState } from 'react';
import { History, CheckCircle, XCircle, Loader } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/v1';

type Run = {
  id: string;
  platform: string;
  status: string;
  fetchedCount: number;
  publishedCount: number;
  skippedCount: number;
  dryRun: boolean;
  errorMessage?: string;
  startedAt: string;
  finishedAt?: string;
};

const STATUS_ICON: Record<string, typeof CheckCircle> = {
  completed: CheckCircle,
  failed: XCircle,
  running: Loader,
};

const STATUS_COLOR: Record<string, string> = {
  completed: 'text-green-400',
  failed: 'text-red-400',
  running: 'text-yellow-400',
  pending: 'text-slate-400',
  skipped: 'text-slate-400',
};

export default function ConnectorRunsPage() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('braneiq_token') : null;
  const workspaceId = typeof window !== 'undefined' ? localStorage.getItem('braneiq_workspace') : null;

  async function load() {
    if (!token || !workspaceId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/connector-runs`, {
        headers: { Authorization: `Bearer ${token}`, 'X-Workspace-Id': workspaceId },
      });
      if (res.ok) setRuns(await res.json());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Connector Run History</h1>
        <p className="mt-1 text-slate-400">Track fetch jobs and their results</p>
      </div>

      <button onClick={load} className="text-sm text-indigo-400 hover:text-indigo-300">
        {loading ? 'Loading...' : 'Refresh runs'}
      </button>

      <div className="overflow-hidden rounded-xl border border-slate-800">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-800 bg-slate-900">
            <tr className="text-left text-slate-400">
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Platform</th>
              <th className="px-4 py-3">Fetched</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Dry Run</th>
              <th className="px-4 py-3">Started</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => {
              const Icon = STATUS_ICON[run.status] ?? History;
              return (
                <tr key={run.id} className="border-b border-slate-800/50 bg-slate-950">
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1.5 capitalize ${STATUS_COLOR[run.status] ?? 'text-slate-400'}`}>
                      <Icon className="h-4 w-4" /> {run.status}
                    </span>
                    {run.errorMessage && <p className="mt-1 text-xs text-red-400">{run.errorMessage}</p>}
                  </td>
                  <td className="px-4 py-3 capitalize text-white">{run.platform}</td>
                  <td className="px-4 py-3 text-slate-300">{run.fetchedCount}</td>
                  <td className="px-4 py-3 text-slate-300">{run.publishedCount}</td>
                  <td className="px-4 py-3 text-slate-400">{run.dryRun ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-3 text-slate-400">{new Date(run.startedAt).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!runs.length && !loading && (
          <div className="p-12 text-center text-slate-500">No connector runs yet</div>
        )}
      </div>
    </div>
  );
}
