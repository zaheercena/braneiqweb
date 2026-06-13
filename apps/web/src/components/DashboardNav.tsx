'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  FileText,
  Hash,
  LayoutDashboard,
  MessageSquare,
  Radio,
  Settings,
  Shield,
  Users,
  Zap,
} from 'lucide-react';
import { usePlatformAdmin } from '../hooks/usePlatformAdmin';

const clientNav = [
  { name: 'Overview', href: '/', icon: LayoutDashboard },
  { name: 'BraneIQ Mentions', href: '/mentions', icon: MessageSquare },
  { name: 'BraneIQ Intelligence', href: '/intelligence', icon: BarChart3 },
  { name: 'BraneIQ Signals', href: '/signals', icon: Activity },
  { name: 'BraneIQ Alerts', href: '/alerts', icon: Bell },
  { name: 'BraneIQ Reports', href: '/reports', icon: FileText },
  { name: 'Brands', href: '/brands', icon: Zap },
  { name: 'Competitors', href: '/competitors', icon: Users },
  { name: 'Keywords', href: '/keywords', icon: Hash },
  { name: 'Integrations', href: '/integrations', icon: Radio },
  { name: 'Connector Rules', href: '/connector-rules', icon: Hash },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();
  const { isPlatformAdmin: admin, loading } = usePlatformAdmin();

  return (
    <nav className="space-y-1 p-4">
      {admin && (
        <div className="mb-3 rounded-lg border border-indigo-500/30 bg-indigo-600/10 p-2">
          <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-300">
            Platform Admin
          </p>
          <Link
            href="/admin"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
              pathname.startsWith('/admin')
                ? 'bg-indigo-600 text-white'
                : 'text-indigo-200 hover:bg-indigo-600/30 hover:text-white'
            }`}
          >
            <Shield className="h-4 w-4 shrink-0" />
            Clients (CRUD)
          </Link>
        </div>
      )}

      {clientNav.map((item) => {
        const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
              active
                ? 'bg-indigo-600/20 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
