/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  LayoutDashboard, 
  FolderOpen, 
  FileSpreadsheet, 
  BookOpen, 
  User, 
  LogOut,
  PenTool,
  Bookmark
} from 'lucide-react';
import { UserSession } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  session: UserSession;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, session, onLogout }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assets', label: 'Assets', icon: FolderOpen },
    { id: 'composition', label: 'Composition', icon: PenTool },
    { id: 'review', label: 'Review', icon: Bookmark },
    { id: 'library', label: 'Library', icon: BookOpen },
  ];

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 z-40 bg-white/70 backdrop-blur-md border-r border-outline-variant/30 flex flex-col p-4 gap-2 transition-all">
      {/* Brand Header */}
      <div className="mb-8 px-2">
        <h1 className="font-display-lg text-2xl font-bold text-primary tracking-tight">MangaFlow</h1>
        <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider opacity-70">
          Pro Workspace
        </p>
      </div>

      {/* Navigation Options */}
      <nav className="flex-1 flex flex-col gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:translate-x-1 ${
                isActive
                  ? 'bg-primary-container text-on-primary-container shadow-sm font-bold scale-[1.02]'
                  : 'text-on-surface-variant hover:bg-surface-container-high/50'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-primary' : 'text-on-surface-variant'} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Profile & Logout Action */}
      <div className="mt-auto pt-4 border-t border-outline-variant/30 flex flex-col gap-1.5">
        <div className="flex items-center gap-3 px-3 py-2 text-on-surface-variant rounded-xl">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
            {session.firstName ? `${session.firstName[0]}${session.lastName?.[0] || ''}` : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-on-surface truncate">
              {session.firstName ? `${session.firstName} ${session.lastName}` : 'Guest User'}
            </p>
            <p className="text-[10px] text-on-surface-variant truncate">{session.email}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-on-surface-variant hover:bg-error-container/20 hover:text-error transition-all"
        >
          <LogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
