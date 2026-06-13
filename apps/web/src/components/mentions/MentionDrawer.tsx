'use client';

import { X, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiFetch } from '../../lib/api';

export type EnrichedMention = {
  mentionId: string;
  platform: string;
  text: string;
  url?: string;
  publishedAt: string;
  author: {
    username: string;
    displayName?: string;
    avatarUrl?: string;
    followersCount?: number;
    verified?: boolean;
    profileUrl?: string;
  };
  engagement: { likes: number; comments: number; shares: number; views?: number };
  enrichment?: {
    sentiment?: string;
    emotion?: string;
    topics?: string[];
    intent?: string;
    language?: string;
    summary?: string;
    priorityScore?: number;
    crisisScore?: number;
  };
  workflow?: {
    status: string;
    internalNote?: string | null;
    assignedTo?: { id: string; email: string; firstName?: string | null } | null;
  };
  tags?: Array<{ id: string; name: string; color: string }>;
  activities?: Array<{
    id: string;
    action: string;
    oldValue?: string;
    newValue?: string;
    note?: string;
    createdAt: string;
    user?: { email: string; firstName?: string };
  }>;
  rawS3Key?: string;
  sourceType?: string;
  brandId?: string;
};

type Props = {
  mentionId: string | null;
  onClose: () => void;
  onUpdated: () => void;
};

const STATUS_OPTIONS = ['new', 'reviewed', 'assigned', 'resolved', 'ignored', 'escalated'];

function Badge({ label, color = 'bg-slate-700 text-slate-200' }: { label: string; color?: string }) {
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>{label}</span>;
}

function sentimentColor(s?: string) {
  if (s === 'positive') return 'bg-emerald-900/60 text-emerald-300';
  if (s === 'negative') return 'bg-red-900/60 text-red-300';
  return 'bg-slate-700 text-slate-300';
}

export function MentionDrawer({ mentionId, onClose, onUpdated }: Props) {
  const [mention, setMention] = useState<EnrichedMention | null>(null);
  const [tags, setTags] = useState<Array<{ id: string; name: string; color: string }>>([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRaw, setShowRaw] = useState(false);

  async function load() {
    if (!mentionId) return;
    setLoading(true);
    try {
      const [m, t] = await Promise.all([
        apiFetch<EnrichedMention>(`/mentions/${mentionId}`),
        apiFetch<Array<{ id: string; name: string; color: string }>>('/mention-tags'),
      ]);
      setMention(m);
      setNote(m.workflow?.internalNote ?? '');
      setTags(t);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (mentionId) {
      setMention(null);
      load();
    }
  }, [mentionId]);

  async function updateStatus(status: string) {
    if (!mention) return;
    await apiFetch(`/mentions/${mention.mentionId}/workflow`, {
      method: 'PATCH',
      body: JSON.stringify({ status, brandId: mention.brandId, internalNote: note }),
    });
    await load();
    onUpdated();
  }

  async function saveNote() {
    if (!mention) return;
    await apiFetch(`/mentions/${mention.mentionId}/workflow`, {
      method: 'PATCH',
      body: JSON.stringify({ internalNote: note, brandId: mention.brandId }),
    });
    onUpdated();
  }

  async function addTag(tagId: string) {
    if (!mention) return;
    await apiFetch(`/mentions/${mention.mentionId}/tags/${tagId}`, { method: 'POST' });
    await load();
    onUpdated();
  }

  if (!mentionId) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
      <div className="flex h-full w-full max-w-xl flex-col border-l border-slate-800 bg-slate-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">Mention Detail</h2>
          <button type="button" onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {loading && !mention && (
          <div className="flex flex-1 items-center justify-center text-slate-400">Loading…</div>
        )}

        {mention && (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
            <section>
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge label={mention.platform} color="bg-indigo-900/60 text-indigo-300" />
                {mention.enrichment?.sentiment && (
                  <Badge label={mention.enrichment.sentiment} color={sentimentColor(mention.enrichment.sentiment)} />
                )}
                {mention.enrichment?.emotion && <Badge label={mention.enrichment.emotion} />}
                <Badge label={mention.workflow?.status ?? 'new'} color="bg-violet-900/60 text-violet-300" />
              </div>
              <p className="text-sm leading-relaxed text-slate-200">{mention.text}</p>
              {mention.url && (
                <a href={mention.url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300">
                  View original <ExternalLink size={12} />
                </a>
              )}
            </section>

            {mention.enrichment?.summary && (
              <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">AI Summary</h3>
                <p className="text-sm text-slate-300">{mention.enrichment.summary}</p>
              </section>
            )}

            <section className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-slate-800 p-3">
                <div className="text-xs text-slate-500">Author</div>
                <div className="font-medium text-white">@{mention.author.username}</div>
                {mention.author.followersCount != null && (
                  <div className="text-xs text-slate-400">{mention.author.followersCount.toLocaleString()} followers</div>
                )}
              </div>
              <div className="rounded-lg border border-slate-800 p-3">
                <div className="text-xs text-slate-500">Engagement</div>
                <div className="text-white">
                  {mention.engagement.likes} likes · {mention.engagement.comments} comments · {mention.engagement.shares} shares
                </div>
              </div>
              <div className="rounded-lg border border-slate-800 p-3">
                <div className="text-xs text-slate-500">Priority</div>
                <div className="text-white">{((mention.enrichment?.priorityScore ?? 0) * 100).toFixed(0)}%</div>
              </div>
              <div className="rounded-lg border border-slate-800 p-3">
                <div className="text-xs text-slate-500">Crisis Score</div>
                <div className="text-white">{((mention.enrichment?.crisisScore ?? 0) * 100).toFixed(0)}%</div>
              </div>
            </section>

            {mention.enrichment?.topics && mention.enrichment.topics.length > 0 && (
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500">Topics</h3>
                <div className="flex flex-wrap gap-1">
                  {mention.enrichment.topics.map((t) => (
                    <Badge key={t} label={t} />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500">Workflow</h3>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => updateStatus(s)}
                    className={`rounded-md px-3 py-1 text-xs capitalize ${
                      mention.workflow?.status === s
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500">Tags</h3>
              <div className="mb-2 flex flex-wrap gap-1">
                {(mention.tags ?? []).map((t) => (
                  <span key={t.id} className="rounded-full px-2 py-0.5 text-xs text-white" style={{ backgroundColor: t.color }}>
                    {t.name}
                  </span>
                ))}
              </div>
              <select
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) addTag(e.target.value);
                  e.target.value = '';
                }}
              >
                <option value="">Add tag…</option>
                {tags.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </section>

            <section>
              <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500">Internal Note</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white"
                placeholder="Add internal note…"
              />
              <button type="button" onClick={saveNote} className="mt-2 rounded-md bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-500">
                Save note
              </button>
            </section>

            {mention.activities && mention.activities.length > 0 && (
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase text-slate-500">Activity</h3>
                <ul className="space-y-2 text-xs text-slate-400">
                  {mention.activities.map((a) => (
                    <li key={a.id} className="rounded border border-slate-800 px-3 py-2">
                      <span className="text-slate-300">{a.action}</span>
                      {a.newValue && <span> → {a.newValue}</span>}
                      <div className="text-slate-600">{new Date(a.createdAt).toLocaleString()}</div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section>
              <button type="button" onClick={() => setShowRaw(!showRaw)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300">
                Raw metadata {showRaw ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {showRaw && (
                <pre className="mt-2 max-h-40 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-400">
                  {JSON.stringify({ sourceType: mention.sourceType, rawS3Key: mention.rawS3Key, publishedAt: mention.publishedAt }, null, 2)}
                </pre>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
