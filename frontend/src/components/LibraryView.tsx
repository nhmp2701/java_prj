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
  Users
} from 'lucide-react';
import { Project } from '../types';

interface LibraryViewProps {
  projects: Project[];
  onSelectProject: (project: Project, tabRedirect: string) => void;
  onAddProject: (newProject: Project) => void;
}

export default function LibraryView({ projects, onSelectProject, onAddProject }: LibraryViewProps) {
  const [activeFilter, setActiveFilter] = useState<'All Projects' | 'Drafts' | 'Published'>('All Projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingSeries, setIsAddingSeries] = useState(false);

  // New series state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'PLANNING' | 'IN_PROGRESS' | 'COMPLETED'>('PLANNING');
  const [category, setCategory] = useState<'Drafts' | 'Published'>('Drafts');
  const [imageStyle, setImageStyle] = useState('cyberpunk'); // default style

  // Mock preset covers for creation
  const coverPresets: Record<string, string> = {
    cyberpunk: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLwgZzoGXSfPWNZrJ2f7CVPJgUhC3aTIuWSUtcLCyoMSCw54xUmjjEVbxfKL6QOZznPWDRU45sCB62Ljcf3bR6dDGqt0zw2XBldyOBSi_w8vPFHcWFVBkkqXJ6c6U6sBhJg37OLFI5q67jljhgrywUJPSXOXY0TpA6dwMiJ5AoaZNxXDW6ZWZvOcayahGKHalAMLE4-21tzkd1QEy9CWOnMaWd5fagHbHqlS6A3WEkl7Xvbw_gM6uSg3orhlgsSdKg7clvLuSn3jU',
    samurai: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLrZ5H6b9D7U07ssAIYfzkVnrMluHwcbH51Nfx4TaDw7xxN2LTpc5SNB88rDXngfa55FuhWESOG38CaZxaRFFPdOITDxhKLgO293LpaJXaj21EffapqkxfDrcRBYh4bhgsGBUpsTIXigzyg-UdCzYW9Dt6weXdWx2IfzXbq6C3BaY1v_vLccT9BnsftI_ZflgCYV5Y7aBs1OBOtHoZDgsF3g-oD9jfHX1gASlsVI0yLsOcNKoczCZsYlGOrFjqLCKbGyWqZi9WUuw',
    fantasy: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuP5lT-5_wREqApQjP6NudW1DGH3o6rq-zrS2GpsUnt5lKFYwTNMGuKSxlDgS_i_D-PzkL8oC0Oh1Z4MCsOzgsJtox6na7EUb9HbxE0wW4pneenzITo-DyYAwtn0XKcCZyY_iqVQrwjSuHPNFb-ItipyzWB-OOQWfMS6nUbHJG_GspBRDhEzxd_rm9LATfur8Z2GKoirCwasHa4HyQm5VHVgNA3ABJuNNiTEPgWVxJu5ZwuMQG_WXN2obZy692khnMyg-bjZjlq44',
    rainy: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrH7rxVAcri1Q_O3CzoOLTH5Ij7BdpM85n7wk0oy8JRi59_sHWPCklrwaTzQ4-0Ib7QxaSfv4hFAhODvqtImLQn6XrPNMOHeaxrAnZ0wWW6kcM9zHNlleqlqH8-43ytkUYwFinCG3AFvnDkesuXIrJ3RiLT0_hGMhHeXh63tY3pvCtY61zMeglwxhgMoVZFB_rXq03aQU1KLpyeToRo3G9_HrzT7FnvE7r3rJ_E-Mn0LSsszcnQ6o7teKfGpk5jLQwkDVeWOr4MXk',
    dragon: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAzOEvFnCJDnzWh6PsZXE4aO_rA0Pph7Z1lBWXnkxf9XwonresEuDRH0Dz32wu2o3CmiJUMVaf-C67NKIN627WmO9YhnS_6-eKhEJDCjpnLoxTHRcdIkSCn7e0VIfyY2RUDpj1E1uadm0eN4vYlS27H-A1MzEzT05OOlO6lgWxZsrb4YTIlW5IwI80-Sz1K7LdMYwDKlSKUru0q8BBkdKaW8hiPKHk-DF475RBk1qFi5N9Iw67syDVlUQjVNosuwvs_-CYoIvhzAg'
  };

  const handleCreateSeries = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProj: Project = {
      id: `proj_${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'A masterpiece series in development.',
      status,
      updatedAt: 'Just now',
      imageUrl: coverPresets[imageStyle] || coverPresets.cyberpunk,
      category
    };

    onAddProject(newProj);
    setName('');
    setDescription('');
    setStatus('PLANNING');
    setCategory('Drafts');
    setIsAddingSeries(false);
  };

  const filteredProjects = projects.filter((proj) => {
    // Tab category filter
    if (activeFilter !== 'All Projects' && proj.category !== activeFilter) {
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
        return 'bg-green-50 text-green-700 border border-green-200/50';
      case 'COMPLETED':
        return 'bg-red-50 text-red-700 border border-red-200/50';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">Library</h2>
          <p className="text-sm text-on-surface-variant font-medium">
            Manage your publication portfolio and design series.
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
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/80 border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2 text-sm w-60 focus:ring-2 focus:ring-primary-container focus:border-primary focus:bg-white outline-none transition-all"
            />
          </div>

          <button 
            onClick={() => setIsAddingSeries(true)}
            className="bg-primary text-on-primary text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <PlusCircle size={18} />
            Create New Project
          </button>
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
              {filter}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant">
          <span className="uppercase tracking-wider">Sorted by: Recent</span>
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
            onClick={() => onSelectProject(proj, 'composition')}
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
                  {proj.status}
                </span>
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
                <span>Updated {proj.updatedAt}</span>
                <span className="text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  Workspace <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </div>
        ))}

        {/* Start New Series Blank Card */}
        <div 
          onClick={() => setIsAddingSeries(true)}
          className="group rounded-2xl border-2 border-dashed border-outline-variant/40 bg-surface-container-low/40 hover:bg-white hover:border-primary/40 transition-all cursor-pointer flex flex-col items-center justify-center p-8 gap-4 min-h-[280px]"
        >
          <div className="w-14 h-14 rounded-full bg-primary-container/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Plus size={24} />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-on-surface text-base">Start New Series</h3>
            <p className="text-xs text-on-surface-variant font-medium mt-1">Launch your next masterpiece</p>
          </div>
          <button className="text-xs font-bold text-primary hover:underline bg-transparent border-none cursor-pointer">
            Quick Setup →
          </button>
        </div>

      </div>

      {/* Library Pulse Insights panel */}
      <section className="bg-white rounded-[24px] p-6 border border-outline-variant/20 long-soft-shadow">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-3 w-full">
            <div className="flex items-center gap-2 text-primary font-bold">
              <Sparkles size={18} />
              <h4 className="text-lg font-bold text-on-surface">Library Pulse</h4>
            </div>
            <p className="text-sm text-on-surface-variant font-medium">
              You've reached <span className="font-bold text-primary">85%</span> of your publishing goals for this month. 3 chapters are awaiting final review.
            </p>
            {/* Elegant ProgressBar */}
            <div className="w-full bg-surface-container-low rounded-full h-2.5 border border-outline-variant/10 overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '85%' }}></div>
            </div>
          </div>

          <div className="flex items-center gap-12 shrink-0">
            <div className="text-center">
              <div className="text-4xl font-extrabold text-primary flex items-center justify-center gap-1.5">
                <BookOpen size={24} className="opacity-80" />
                {projects.length}
              </div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-1.5">
                Projects
              </div>
            </div>
            
            <div className="text-center border-l border-outline-variant/30 pl-12">
              <div className="text-4xl font-extrabold text-secondary flex items-center justify-center gap-1.5">
                <FileText size={24} className="opacity-80" />
                {projects.length * 24 + 116}
              </div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-1.5">
                Pages
              </div>
            </div>

            <div className="text-center border-l border-outline-variant/30 pl-12">
              <div className="text-4xl font-extrabold text-on-primary-container flex items-center justify-center gap-1.5">
                <Users size={24} className="opacity-80" />
                3.2k
              </div>
              <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mt-1.5">
                Readers
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
                <h3 className="font-bold text-on-surface text-lg">Start New Series</h3>
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
                <label className="text-xs font-bold text-on-surface-variant">Series Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Spirit of the Blade"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">Description</label>
                <textarea
                  placeholder="Summarize the core premise of this narrative..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">Initial Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-surface-container-low border border-transparent rounded-xl outline-none text-on-surface text-sm"
                  >
                    <option value="PLANNING">Planning</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-surface-container-low border border-transparent rounded-xl outline-none text-on-surface text-sm"
                  >
                    <option value="Drafts">Draft Workspace</option>
                    <option value="Published">Published Studio</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">Visual Art Style Preset</label>
                <div className="grid grid-cols-5 gap-2 pt-1">
                  {Object.keys(coverPresets).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setImageStyle(style)}
                      className={`py-2 rounded-xl text-xs font-bold uppercase transition-all border cursor-pointer ${
                        imageStyle === style
                          ? 'bg-primary-container text-on-primary-container border-primary'
                          : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container-high/40'
                      }`}
                    >
                      {style.substring(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all mt-4 cursor-pointer text-sm"
              >
                Create Series
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
