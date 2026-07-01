/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Sparkles, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Bookmark, 
  ArrowRight, 
  Users, 
  MessageSquare, 
  PenTool,
  BookmarkCheck,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { Project, Task, MangaPage, UserSession } from '../types';

interface DashboardViewProps {
  session: UserSession;
  projects: Project[];
  tasks: Task[];
  pages: MangaPage[];
  onSelectProject: (project: Project, tabRedirect: string) => void;
  onNavigateTab: (tabId: string) => void;
  onUpdateTaskColumn: (taskId: string, direction: 'prev' | 'next' | 'direct', newCol?: Task['column']) => void;
}

export default function DashboardView({ 
  session, 
  projects, 
  tasks, 
  pages, 
  onSelectProject, 
  onNavigateTab,
  onUpdateTaskColumn
}: DashboardViewProps) {
  const pendingTasks = tasks.filter(t => t.column !== 'DONE');
  const reviewCount = pages.filter(p => p.status === 'Pending').length;

  const handleQuickRead = () => {
    // Pick first project, redirect to Reader
    const firstProj = projects[0] || null;
    if (firstProj) {
      onSelectProject(firstProj, 'reader');
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* Welcome Hero Banner Banner */}
      <section className="bg-gradient-to-r from-[#006686]/10 to-[#7dd3fc]/20 rounded-[28px] p-6 md:p-8 border border-[#006686]/15 long-soft-shadow relative overflow-hidden">
        {/* Floating background design */}
        <div className="absolute right-[-20px] bottom-[-20px] text-[#006686]/5 pointer-events-none transform rotate-[15deg]">
          <BookOpen size={240} />
        </div>

        <div className="relative space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
            <Sparkles size={12} />
            <span>Studio Workspace Live</span>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface leading-tight">
              Welcome, {session.firstName || 'Minh Phương'}!
            </h2>
            <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
              You have <span className="font-bold text-primary">{pendingTasks.length} active tasks</span> to coordinate today. The review team has flagged <span className="font-bold text-secondary">{reviewCount} pages</span> awaiting editor approval.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('library')}
              className="bg-primary text-on-primary text-xs font-bold px-4 py-2.5 rounded-xl hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Go to Library
              <ArrowRight size={14} />
            </button>
            <button
              onClick={handleQuickRead}
              className="bg-white text-primary border border-outline-variant/30 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-surface-container-low transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Start Reader Mode
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-outline-variant/15 long-soft-shadow flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Active Projects</span>
            <p className="text-2xl font-extrabold text-on-surface">{projects.length}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <BookOpen size={18} />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-outline-variant/15 long-soft-shadow flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Pending tasks</span>
            <p className="text-2xl font-extrabold text-on-surface">{pendingTasks.length}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700">
            <PenTool size={18} />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-outline-variant/15 long-soft-shadow flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Awaiting reviews</span>
            <p className="text-2xl font-extrabold text-on-surface">{reviewCount}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-700">
            <BookmarkCheck size={18} />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-outline-variant/15 long-soft-shadow flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Monthly Views</span>
            <p className="text-2xl font-extrabold text-on-surface">3.2k</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
            <Users size={18} />
          </div>
        </div>

      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recent Projects + Tasks */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Recent projects shortcuts */}
          <div className="bg-white rounded-[24px] p-6 border border-outline-variant/15 long-soft-shadow space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-on-surface text-base">Recent Workspaces</h3>
              <button 
                onClick={() => onNavigateTab('library')}
                className="text-xs font-bold text-primary hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1"
              >
                View all projects <ArrowRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.slice(0, 2).map((proj) => (
                <div 
                  key={proj.id}
                  className="p-4 border border-outline-variant/15 rounded-xl hover:border-primary/20 hover:shadow-sm transition-all cursor-pointer flex items-center gap-4 bg-surface-container-lowest"
                  onClick={() => onSelectProject(proj, 'composition')}
                >
                  <img 
                    src={proj.imageUrl} 
                    alt={proj.name} 
                    className="w-12 h-16 object-cover rounded-lg bg-surface-container" 
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-on-surface text-sm truncate">{proj.name}</h4>
                    <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">{proj.description}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary-container/30 text-primary">
                      {proj.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending task summary panel */}
          <div className="bg-white rounded-[24px] p-6 border border-outline-variant/15 long-soft-shadow space-y-4">
            <h3 className="font-bold text-on-surface text-base">Your Active Tasks</h3>
            
            <div className="divide-y divide-outline-variant/10">
              {pendingTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-[8px] font-extrabold text-on-surface-variant uppercase tracking-wider">
                        {task.tag}
                      </span>
                      <span className="text-[10px] font-bold text-on-surface-variant">{task.dueDate}</span>
                    </div>
                    <h4 className="font-bold text-on-surface text-sm mt-1 truncate">{task.title}</h4>
                  </div>

                  <button
                    onClick={() => onUpdateTaskColumn(task.id, 'next')}
                    className="bg-primary/5 text-primary hover:bg-primary hover:text-on-primary text-xs font-bold py-1.5 px-3 rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                  >
                    Move to Next <ChevronRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Feed log & Analytics overview */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Live Studio Feed timeline */}
          <div className="bg-white rounded-[24px] p-6 border border-outline-variant/15 long-soft-shadow space-y-4">
            <h3 className="font-bold text-on-surface text-base">Live Studio Feed</h3>
            
            <div className="space-y-4 relative before:absolute before:inset-y-1 before:left-3.5 before:w-0.5 before:bg-outline-variant/20">
              
              {/* Log entry 1 */}
              <div className="flex gap-3 relative z-10">
                <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-[10px]">
                  MS
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-on-surface leading-tight">
                    <span className="font-bold">Mika Sato</span> submitted Page 04 draft.
                  </p>
                  <span className="text-[10px] text-on-surface-variant">2 hours ago</span>
                </div>
              </div>

              {/* Log entry 2 */}
              <div className="flex gap-3 relative z-10">
                <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-[10px]">
                  KH
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-on-surface leading-tight">
                    <span className="font-bold">Kaito Hoshino</span> approved Page 02 ininking final.
                  </p>
                  <span className="text-[10px] text-on-surface-variant">4 hours ago</span>
                </div>
              </div>

              {/* Log entry 3 */}
              <div className="flex gap-3 relative z-10">
                <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-[10px]">
                  JT
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-on-surface leading-tight">
                    <span className="font-bold">Jun Tanaka</span> requested revision on Page 03 lighting.
                  </p>
                  <span className="text-[10px] text-on-surface-variant">Yesterday</span>
                </div>
              </div>

            </div>
          </div>

          {/* Quick Stats Widget */}
          <div className="bg-white rounded-[24px] p-6 border border-outline-variant/15 long-soft-shadow space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold">
              <TrendingUp size={16} />
              <h3 className="font-bold text-on-surface text-sm">Monthly Growth</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-on-surface-variant">
                <span>Direct Views</span>
                <span className="font-bold text-on-surface">+24%</span>
              </div>
              <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[65%] rounded-full"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-on-surface-variant">
                <span>Bookmarks Saved</span>
                <span className="font-bold text-on-surface">+18%</span>
              </div>
              <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                <div className="bg-secondary h-full w-[52%] rounded-full"></div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
