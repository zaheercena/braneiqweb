'use client';

import { Bell } from 'lucide-react';
import { UserMenu } from './UserMenu';

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-8 backdrop-blur">
      <p className="text-sm text-slate-400">Default Workspace</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <UserMenu />
      </div>
    </header>
  );
}
