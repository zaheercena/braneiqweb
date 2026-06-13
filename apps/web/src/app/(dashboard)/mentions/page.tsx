'use client';

import { useCallback, useEffect, useState } from 'react';
import { Search, Filter, Download, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import { apiFetch } from '../../../lib/api';
import { MentionDrawer, type EnrichedMention } from '../../../components/mentions/MentionDrawer';

type SearchResult = {
  mentions: EnrichedMention[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  aggregations?: {
    platforms?: Record<string, number>;
    sentiments?: Record<string, number>;
    statuses?: Record<string, number>;
  };
};

type Brand = { id: string; name: string };
type SavedView = { id: string; name: string; filtersJson: Record<string, unknown>; sortJson: Record<string, unknown> };

const PLATFORMS = ['twitter', 'reddit', 'facebook', 'instagram', 'youtube', 'linkedin', 'tiktok'];
const SENTIMENTS = ['positive', 'neutral', 'negative', 'mixed'];
const STATUSES = ['new', 'reviewed', 'assigned', 'resolved', 'ignored', 'escalated'];

type MentionFilters = {
  q: string;
  platform: string;
  sentiment: string;
  status: string;
  brandId: string;
  sort: string;
  dateFrom: string;
  dateTo: string;
  priorityMin: string;
  crisisMin: string;
};

const emptyFilters: MentionFilters = {
  q: '',
  platform: '',
  sentiment: '',
  status: '',
  brandId: '',
  sort: 'newest',
  dateFrom: '',
  dateTo: '',
  priorityMin: '',
  crisisMin: '',
};

function buildQueryFromFilters(filters: MentionFilters, page: number, limit: number) {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.platform) params.set('platform', filters.platform);
  if (filters.sentiment) params.set('sentiment', filters.sentiment);
  if (filters.status) params.set('status', filters.status);
  if (filters.brandId) params.set('brand_id', filters.brandId);
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.dateFrom) params.set('date_from', filters.dateFrom);
  if (filters.dateTo) params.set('date_to', filters.dateTo);
  if (filters.priorityMin) params.set('priority_min', filters.priorityMin);
  if (filters.crisisMin) params.set('crisis_min', filters.crisisMin);
  params.set('page', String(page));
  params.set('limit', String(limit));
  return params.toString();
}

function countActiveFilters(filters: MentionFilters) {
  return [
    filters.q,
    filters.platform,
    filters.sentiment,
    filters.status,
    filters.brandId,
    filters.dateFrom,
    filters.dateTo,
    filters.priorityMin,
    filters.crisisMin,
  ].filter(Boolean).length;
}

