'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { clearAuthSession, getToken, getWorkspaceId } from '../lib/api';

export function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEmail(localStorage.getItem('braneiq_user_email'));
  }, []);

  useEffect(() => {
    function onPointerDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', onPointerDown);
      return () => document.removeEventListener('mousedown', onPointerDown);
    }
  }, [open]);

  function logout() {
    clearAuthSession();
    setOpen(false);
    router.replace('/login');
  }

  const hasSession = Boolean(getToken() && getWorkspaceId());
  const initial = (email?.[0] ?? 'U').toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg p-1 pr-2 text-slate-300 transition hover:bg-slate-800 hover:text-white"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">
          {initial}
        </div>
        <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-slate-700 bg-slate-900 py-1 shadow-xl"
        >
          <div className="border-b border-slate-800 px-4 py-3">
            <p className="truncate text-sm font-medium text-white">{email ?? 'Signed in'}</p>
            <p className="mt-0.5 text-xs text-slate-400">
              {hasSession ? 'Active session' : 'Session missing — sign in again'}
            </p>
          </div>
          <Link
            href="/settings"
            role="menuitem"
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
            onClick={() => setOpen(false)}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <Link
            href="/team"
            role="menuitem"
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
            onClick={() => setOpen(false)}
          >
            <User className="h-4 w-4" />
            Team
          </Link>
          <button
            type="button"
            role="menuitem"
            onClick={logout}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-300 hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
