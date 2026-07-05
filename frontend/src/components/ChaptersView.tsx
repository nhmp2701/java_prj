/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  PlusCircle,
  Calendar,
  Clock,
  Trash2,
  Check,
  X as CloseIcon,
  ChevronLeft,
  AlertCircle,
  BookOpen,
  Rocket,
  Send,
} from "lucide-react";
import { Chapter, Project, Task } from "../types";

interface ChaptersViewProps {
  chapters: Chapter[];
  projects: Project[];
  tasks?: Task[];
  assets?: any[];
  selectedProject: Project | null;
  onSelectProjectDirectly: (project: Project) => void;
  onSelectChapter: (chapter: Chapter, tabRedirect: string) => void;
  onAddChapter: (newChapter: Chapter) => Promise<void>;
  onUpdateChapterStatus: (chapterId: string, status: Chapter["status"]) => Promise<void>;
  onPublishChapter: (chapterId: string) => Promise<void>;
  onDeleteChapter: (chapterId: string) => Promise<void>;
  canManageChapters?: boolean;
  canUpdateChapterStatus?: boolean;
  canRequestChapterApproval?: boolean;
  canApproveChapters?: boolean;
  canQuickApproveChapters?: boolean;
  canDeleteChapters?: boolean;
  canPublish?: boolean;
  canManageTasks?: boolean;
  canReviewAssets?: boolean;
  canReadChapters?: boolean;
}

