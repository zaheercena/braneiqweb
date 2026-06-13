import { Activity, AlertTriangle, MessageSquare, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Total Mentions', value: '—', change: 'Connect data sources', icon: MessageSquare },
  { label: 'Sentiment Score', value: '—', change: 'Awaiting enrichment', icon: TrendingUp },
  { label: 'Active Alerts', value: '0', change: 'No rules configured', icon: AlertTriangle },
  { label: 'Volume Spikes', value: '0', change: 'Monitoring inactive', icon: Activity },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">BraneIQ Overview</h1>
        <p className="mt-1 text-slate-400">Ultimate brand visibility powered by AI.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-slate-800 bg-slate-900 p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-400">{stat.label}</p>
              <stat.icon className="h-5 w-5 text-indigo-400" />
            </div>
            <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
            <p className="mt-1 text-xs text-slate-500">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-white">Mention Volume</h2>
          <p className="mt-1 text-sm text-slate-400">Last 7 days</p>
          <div className="mt-8 flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-700">
            <p className="text-sm text-slate-500">Chart renders when ClickHouse has data</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-white">Sentiment Distribution</h2>
          <p className="mt-1 text-sm text-slate-400">Current period</p>
          <div className="mt-8 flex h-48 items-center justify-center rounded-lg border border-dashed border-slate-700">
            <p className="text-sm text-slate-500">BraneIQ Intelligence analytics pending</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-white">Trending Topics</h2>
          <p className="mt-4 text-sm text-slate-500">No topics detected yet</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-lg font-semibold text-white">Recent Alerts</h2>
          <p className="mt-4 text-sm text-slate-500">No alerts triggered</p>
        </div>
      </div>
    </div>
  );
}