export default function MentionsPage() {
  const [mentions, setMentions] = useState<EnrichedMention[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [filtersDirty, setFiltersDirty] = useState(false);

  const [draft, setDraft] = useState<MentionFilters>(emptyFilters);
  const [applied, setApplied] = useState<MentionFilters>(emptyFilters);

  const limit = 25;

  const loadMentions = useCallback(async () => {
    setLoading(true);
    try {
      const query = buildQueryFromFilters(applied, page, limit);
      const data = await apiFetch<SearchResult>(`/mentions?${query}`);
      setMentions(data.mentions);
      setTotal(data.total);
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Failed to load mentions');
    } finally {
      setLoading(false);
    }
  }, [applied, page, limit]);

  useEffect(() => {
    loadMentions();
  }, [loadMentions]);

  function patchDraft(patch: Partial<MentionFilters>) {
    setDraft((prev) => ({ ...prev, ...patch }));
    setFiltersDirty(true);
  }

  function applyFilters() {
    setApplied({ ...draft });
    setPage(1);
    setFiltersDirty(false);
  }

  function clearFilters() {
    setDraft(emptyFilters);
    setApplied(emptyFilters);
    setPage(1);
    setFiltersDirty(false);
  }

  useEffect(() => {
    apiFetch<Brand[]>('/brands').then(setBrands).catch(() => undefined);
    apiFetch<SavedView[]>('/saved-views?view_type=mentions').then(setSavedViews).catch(() => undefined);
  }, []);

  async function exportCsv() {
    try {
      const job = await apiFetch<{ id: string }>('/mentions/export', {
        method: 'POST',
        body: JSON.stringify({
          filters: {
            q: applied.q,
            platform: applied.platform,
            sentiment: applied.sentiment,
            status: applied.status,
            brand_id: applied.brandId,
            sort: applied.sort,
            date_from: applied.dateFrom,
            date_to: applied.dateTo,
          },
        }),
      });
      setToast(`Export started (${job.id.slice(0, 8)}…)`);
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Export failed');
    }
  }

  async function saveView() {
    const name = prompt('Saved view name');
    if (!name) return;
    await apiFetch('/saved-views', {
      method: 'POST',
      body: JSON.stringify({
        name,
        viewType: 'mentions',
        filtersJson: {
          q: applied.q,
          platform: applied.platform,
          sentiment: applied.sentiment,
          status: applied.status,
          brandId: applied.brandId,
          dateFrom: applied.dateFrom,
          dateTo: applied.dateTo,
          priorityMin: applied.priorityMin,
          crisisMin: applied.crisisMin,
        },
        sortJson: { sort: applied.sort },
      }),
    });
    setToast('View saved');
    const views = await apiFetch<SavedView[]>('/saved-views?view_type=mentions');
    setSavedViews(views);
  }

  function loadView(view: SavedView) {
    const f = view.filtersJson as Record<string, string>;
    const next: MentionFilters = {
      q: f.q ?? '',
      platform: f.platform ?? '',
      sentiment: f.sentiment ?? '',
      status: f.status ?? '',
      brandId: f.brandId ?? '',
      dateFrom: f.dateFrom ?? '',
      dateTo: f.dateTo ?? '',
      priorityMin: f.priorityMin ?? '',
      crisisMin: f.crisisMin ?? '',
      sort: (view.sortJson as { sort?: string })?.sort ?? 'newest',
    };
    setDraft(next);
    setApplied(next);
    setPage(1);
    setFiltersDirty(false);
  }

  const activeFilterCount = countActiveFilters(applied);
  const brandName = brands.find((b) => b.id === applied.brandId)?.name;

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="border-b border-slate-800 px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Mentions Inbox</h1>
            <p className="text-sm text-slate-400">{total.toLocaleString()} mentions</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">
              <Filter size={16} /> Filters
            </button>
            <button type="button" onClick={saveView} className="flex items-center gap-1 rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">
              <Bookmark size={16} /> Save view
            </button>
            <button type="button" onClick={exportCsv} className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white hover:bg-indigo-500">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <input
              value={draft.q}
              onChange={(e) => patchDraft({ q: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  applyFilters();
                }
              }}
              placeholder="Search mentions…"
              className="w-full rounded-lg border border-slate-700 bg-slate-900 py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500"
            />
          </div>
          <select
            value={draft.sort}
            onChange={(e) => patchDraft({ sort: e.target.value })}
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-white"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priority">Highest priority</option>
            <option value="crisis">Highest crisis</option>
            <option value="engagement">Highest engagement</option>
          </select>
        </div>

        {savedViews.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {savedViews.map((v) => (
              <button key={v.id} type="button" onClick={() => loadView(v)} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300 hover:bg-slate-700">
                {v.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {showFilters && (
          <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800">
            <div className="flex-1 space-y-4 overflow-y-auto p-4">
              <FilterSelect label="Brand" value={draft.brandId} onChange={(v) => patchDraft({ brandId: v })} options={brands.map((b) => ({ value: b.id, label: b.name }))} />
              <FilterSelect label="Platform" value={draft.platform} onChange={(v) => patchDraft({ platform: v })} options={PLATFORMS.map((p) => ({ value: p, label: p }))} />
              <FilterSelect label="Sentiment" value={draft.sentiment} onChange={(v) => patchDraft({ sentiment: v })} options={SENTIMENTS.map((s) => ({ value: s, label: s }))} />
              <FilterSelect label="Status" value={draft.status} onChange={(v) => patchDraft({ status: v })} options={STATUSES.map((s) => ({ value: s, label: s }))} />
              <div>
                <label className="mb-1 block text-xs text-slate-500">Date from</label>
                <input type="date" value={draft.dateFrom} onChange={(e) => patchDraft({ dateFrom: e.target.value })} className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-white" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Date to</label>
                <input type="date" value={draft.dateTo} onChange={(e) => patchDraft({ dateTo: e.target.value })} className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-white" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Min priority (0–1)</label>
                <input type="number" step="0.1" min="0" max="1" value={draft.priorityMin} onChange={(e) => patchDraft({ priorityMin: e.target.value })} className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-white" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Min crisis (0–1)</label>
                <input type="number" step="0.1" min="0" max="1" value={draft.crisisMin} onChange={(e) => patchDraft({ crisisMin: e.target.value })} className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-sm text-white" />
              </div>
            </div>
            <div className="space-y-2 border-t border-slate-800 p-4">
              {filtersDirty && (
                <p className="text-xs text-amber-400">Filters changed — click Apply to update results.</p>
              )}
              <button
                type="button"
                onClick={applyFilters}
                className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Apply filters
              </button>
              <button
                type="button"
                onClick={clearFilters}
                className="w-full rounded-lg border border-slate-700 py-2 text-sm text-slate-300 hover:bg-slate-800"
              >
                Clear all
              </button>
            </div>
          </aside>
        )}

        <main className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="space-y-3 p-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-800/50" />
              ))}
            </div>
          ) : mentions.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-slate-500">
              <p className="text-lg">No mentions found</p>
              {activeFilterCount > 0 ? (
                <p className="max-w-md text-sm">
                  {activeFilterCount} filter{activeFilterCount === 1 ? '' : 's'} applied
                  {brandName ? ` for ${brandName}` : ''}
                  {applied.dateFrom || applied.dateTo
                    ? ` (${applied.dateFrom || '…'} → ${applied.dateTo || '…'})`
                    : ''}
                  . No indexed mentions match — ingest data via Integrations → Connector Rules, or use a test ingest.
                </p>
              ) : (
                <p className="text-sm">Set filters and click Apply, or run a connector to ingest data.</p>
              )}
            </div>
          ) : (
            <ul className="divide-y divide-slate-800">
              {mentions.map((m) => (
                <li key={m.mentionId}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(m.mentionId)}
                    className="w-full px-6 py-4 text-left hover:bg-slate-900/60"
                  >
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium uppercase text-indigo-400">{m.platform}</span>
                      <span className="text-xs text-slate-500">@{m.author.username}</span>
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs capitalize text-slate-400">{m.workflow?.status ?? 'new'}</span>
                      {m.enrichment?.sentiment && (
                        <span className={`rounded-full px-2 py-0.5 text-xs capitalize ${
                          m.enrichment.sentiment === 'positive' ? 'bg-emerald-900/50 text-emerald-300' :
                          m.enrichment.sentiment === 'negative' ? 'bg-red-900/50 text-red-300' : 'bg-slate-800 text-slate-400'
                        }`}>{m.enrichment.sentiment}</span>
                      )}
                    </div>
                    <p className="line-clamp-2 text-sm text-slate-200">{m.text}</p>
                    <div className="mt-2 flex gap-4 text-xs text-slate-500">
                      <span>{new Date(m.publishedAt).toLocaleString()}</span>
                      <span>{m.engagement.likes + m.engagement.comments + m.engagement.shares} engagement</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!loading && mentions.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-800 px-6 py-3">
              <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="flex items-center gap-1 text-sm text-slate-400 disabled:opacity-40">
                <ChevronLeft size={16} /> Previous
              </button>
              <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
              <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="flex items-center gap-1 text-sm text-slate-400 disabled:opacity-40">
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </main>
      </div>

      <MentionDrawer mentionId={selectedId} onClose={() => setSelectedId(null)} onUpdated={loadMentions} />

      {toast && (
        <div className="fixed bottom-4 right-4 rounded-lg bg-slate-800 px-4 py-2 text-sm text-white shadow-lg" onAnimationEnd={() => setToast(null)}>
          {toast}
        </div>
      )}
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-slate-500">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-white">
        <option value="">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
