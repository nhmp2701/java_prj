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
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { AppUser, Project, Task, MangaPage, UserSession } from '../types';

interface DashboardViewProps {
  session: UserSession;
  projects: Project[];
  tasks: Task[];
  pages: MangaPage[];
  users?: AppUser[];
  onSelectProject: (project: Project, tabRedirect: string) => void;
  onNavigateTab: (tabId: string) => void;
  onUpdateTaskColumn: (taskId: string, direction: 'prev' | 'next' | 'direct', newCol?: Task['column']) => void;
}

export default function DashboardView({ 
  session, 
  projects, 
  tasks, 
  pages, 
  users = [],
  onSelectProject, 
  onNavigateTab,
  onUpdateTaskColumn
}: DashboardViewProps) {
  const pendingTasks = tasks.filter(t => t.column !== 'DONE');
  const reviewCount = pages.filter(p => p.status === 'Pending').length;
  const isAdmin = (session.role || '').toUpperCase() === 'ADMIN';
  const staffCount = users.filter((user) => user.role !== 'READER').length;
  const readerUserCount = users.filter((user) => user.role === 'READER').length;

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
            <span>Studio Live Workspace</span>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl md:text-3xl font-extrabold text-on-surface leading-tight">
              Chào mừng trở lại, {session.firstName || 'Minh Phương'}!
            </h2>
            <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
              Bạn đang có <span className="font-bold text-primary">{pendingTasks.length} công việc cần xử lý</span> hôm nay. Đội ngũ đánh giá đã đánh dấu <span className="font-bold text-secondary">{reviewCount} trang vẽ</span> đang chờ tổng biên tập duyệt duyệt.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => onNavigateTab('library')}
              className="bg-primary text-on-primary text-xs font-bold px-4 py-2.5 rounded-xl hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Đến Thư viện Dự án
              <ArrowRight size={14} />
            </button>
            <button
              onClick={handleQuickRead}
              className="bg-white text-primary border border-outline-variant/30 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-surface-container-low transition-all flex items-center gap-1.5 cursor-pointer"
            >
              Vào chế độ Đọc truyện
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-outline-variant/15 long-soft-shadow flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Dự án đang chạy</span>
            <p className="text-2xl font-extrabold text-on-surface">{projects.length}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <BookOpen size={18} />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-outline-variant/15 long-soft-shadow flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Công việc chờ xử lý</span>
            <p className="text-2xl font-extrabold text-on-surface">{pendingTasks.length}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-700">
            <PenTool size={18} />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-outline-variant/15 long-soft-shadow flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Bản vẽ chờ duyệt</span>
            <p className="text-2xl font-extrabold text-on-surface">{reviewCount}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-700">
            <BookmarkCheck size={18} />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-outline-variant/15 long-soft-shadow flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Chương đã duyệt</span>
            <p className="text-2xl font-extrabold text-on-surface">{tasks.filter(t => t.column === 'DONE').length}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
            <Users size={18} />
          </div>
        </div>

      </section>

      {isAdmin && (
        <section className="bg-white rounded-[24px] p-6 border border-outline-variant/15 long-soft-shadow space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="font-bold text-on-surface text-base">Quản lý người dùng</h3>
                <p className="text-xs text-on-surface-variant font-medium">
                  Theo dõi tài khoản và phân quyền đang có trong hệ thống.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="px-4 py-2 rounded-xl bg-surface-container-low">
                <p className="text-lg font-extrabold text-on-surface">{users.length}</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">Tổng user</p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-primary/5">
                <p className="text-lg font-extrabold text-primary">{staffCount}</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">Staff</p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-green-50">
                <p className="text-lg font-extrabold text-green-700">{readerUserCount}</p>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase">Reader</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-outline-variant/15 rounded-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-right">Quyền chính</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-xs font-semibold text-on-surface-variant">
                      Chưa tải được danh sách user hoặc tài khoản hiện tại không có quyền ADMIN.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="text-sm hover:bg-surface-container-low/30 transition-colors">
                      <td className="py-3 px-4 font-bold text-on-surface">{user.username || "Unnamed"}</td>
                      <td className="py-3 px-4 text-on-surface-variant">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-xs font-semibold text-on-surface-variant">
                        {user.role === "ADMIN"
                          ? "Toàn quyền"
                          : user.role === "TEAM_LEAD"
                          ? "Quản lý project/publish"
                          : user.role === "CREATOR"
                          ? "Tạo chapter/task/asset"
                          : user.role === "EDITOR"
                          ? "Duyệt nội dung/asset"
                          : "Đọc truyện public"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recent Projects + Tasks */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Recent projects shortcuts */}
          <div className="bg-white rounded-[24px] p-6 border border-outline-variant/15 long-soft-shadow space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-on-surface text-base">Không gian dự án gần đây</h3>
              <button 
                onClick={() => onNavigateTab('library')}
                className="text-xs font-bold text-primary hover:underline bg-transparent border-none cursor-pointer flex items-center gap-1"
              >
                Xem tất cả dự án <ArrowRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.length === 0 ? (
                <div className="col-span-2 text-center py-8 text-on-surface-variant text-xs font-semibold">
                  Chưa có dự án nào. Hãy tạo dự án đầu tiên tại mục "Thư viện dự án".
                </div>
              ) : (
                projects.slice(0, 2).map((proj) => (
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
                        {proj.status === 'PLANNING' ? 'Lên kế hoạch' : proj.status === 'IN_PROGRESS' ? 'Đang thực hiện' : 'Đã hoàn thành'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending task summary panel */}
          <div className="bg-white rounded-[24px] p-6 border border-outline-variant/15 long-soft-shadow space-y-4">
            <h3 className="font-bold text-on-surface text-base">Nhiệm vụ của bạn</h3>
            
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
                    Chuyển tiếp <ChevronRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Feed log & Analytics overview */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Live Studio Feed timeline — show recent tasks as activity */}
          <div className="bg-white rounded-[24px] p-6 border border-outline-variant/15 long-soft-shadow space-y-4">
            <h3 className="font-bold text-on-surface text-base">Hoạt động gần đây</h3>
            
            {tasks.length === 0 ? (
              <div className="text-center py-6 text-on-surface-variant text-xs font-semibold">
                Chưa có hoạt động nào được ghi nhận.
              </div>
            ) : (
              <div className="space-y-4 relative before:absolute before:inset-y-1 before:left-3.5 before:w-0.5 before:bg-outline-variant/20">
                {tasks.slice(0, 4).map((task) => {
                  const initials = (task.assignees[0]?.name || 'HT').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
                  const colors = ['bg-green-100 text-green-700', 'bg-blue-100 text-blue-700', 'bg-red-100 text-red-700', 'bg-purple-100 text-purple-700'];
                  const color = colors[parseInt(task.id) % colors.length] || colors[0];
                  return (
                    <div key={task.id} className="flex gap-3 relative z-10">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] ${color}`}>
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-on-surface leading-tight">
                          <span className="font-bold">{task.assignees[0]?.name || 'Thành viên'}</span>{' '}
                          đang xử lý: {task.title}
                        </p>
                        <span className="text-[10px] text-on-surface-variant">{task.column === 'DONE' ? 'Hoàn thành' : task.column === 'IN_PROGRESS' ? 'Đang làm' : task.column === 'REVIEW' ? 'Chờ duyệt' : 'Chưa bắt đầu'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Stats Widget — derived from real data */}
          <div className="bg-white rounded-[24px] p-6 border border-outline-variant/15 long-soft-shadow space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold">
              <TrendingUp size={16} />
              <h3 className="font-bold text-on-surface text-sm">Tóm tắt tiến độ</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-on-surface-variant">
                <span>Tổng công việc</span>
                <span className="font-bold text-on-surface">{tasks.length}</span>
              </div>
              <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: tasks.length > 0 ? `${Math.min(100, (tasks.filter(t => t.column === 'DONE').length / tasks.length) * 100)}%` : '0%' }}
                />
              </div>
              <p className="text-[10px] text-on-surface-variant">{tasks.filter(t => t.column === 'DONE').length} / {tasks.length} công việc hoàn thành</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs text-on-surface-variant">
                <span>Dự án đang chạy</span>
                <span className="font-bold text-on-surface">{projects.filter(p => p.status === 'IN_PROGRESS').length} / {projects.length}</span>
              </div>
              <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-secondary h-full rounded-full transition-all"
                  style={{ width: projects.length > 0 ? `${Math.min(100, (projects.filter(p => p.status === 'IN_PROGRESS').length / projects.length) * 100)}%` : '0%' }}
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

  );
}
