'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, AlertTriangle, MessageSquare, Globe } from 'lucide-react';
import { apiFetch } from '../../../lib/api';

type Overview = {
  totalMentions: number;
  mentionsByPlatform: Record<string, number>;
  sentimentDistribution: Record<string, number>;
  emotionDistribution: Record<string, number>;
  mentionsOverTime: Array<{ date: string; count: number }>;
  topTopics: Array<{ topic: string; count: number }>;
  crisisCount: number;
  priorityCount: number;
  languageDistribution: Record<string, number>;
  shareOfVoice: Array<{ entity: string; count: number; isCompetitor: boolean }>;
};

export default function IntelligencePage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [topPosts, setTopPosts] = useState<Array<{ mentionId: string; platform: string; authorUsername: string; engagement: number }>>([]);
  const [authors, setAuthors] = useState<Array<{ username: string; count: number }>>([]);
  const [days, setDays] = useState('30');
  const [brandId, setBrandId] = useState('');
  const [brands, setBrands] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Array<{ id: string; name: string }>>('/brands').then(setBrands).catch(() => undefined);
  }, []);

  useEffect(() => {
    const q = new URLSearchParams({ days });
    if (brandId) q.set('brand_id', brandId);
    setLoading(true);
    Promise.all([
      apiFetch<Overview>(`/analytics/overview?${q}`),
      apiFetch<{ posts: typeof topPosts }>(`/analytics/top-posts?${q}`),
      apiFetch<{ authors: typeof authors }>(`/analytics/authors?${q}`),
    ])
      .then(([o, p, a]) => {
        setOverview(o);
        setTopPosts(p.posts);
        setAuthors(a.authors);
      })
      .finally(() => setLoading(false));
  }, [days, brandId]);

  if (loading && !overview) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-800" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-800/50" />)}
        </div>
      </div>
    );
  }

  const o = overview!;
  const maxVolume = Math.max(...o.mentionsOverTime.map((d) => d.count), 1);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Intelligence Dashboard</h1>
          <p className="text-sm text-slate-400">Analytics powered by ClickHouse</p>
        </div>
        <div className="flex gap-2">
          <select value={brandId} onChange={(e) => setBrandId(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white">
            <option value="">All brands</option>
            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          <select value={days} onChange={(e) => setDays(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={MessageSquare} label="Total mentions" value={o.totalMentions.toLocaleString()} />
        <KpiCard icon={AlertTriangle} label="Crisis mentions" value={o.crisisCount.toLocaleString()} accent="text-red-400" />
        <KpiCard icon={TrendingUp} label="Priority mentions" value={o.priorityCount.toLocaleString()} accent="text-amber-400" />
        <KpiCard icon={Globe} label="Platforms" value={String(Object.keys(o.mentionsByPlatform).length)} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Panel title="Mention volume">
          <div className="flex h-40 items-end gap-1">
            {o.mentionsOverTime.map((d) => (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                <div className="w-full rounded-t bg-indigo-600/80" style={{ height: `${(d.count / maxVolume) * 100}%`, minHeight: d.count ? 4 : 0 }} title={`${d.count}`} />
                <span className="text-[10px] text-slate-600">{d.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Sentiment distribution">
          <BarChart data={o.sentimentDistribution} colors={{ positive: 'bg-emerald-500', negative: 'bg-red-500', neutral: 'bg-slate-500', mixed: 'bg-amber-500' }} />
        </Panel>

        <Panel title="Platform breakdown">
          <BarChart data={o.mentionsByPlatform} />
        </Panel>

        <Panel title="Emotion distribution">
          <BarChart data={o.emotionDistribution} />
        </Panel>

        <Panel title="Top topics">
          <ul className="space-y-2">
            {o.topTopics.map((t) => (
              <li key={t.topic} className="flex justify-between text-sm">
                <span className="text-slate-300">{t.topic}</span>
                <span className="text-slate-500">{t.count}</span>
              </li>
            ))}
            {o.topTopics.length === 0 && <li className="text-sm text-slate-500">No topic data yet</li>}
          </ul>
        </Panel>

        <Panel title="Language distribution">
          <BarChart data={o.languageDistribution} />
        </Panel>

        <Panel title="Top authors">
          <ul className="space-y-2">
            {authors.slice(0, 10).map((a) => (
              <li key={a.username} className="flex justify-between text-sm">
                <span className="text-slate-300">@{a.username}</span>
                <span className="text-slate-500">{a.count}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Top posts by engagement">
          <ul className="space-y-2">
            {topPosts.slice(0, 8).map((p) => (
              <li key={p.mentionId} className="flex justify-between text-sm">
                <span className="truncate text-slate-300">@{p.authorUsername} · {p.platform}</span>
                <span className="shrink-0 text-slate-500">{p.engagement}</span>
              </li>
            ))}
          </ul>
        </Panel>

        {o.shareOfVoice.length > 0 && (
          <Panel title="Share of voice">
            <BarChart data={Object.fromEntries(o.shareOfVoice.map((s) => [s.entity, s.count]))} />
          </Panel>
        )}
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, accent = 'text-indigo-400' }: { icon: typeof MessageSquare; label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
      <div className="mb-2 flex items-center gap-2 text-slate-500">
        <Icon size={18} className={accent} />
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
      {children}
    </div>
  );
}

function BarChart({ data, colors }: { data: Record<string, number>; colors?: Record<string, string> }) {
  const max = Math.max(...Object.values(data), 1);
  return (
    <div className="space-y-2">
      {Object.entries(data).map(([key, count]) => (
        <div key={key} className="flex items-center gap-3 text-sm">
          <span className="w-24 shrink-0 capitalize text-slate-400">{key}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
            <div className={`h-full rounded-full ${colors?.[key] ?? 'bg-indigo-500'}`} style={{ width: `${(count / max) * 100}%` }} />
          </div>
          <span className="w-8 text-right text-slate-500">{count}</span>
        </div>
      ))}
      {Object.keys(data).length === 0 && <p className="text-sm text-slate-500">No data</p>}
    </div>
  );
}
