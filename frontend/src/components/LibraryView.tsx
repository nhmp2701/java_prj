/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  PlusCircle, 
  Plus, 
  ArrowRight, 
  Filter, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Bookmark, 
  X,
  TrendingUp,
  FileText,
  Users,
  Trash2,
  Rocket
} from 'lucide-react';
import { Project } from '../types';

interface LibraryViewProps {
  projects: Project[];
  onSelectProject: (project: Project, tabRedirect: string) => void;
  onAddProject: (newProject: Project) => void;
  canAddProject?: boolean;
  chapters?: any[];
  assets?: any[];
  readerCount?: number;
  onDeleteProject?: (id: string) => void;
  onUpdateProjectStatus?: (id: string, status: string) => void;
}

export default function LibraryView({ 
  projects, 
  onSelectProject, 
  onAddProject,
  canAddProject = true,
  chapters = [],
  assets = [],
  readerCount = 0,
  onDeleteProject,
  onUpdateProjectStatus,
}: LibraryViewProps) {
  const [activeFilter, setActiveFilter] = useState<'All Projects' | 'Drafts' | 'Published'>('All Projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingSeries, setIsAddingSeries] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // New series state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'PLANNING' | 'IN_PROGRESS' | 'COMPLETED'>('PLANNING');
  const [category, setCategory] = useState<'Drafts' | 'Published'>('Drafts');
  const [imageUrl, setImageUrl] = useState(''); // User-provided cover URL


  const DEFAULT_COVER = 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80';

  const handleCreateSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!description.trim()) {
      setErrorMsg('Vui lòng nhập mô tả cốt truyện.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const newProj: Project = {
        id: `proj_${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        status,
        updatedAt: 'Vừa xong',
        imageUrl: imageUrl.trim() || DEFAULT_COVER,
        category
      };

      await onAddProject(newProj);
      setName('');
      setDescription('');
      setStatus('PLANNING');
      setCategory('Drafts');
      setImageUrl('');
      setIsAddingSeries(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Không thể tạo dự án. Vui lòng thử lại.';
      setErrorMsg(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeProjectCategory = (projStatus: string) => {
    return projStatus === 'PUBLISHED' ? 'Published' : 'Drafts';
  };

  const filteredProjects = projects.filter((proj) => {
    // Tab category filter based on status mapping
    if (activeFilter !== 'All Projects' && activeProjectCategory(proj.status) !== activeFilter) {
      return false;
    }
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        proj.name.toLowerCase().includes(query) || 
        proj.description.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getStatusBadgeStyles = (status: Project['status']) => {
    switch (status) {
      case 'PLANNING':
        return 'bg-blue-50 text-blue-700 border border-blue-200/50';
      case 'IN_PROGRESS':
        return 'bg-amber-50 text-amber-700 border border-amber-200/50';
      case 'COMPLETED':
        return 'bg-green-50 text-green-700 border border-green-200/50';
      case 'PUBLISHED':
        return 'bg-purple-50 text-purple-700 border border-purple-200/50 shadow-sm';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  // Dynamic metrics calculations
  const completedProjects = projects.filter((p) => p.status === 'COMPLETED').length;
  const progressPercentage = projects.length > 0 ? Math.round((completedProjects / projects.length) * 100) : 0;
  const pendingChapters = chapters.filter((ch) => ch.status === 'PENDING').length;

  return (
    <div className="space-y-8 select-none">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">Thư viện dự án</h2>
          <p className="text-sm text-on-surface-variant font-medium">
            Quản lý danh mục xuất bản và loạt tác phẩm của bạn.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search container */}
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-on-surface-variant opacity-60">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm dự án..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/80 border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2 text-sm w-60 focus:ring-2 focus:ring-primary-container focus:border-primary focus:bg-white outline-none transition-all"
            />
          </div>

          {canAddProject && (
            <button 
              onClick={() => setIsAddingSeries(true)}
              className="bg-primary text-on-primary text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <PlusCircle size={18} />
              Tạo Dự Án Mới
            </button>
          )}
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
        <div className="flex gap-2 bg-surface-container-low/60 p-1 rounded-xl border border-outline-variant/20">
          {(['All Projects', 'Drafts', 'Published'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeFilter === filter
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-white/40'
              }`}
            >
              {filter === 'All Projects' ? 'Tất cả dự án' : filter === 'Drafts' ? 'Bản nháp' : 'Đã xuất bản'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant">
          <span className="uppercase tracking-wider">Sắp xếp: Gần đây</span>
          <Filter size={14} />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Render actual projects */}
        {filteredProjects.map((proj) => (
          <div 
            key={proj.id}
            className="group bg-white rounded-2xl overflow-hidden border border-outline-variant/15 long-soft-shadow hover:translate-y-[-4px] hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer"
            onClick={() => onSelectProject(proj, 'chapters')}
          >
            {/* Banner cover */}
            <div className="h-44 relative overflow-hidden bg-surface-container-high">
              <img 
                src={proj.imageUrl} 
                alt={proj.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${getStatusBadgeStyles(proj.status)}`}>
                  {proj.status === 'PLANNING' ? 'Lên kế hoạch' : proj.status === 'IN_PROGRESS' ? 'Đang thực hiện' : proj.status === 'PUBLISHED' ? 'Đã xuất bản' : 'Hoàn thành'}
                </span>
              </div>
              
              {/* Overlay actions */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {onDeleteProject && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteProject(proj.id); }}
                    className="p-1.5 bg-red-500/90 text-white rounded hover:bg-red-600 transition-colors cursor-pointer backdrop-blur-sm"
                    title="Xóa dự án"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
                {onUpdateProjectStatus && proj.status !== 'PUBLISHED' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onUpdateProjectStatus(proj.id, 'PUBLISHED'); }}
                    className="p-1.5 bg-purple-500/90 text-white rounded hover:bg-purple-600 transition-colors cursor-pointer backdrop-blur-sm"
                    title="Xuất bản dự án"
                  >
                    <Rocket size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Details panel */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-lg font-bold text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                {proj.name}
              </h3>
              <p className="text-xs text-on-surface-variant font-medium mt-1 line-clamp-2 min-h-[32px] mb-4">
                {proj.description}
              </p>

              <div className="mt-auto flex items-center justify-between pt-4 border-t border-outline-variant/15 text-[10px] font-bold text-on-surface-variant">
                <span>Cập nhật {proj.updatedAt}</span>
                <span className="text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Không gian làm việc <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Start New Series Blank Card */}
        {canAddProject && (
          <div 
            onClick={() => setIsAddingSeries(true)}
            className="group rounded-2xl border-2 border-dashed border-outline-variant/40 bg-surface-container-low/40 hover:bg-white hover:border-primary/40 transition-all cursor-pointer flex flex-col items-center justify-center p-8 gap-4 min-h-[280px]"
          >
            <div className="w-14 h-14 rounded-full bg-primary-container/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-on-surface text-base">Tạo bộ truyện mới</h3>
              <p className="text-xs text-on-surface-variant font-medium mt-1">Bắt đầu tác phẩm tiếp theo của bạn</p>
            </div>
            <button className="text-xs font-bold text-primary hover:underline bg-transparent border-none cursor-pointer">
              Thiết lập nhanh →
            </button>
          </div>
        )}

      </div>

      {/* Library Pulse Insights panel */}
      <section className="bg-white rounded-[24px] p-6 border border-outline-variant/20 long-soft-shadow">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-3 w-full">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Sparkles size={18} />
              <h4 className="text-lg font-bold text-on-surface">Nhịp đập Thư viện</h4>
            </div>
            <p className="text-sm text-on-surface-variant font-medium">
              Bạn đã hoàn thành <span className="font-bold text-primary">{progressPercentage}%</span> dự án ({completedProjects}/{projects.length}). Có <span className="font-bold text-primary">{pendingChapters}</span> chương đang chờ phê duyệt cuối cùng.
            </p>
            {/* Elegant ProgressBar */}
            <div className="w-full bg-surface-container-low rounded-full h-2.5 border border-outline-variant/10 overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>

          <div className="flex items-center gap-12 shrink-0">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-primary flex items-center justify-center gap-1.5">
                <BookOpen size={24} className="opacity-80" />
                {projects.length}
              </div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-1.5">
                Dự án
              </div>
            </div>
            
            <div className="text-center border-l border-outline-variant/30 pl-12">
              <div className="text-4xl font-extrabold text-secondary flex items-center justify-center gap-1.5">
                <FileText size={24} className="opacity-80" />
                {assets.length}
              </div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-1.5">
                Trang vẽ
              </div>
            </div>

            <div className="text-center border-l border-outline-variant/30 pl-12">
              <div className="text-4xl font-extrabold text-on-primary-container flex items-center justify-center gap-1.5">
                <Users size={24} className="opacity-80" />
                {readerCount >= 1000 ? (readerCount / 1000).toFixed(1) + "k" : readerCount}
              </div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-1.5">
                Độc giả
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Adding Series Dialog Modal */}
      {isAddingSeries && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 long-soft-shadow border border-outline-variant/20 space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant/15 pb-3">
              <div className="flex items-center gap-2">
                <PlusCircle size={20} className="text-primary" />
                <h3 className="font-bold text-on-surface text-lg">Bắt đầu bộ truyện mới</h3>
              </div>
              <button 
                onClick={() => setIsAddingSeries(false)}
                className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/40 p-1.5 rounded-full transition-colors bg-transparent border-none cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSeries} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">Tên bộ truyện *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Hồn Kiếm Sĩ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">Mô tả cốt truyện *</label>
                <textarea
                  required
                  placeholder="Tóm tắt nội dung chính hoặc ý tưởng ban đầu của tác phẩm..."
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); setErrorMsg(''); }}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">Trạng thái ban đầu</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-surface-container-low border border-transparent rounded-xl outline-none text-on-surface text-sm"
                  >
                    <option value="PLANNING">Lên kế hoạch</option>
                    <option value="IN_PROGRESS">Đang thực hiện</option>
                    <option value="COMPLETED">Đã hoàn thành</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">Phân loại</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-surface-container-low border border-transparent rounded-xl outline-none text-on-surface text-sm"
                  >
                    <option value="Drafts">Không gian Nháp</option>
                    <option value="Published">Đã xuất bản</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">URL ảnh bìa (Tùy chọn)</label>
                <input
                  type="url"
                  placeholder="https://example.com/cover.jpg — để trống sẽ dùng ảnh mặc định"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                />
                {imageUrl && (
                  <img src={imageUrl} alt="Preview" className="mt-2 w-full h-24 object-cover rounded-xl border border-outline-variant/20" onError={(e) => (e.currentTarget.style.display='none')} />
                )}
              </div>


              {errorMsg && (
                <p className="text-xs text-red-600 font-semibold bg-red-50 border border-red-200/50 rounded-xl px-4 py-2.5">
                  ⚠️ {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all mt-4 cursor-pointer text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Đang tạo...
                  </>
                ) : 'Tạo Dự Án Bộ Truyện'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>

  );
}
