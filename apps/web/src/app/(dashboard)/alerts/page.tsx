export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">BraneIQ Alerts</h1>
          <p className="mt-1 text-slate-400">Real-time monitoring and notification rules</p>
        </div>
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
          Create Rule
        </button>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
        <p className="text-slate-400">No alert rules configured</p>
      </div>
    </div>
  );
}