export default function ChaptersView({
  chapters,
  projects,
  tasks = [],
  assets = [],
  selectedProject,
  onSelectProjectDirectly,
  onSelectChapter,
  onAddChapter,
  onUpdateChapterStatus,
  onPublishChapter,
  onDeleteChapter,
  canManageChapters = true,
  canUpdateChapterStatus = canManageChapters,
  canRequestChapterApproval = canUpdateChapterStatus,
  canApproveChapters = false,
  canQuickApproveChapters = false,
  canDeleteChapters = canManageChapters,
  canPublish = false,
  canManageTasks = false,
  canReviewAssets = false,
  canReadChapters = true,
}: ChaptersViewProps) {
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [title, setTitle] = useState("");
  const [chapterNumber, setChapterNumber] = useState<number>(1);
  const [content, setContent] = useState("");
  const [scheduledPublishAt, setScheduledPublishAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const selectedProjectId = selectedProject?.id || projects[0]?.id || "";
  const currentProjectObj = projects.find((p) => p.id === selectedProjectId) || projects[0];

  // Filter chapters by project and selected tab/status
  const projectChapters = chapters.filter((c) => c.mangaId === selectedProjectId);
  const filteredChapters = projectChapters.filter((c) => {
    if (activeFilter === "ALL") return true;
    return c.status === activeFilter;
  });

  const getReviewReadiness = (chapterId: string) => {
    const chapterTasks = tasks.filter((task) => String(task.chapterId || task.projectId) === String(chapterId));
    const chapterAssets = assets.filter((asset) => String(asset.chapterId) === String(chapterId));
    const unfinishedTasks = chapterTasks.filter((task) => task.column !== "DONE").length;
    const unapprovedAssets = chapterAssets.filter((asset) => asset.status !== "APPROVED").length;

    if (chapterTasks.length === 0) return { ready: false, reason: "Cần có ít nhất 1 task" };
    if (unfinishedTasks > 0) return { ready: false, reason: "Tất cả task phải DONE" };
    if (chapterAssets.length === 0) return { ready: false, reason: "Cần có ít nhất 1 asset" };
    if (unapprovedAssets > 0) return { ready: false, reason: "Tất cả asset phải APPROVED" };
    return { ready: true, reason: "Gửi yêu cầu duyệt" };
  };

  const getStatusBadgeStyles = (status: Chapter["status"]) => {
    switch (status) {
      case "DRAFT":
        return "bg-slate-100 text-slate-700 border border-slate-200/50";
      case "PENDING":
        return "bg-amber-50 text-amber-700 border border-amber-200/50";
      case "SCHEDULED":
        return "bg-purple-50 text-purple-700 border border-purple-200/50";
      case "PUBLISHED":
        return "bg-green-50 text-green-700 border border-green-200/50";
      case "REJECTED":
        return "bg-red-50 text-red-700 border border-red-200/50";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getStatusLabel = (status: Chapter["status"]) => {
    switch (status) {
      case "DRAFT":
        return "Chưa duyệt";
      case "PENDING":
        return "Đang chờ duyệt";
      case "SCHEDULED":
        return "Đã duyệt";
      case "PUBLISHED":
        return "Đã xuất bản";
      case "REJECTED":
        return "Từ chối";
      default:
        return status;
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setErrorMsg("");
    try {
      const newCh: Chapter = {
        id: `chap_${Date.now()}`,
        title: title.trim(),
        chapterNumber,
        content: content.trim(),
	        status: "DRAFT",
        mangaId: String(selectedProjectId),
        scheduledPublishAt: scheduledPublishAt || undefined,
      };

      await onAddChapter(newCh);
      setTitle("");
      setChapterNumber((prev) => prev + 1);
      setContent("");
      setScheduledPublishAt("");
      setIsAddingChapter(false);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.response?.data?.message || err?.message || "Khong the tao chapter. Vui long thu lai.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-primary">Quản lý chương truyện</h2>
            <div className="relative">
              <select
                value={selectedProjectId}
                onChange={(e) => {
                  const found = projects.find((p) => p.id === e.target.value);
                  if (found) onSelectProjectDirectly(found);
                }}
                className="bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary font-bold text-xs py-1.5 px-3.5 rounded-xl cursor-pointer outline-none transition-all pr-8 appearance-none"
              >
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id} className="text-on-surface font-semibold">
                    {proj.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-2.5 top-2.5 pointer-events-none text-primary">
                <ChevronLeft size={12} className="rotate-[-90deg]" />
              </div>
            </div>
          </div>
          <p className="text-sm text-on-surface-variant font-medium mt-1">
            Tổng cộng <span className="font-bold text-primary">{projectChapters.length} chương</span> cho dự án{" "}
            <span className="font-bold text-primary">{currentProjectObj?.name}</span>.
          </p>
        </div>

        <button
          onClick={() => canManageChapters && setIsAddingChapter(true)}
          disabled={!canManageChapters}
          className={`text-sm font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm ${
            canManageChapters
              ? "bg-primary text-on-primary hover:opacity-95 active:scale-95 cursor-pointer"
              : "bg-surface-container-high text-on-surface-variant cursor-not-allowed"
          }`}
        >
          <PlusCircle size={18} />
          Thêm Chương Mới
        </button>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap gap-2 border-b border-outline-variant/20 pb-4">
        {[
          { key: "ALL", label: "Tất cả chương" },
          { key: "DRAFT", label: "Chưa duyệt" },
          { key: "PENDING", label: "Đang chờ duyệt" },
          { key: "SCHEDULED", label: "Đã duyệt" },
          { key: "PUBLISHED", label: "Đã xuất bản" },
          { key: "REJECTED", label: "Bị từ chối" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeFilter === tab.key
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chapters list table card */}
      <div className="bg-white rounded-2xl border border-outline-variant/15 long-soft-shadow overflow-hidden">
        {filteredChapters.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-on-surface-variant/60 min-h-[250px]">
            <BookOpen size={36} className="stroke-1 mb-2 text-primary opacity-60" />
            <h3 className="font-bold text-on-surface text-base">Không có chương truyện nào</h3>
            <p className="text-xs text-on-surface-variant mt-1 max-w-xs">
              Chưa có chương truyện nào khớp với bộ lọc hiện tại. Bấm nút Thêm Chương Mới để khởi tạo.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/40 border-b border-outline-variant/10 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  <th className="py-4 px-6">Số chương</th>
                  <th className="py-4 px-6">Tiêu đề chương</th>
                  <th className="py-4 px-6">Trạng thái</th>
                  <th className="py-4 px-6">Lịch xuất bản</th>
                  <th className="py-4 px-6 text-right">Thao tác xử lý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredChapters.map((ch) => (
                  <tr key={ch.id} className="hover:bg-surface-container-low/20 transition-all text-sm font-medium">
                    <td className="py-4 px-6 text-on-surface font-bold">Chương {ch.chapterNumber}</td>
                    <td className="py-4 px-6 text-on-surface">{ch.title}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeStyles(ch.status)}`}>
                        {getStatusLabel(ch.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-on-surface-variant">
                      {ch.scheduledPublishAt ? (
                        <div className="flex items-center gap-1.5 font-semibold">
                          <Calendar size={13} className="text-primary opacity-80" />
                          <span>{ch.scheduledPublishAt.replace("T", " ")}</span>
                        </div>
                      ) : (
                        <span className="opacity-50">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Go to Composition (Kanban) — only for staff with task management rights */}
                        {canReadChapters && ch.status === "PUBLISHED" && (
                          <button
                            onClick={() => onSelectChapter(ch, "reader")}
                            title="Đọc truyện"
                            className="bg-primary/10 text-primary hover:bg-primary/20 p-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-1"
                          >
                            <BookOpen size={12} />
                            Đọc
                          </button>
                        )}
                        {canManageTasks && (
                          <button
                            onClick={() => onSelectChapter(ch, "composition")}
                            title="Kanban Sản xuất"
                            className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 p-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-1"
                          >
                            <BookOpen size={12} />
                            Kanban
                          </button>
                        )}
                        {/* Go to Review — only for staff with review rights */}
                        {canReviewAssets && (
                          <button
                            onClick={() => onSelectChapter(ch, "review")}
                            title="Duyệt ảnh trang"
                            className="bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 p-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-1"
                          >
                            <Send size={12} />
                            Duyệt ảnh
                          </button>
                        )}

                        {/* Send for review */}
                        {(ch.status === "DRAFT" || ch.status === "REJECTED") && canRequestChapterApproval && (() => {
                          const readiness = getReviewReadiness(ch.id);
                          return (
                            <button
                              onClick={() => readiness.ready && onUpdateChapterStatus(ch.id, "PENDING")}
                              disabled={!readiness.ready}
                              title={readiness.reason}
                              className={`p-2 rounded-xl text-xs font-bold transition-all border-none flex items-center gap-1 ${
                                readiness.ready
                                  ? "bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                                  : "bg-slate-100 text-slate-500 cursor-not-allowed"
                              }`}
                            >
                              <Send size={12} />
                              Xin Duyệt
                            </button>
                          );
                        })()}

                        {ch.status === "DRAFT" && canQuickApproveChapters && (
                          <button
                            onClick={() => onUpdateChapterStatus(ch.id, "SCHEDULED")}
                            title="Admin duyệt ngay chapter"
                            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 p-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-1"
                          >
                            <Check size={12} />
                            Duyệt ngay
                          </button>
                        )}

                        {ch.status === "DRAFT" && canApproveChapters && (
                          <button
                            disabled
                            title="Editor chưa gửi yêu cầu duyệt"
                            className="bg-slate-100 text-slate-500 p-2 rounded-xl text-xs font-bold border-none flex items-center gap-1 cursor-not-allowed"
                          >
                            <Clock size={12} />
                            Chưa duyệt
                          </button>
                        )}

                        {ch.status === "PENDING" && canApproveChapters && (
                          <>
                            <button
                              onClick={() => onUpdateChapterStatus(ch.id, "SCHEDULED")}
                              title="Duyệt chapter"
                              className="bg-green-50 text-green-700 hover:bg-green-100 p-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-1"
                            >
                              <Check size={12} />
                              Đang chờ duyệt
                            </button>
                            <button
                              onClick={() => onUpdateChapterStatus(ch.id, "REJECTED")}
                              title="Từ chối yêu cầu"
                              className="bg-red-50 text-red-700 hover:bg-red-100 p-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-1"
                            >
                              <CloseIcon size={12} />
                              Từ chối
                            </button>
                          </>
                        )}

                        {/* Approve/Reject Chapter workflow */}
                        {false && ch.status === "PENDING" && canApproveChapters && (
                          <>
                            <button
                              onClick={() => onUpdateChapterStatus(ch.id, "SCHEDULED")}
                              title="Phê duyệt hoàn thành"
                              className="bg-green-50 text-green-700 hover:bg-green-100 p-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-1"
                            >
                              <Check size={12} />
                              Hoàn thành
                            </button>
                            <button
                              onClick={() => onUpdateChapterStatus(ch.id, "REJECTED")}
                              title="Từ chối yêu cầu"
                              className="bg-red-50 text-red-700 hover:bg-red-100 p-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-1"
                            >
                              <CloseIcon size={12} />
                              Từ chối
                            </button>
                          </>
                        )}

                        {ch.status === "SCHEDULED" && canApproveChapters && (
                          <button
                            disabled
                            title="Chapter đã được duyệt"
                            className="bg-green-50 text-green-700 p-2 rounded-xl text-xs font-bold border-none flex items-center gap-1 cursor-not-allowed"
                          >
                            <Check size={12} />
                            Đã duyệt
                          </button>
                        )}

                        {/* Publish after approval */}
                        {ch.status === "SCHEDULED" && canPublish && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onPublishChapter(ch.id); }}
                            title="Xuất bản"
                            className="bg-green-500/10 text-green-600 hover:bg-green-500/20 p-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-none flex items-center gap-1"
                          >
                            <Rocket size={12} />
                            Xuất bản
                          </button>
                        )}

                        {/* Delete Chapter (Admin only or manage enabled) */}
                        {canDeleteChapters && (
                          <button
                            onClick={() => {
                              if (confirm("Bạn có chắc chắn muốn xóa chương truyện này không?")) {
                                onDeleteChapter(ch.id);
                              }
                            }}
                            title="Xóa chương này"
                            className="text-on-surface-variant hover:text-error hover:bg-error-container/20 p-2 rounded-xl transition-all cursor-pointer border-none"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create New Chapter Popup Dialog Modal */}
      {isAddingChapter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 long-soft-shadow border border-outline-variant/20 space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant/15 pb-3">
              <div className="flex items-center gap-2">
                <PlusCircle size={20} className="text-primary" />
                <h3 className="font-bold text-on-surface text-lg">Thêm chương truyện mới</h3>
              </div>
              <button
                onClick={() => setIsAddingChapter(false)}
                className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/40 p-1.5 rounded-full transition-colors bg-transparent border-none cursor-pointer"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1 space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">Chương số *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={chapterNumber}
                    onChange={(e) => setChapterNumber(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">Tiêu đề chương *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Đêm yên ả"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">Tóm tắt nội dung chương</label>
                <textarea
                  placeholder="Mô tả tóm tắt phân cảnh, kịch bản hoặc lời thoại chương mới..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
                  <Clock size={13} className="text-primary" />
                  Hẹn giờ xuất bản tự động (Tùy chọn)
                </label>
                <input
                  type="datetime-local"
                  value={scheduledPublishAt}
                  onChange={(e) => setScheduledPublishAt(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                />
                <span className="text-[10px] text-on-surface-variant block mt-0.5 leading-tight">
                  Nếu để trống, chương truyện sẽ ở trạng thái Bản nháp và có thể duyệt thủ công.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all mt-4 cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang xử lý..." : "Khởi Tạo Chương"}
              </button>
              {errorMsg && (
                <p className="text-xs text-red-600 font-semibold bg-red-50 border border-red-200/50 rounded-xl px-4 py-2.5">
                  {errorMsg}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
