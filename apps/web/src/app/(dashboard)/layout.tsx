export const dynamic = 'force-dynamic';

import { DashboardHeader } from '../../components/DashboardHeader';
import { DashboardNav } from '../../components/DashboardNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-800 bg-slate-900">
        <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
            B
          </div>
          <div>
            <p className="text-sm font-semibold text-white">BraneIQ</p>
            <p className="text-xs text-slate-400">Social Listening</p>
          </div>
        </div>
        <DashboardNav />
      </aside>

      <div className="flex flex-1 flex-col pl-64">
        <DashboardHeader />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
