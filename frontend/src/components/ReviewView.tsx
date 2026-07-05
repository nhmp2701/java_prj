/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  UploadCloud,
  MessageSquare,
  Send,
  Plus,
  X,
  Sparkles,
  ChevronRight,
  UserPlus,
  Eye,
  Trash2,
  Filter,
} from "lucide-react";
import { Project, MangaPage, Feedback, Reviewer } from "../types";
import { getAssets, approveAsset, rejectAsset, addAssetComment, getAssetReviews, uploadAsset } from "../services/api";

interface ReviewViewProps {
  pages: MangaPage[];
  project: Project | null;
  selectedChapter?: any | null;
  reviewers: Reviewer[];
  onUpdatePageStatus: (pageId: string, status: MangaPage["status"]) => void;
  onAddFeedback: (pageId: string, feedback: Feedback) => void;
  onUploadPage: (newPage: MangaPage) => void;
  onAddReviewer: (reviewer: Reviewer) => void;
  onDeletePage: (pageId: string) => void;
  chapters?: any[];
  projects?: Project[];
  assets?: any[];
  onReloadAssets?: () => void;
  canReviewAssets?: boolean;
}

export default function ReviewView({
  pages,
  project,
  selectedChapter,
  reviewers,
  onUpdatePageStatus,
  onAddFeedback,
  onUploadPage,
  onAddReviewer,
  onDeletePage,
  chapters = [],
  projects = [],
  assets: externalAssets,
  onReloadAssets,
  canReviewAssets = true,
}: ReviewViewProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    project?.id || "",
  );
  // Auto-select chapter when coming from ChaptersView navigation
  const [selectedChapterId, setSelectedChapterId] = useState<string>(selectedChapter?.id || "");
  const [selectedPageId, setSelectedPageId] = useState<string>(pages[0]?.id || "page_1");
  const [newComment, setNewComment] = useState("");
  const [isInvitingReviewer, setIsInvitingReviewer] = useState(false);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerRole, setReviewerRole] = useState("Assistant Editor");
  const [assetPages, setAssetPages] = useState<MangaPage[]>(pages);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [liveReviews, setLiveReviews] = useState<any[]>([]);
  const [sendingAction, setSendingAction] = useState(false);

  // Interactive annotation positioning state
  const [activeX, setActiveX] = useState<number | null>(null);
  const [activeY, setActiveY] = useState<number | null>(null);

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive chapters belonging to the selected project
  // chapters use mangaId (not projectId) as the link to the project
  const projectChapters = useMemo(
    () =>
      chapters.filter(
        (ch: any) =>
          !selectedProjectId ||
          String(ch.mangaId) === String(selectedProjectId),
      ),
    [chapters, selectedProjectId],
  );

  useEffect(() => {
    if (project?.id && String(project.id) !== String(selectedProjectId)) {
      setSelectedProjectId(String(project.id));
      setSelectedChapterId(selectedChapter?.mangaId === project.id ? String(selectedChapter.id) : "");
    }
  }, [project?.id, selectedChapter?.id, selectedChapter?.mangaId, selectedProjectId]);

  useEffect(() => {
    if (!selectedProjectId || projectChapters.length === 0) {
      if (selectedChapterId && !projectChapters.some((ch: any) => String(ch.id) === String(selectedChapterId))) {
        setSelectedChapterId("");
      }
      return;
    }

    if (!selectedChapterId || !projectChapters.some((ch: any) => String(ch.id) === String(selectedChapterId))) {
      setSelectedChapterId(String(projectChapters[0].id));
    }
  }, [selectedProjectId, selectedChapterId, projectChapters]);

  const filterAssetsForSelection = useCallback(
    (data: any[]) => {
      const chapterIds = new Set(projectChapters.map((ch: any) => String(ch.id)));
      return data.filter((asset: any) => {
        const assetChapterId = asset.chapterId ? String(asset.chapterId) : "";
        if (selectedChapterId) return assetChapterId === String(selectedChapterId);
        if (selectedProjectId) return assetChapterId !== "" && chapterIds.has(assetChapterId);
        return true;
      });
    },
    [projectChapters, selectedChapterId, selectedProjectId],
  );

  const mapAssetsToPages = useCallback(
    (data: any[]): MangaPage[] =>
      data.map((asset: any, index: number) => ({
        id: String(asset.id),
        projectId: String(asset.chapterId || project?.id || ""),
        fileName: asset.fileName || `asset_${asset.id}`,
        pageNumber: index + 1,
        status:
          asset.status === "APPROVED"
            ? "Approved"
            : asset.status === "REJECTED"
              ? "Revision"
              : "Pending",
        uploadedAt: asset.createdAt?.split("T")[0] || "Vừa xong",
        uploader: asset.uploadedByUsername || "Studio",
        imageUrl: asset.fileUrl || "",
        feedbacks: [],
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [project?.id]
  );

  // Sync with external assets OR local fetch, filtered by selected chapter
  useEffect(() => {
    if (externalAssets && Array.isArray(externalAssets)) {
      const filtered = filterAssetsForSelection(externalAssets);
      const mapped = mapAssetsToPages(filtered);
      setAssetPages(mapped.length > 0 ? mapped : []);
      if (mapped.length > 0) {
        // Only reset selected page if it's no longer in the list or not set
        setSelectedPageId((prev) => {
          if (!prev || !mapped.find(p => p.id === prev)) {
            return String(mapped[0].id);
          }
          return prev;
        });
      }
      return;
    }
    // Fallback: load from backend
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoadingAssets(true);
    getAssets(token)
      .then((response) => {
        if (response?.success && Array.isArray(response.data)) {
          const filtered = filterAssetsForSelection(response.data);
          const mapped = mapAssetsToPages(filtered);
          setAssetPages(mapped);
          setSelectedPageId((prev) => {
            if (!mapped.length) return "";
            if (!prev || !mapped.find(p => p.id === prev)) {
              return String(mapped[0].id);
            }
            return prev;
          });
        }
      })
      .catch((err) => console.error("Failed to load assets from backend", err))
      .finally(() => setLoadingAssets(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChapterId, selectedProjectId, externalAssets, filterAssetsForSelection, mapAssetsToPages]);

  // Load live reviews when selected page changes
  useEffect(() => {
    if (!selectedPageId || selectedPageId === "page_1") { setLiveReviews([]); return; }
    const token = localStorage.getItem("token");
    if (!token) return;
    getAssetReviews(selectedPageId, token)
      .then((res) => {
        if (res?.success && Array.isArray(res.data)) setLiveReviews(res.data);
        else setLiveReviews([]);
      })
      .catch(() => setLiveReviews([]));
  }, [selectedPageId]);

  // Sync pages when props change (fallback)
  useEffect(() => {
    if (!externalAssets) setAssetPages(pages);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages]);

  const selectedPageObj =
    assetPages.find((p) => p.id === selectedPageId) || assetPages[0];
  const activeProjectName = (projects.find(p => p.id === selectedProjectId) || project)?.name || "—";

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedPageObj) return;
    setSendingAction(true);
    const token = localStorage.getItem("token");
    try {
      if (token && selectedPageObj.id !== "page_1") {
        await addAssetComment(selectedPageObj.id, newComment.trim(), token);
        // Reload live reviews
        const res = await getAssetReviews(selectedPageObj.id, token);
        if (res?.success && Array.isArray(res.data)) setLiveReviews(res.data);
      } else {
        const newFb: Feedback = {
          id: `fb_${Date.now()}`,
          user: "Bạn",
          role: "Creative Director",
          comment: newComment.trim(),
          createdAt: "Vừa xong",
          ...(activeX !== null && activeY !== null ? { x: activeX, y: activeY } : {}),
        };
        onAddFeedback(selectedPageObj.id, newFb);
      }
    } catch (err) {
      console.error("Failed to send comment", err);
    } finally {
      setNewComment("");
      setActiveX(null);
      setActiveY(null);
      setSendingAction(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedPageObj) return;
    setSendingAction(true);
    const token = localStorage.getItem("token");
    try {
      if (token && selectedPageObj.id !== "page_1") {
        await approveAsset(selectedPageObj.id, "", token);
      }
      onUpdatePageStatus(selectedPageObj.id, "Approved");
      setAssetPages((prev) =>
        prev.map((p) => p.id === selectedPageObj.id ? { ...p, status: "Approved" } : p)
      );
      if (onReloadAssets) await onReloadAssets();
    } catch (err) {
      console.error("Failed to approve asset", err);
    } finally {
      setSendingAction(false);
    }
  };

  const handleReject = async () => {
    if (!selectedPageObj) return;
    setSendingAction(true);
    const token = localStorage.getItem("token");
    try {
      if (token && selectedPageObj.id !== "page_1") {
        await rejectAsset(selectedPageObj.id, "Yêu cầu chỉnh sửa", token);
      }
      onUpdatePageStatus(selectedPageObj.id, "Revision");
      setAssetPages((prev) =>
        prev.map((p) => p.id === selectedPageObj.id ? { ...p, status: "Revision" } : p)
      );
      if (onReloadAssets) await onReloadAssets();
    } catch (err) {
      console.error("Failed to reject asset", err);
    } finally {
      setSendingAction(false);
    }
  };

  // Real upload — gắn vào chapter đang được chọn
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("assetType", "ILLUSTRATION");
    formData.append("description", `Upload từ Review: ${file.name}`);
    if (selectedChapterId) {
      formData.append("chapterId", selectedChapterId);
    }

    setSendingAction(true);
    try {
      await uploadAsset(formData, token);
      if (onReloadAssets) await onReloadAssets();
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      e.target.value = "";
      setSendingAction(false);
    }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewContainerRef.current) return;
    const rect = previewContainerRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setActiveX(x);
    setActiveY(y);
  };

  const handleInviteReviewerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim()) return;

    const initials = reviewerName
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    const colors = [
      "bg-red-100 text-red-700",
      "bg-purple-100 text-purple-700",
      "bg-emerald-100 text-emerald-700",
      "bg-amber-100 text-amber-700",
    ];

    const newRev: Reviewer = {
      id: `rev_${Date.now()}`,
      name: reviewerName.trim(),
      role: reviewerRole,
      initials,
      color: colors[Math.floor(Math.random() * colors.length)],
      status: "online",
    };

    onAddReviewer(newRev);
    setReviewerName("");
    setIsInvitingReviewer(false);
  };

  const getStatusIcon = (status: MangaPage["status"]) => {
    switch (status) {
      case "Approved":
        return <CheckCircle2 size={16} className="text-green-600" />;
      case "Revision":
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return <Clock size={16} className="text-blue-500" />;
    }
  };

  const getStatusBadgeStyle = (status: MangaPage["status"]) => {
    switch (status) {
      case "Approved":
        return "bg-green-50 text-green-700 border-green-200/50";
      case "Revision":
        return "bg-red-50 text-red-700 border-red-200/50";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200/50";
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Project & Chapter Selectors Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1 text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
            <Filter size={12} />
            <span>Bộ lọc xem xét</span>
          </div>
          <h2 className="text-3xl font-bold text-primary">
            Trung tâm Phê duyệt & Phản hồi
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {/* Project selector */}
            {projects.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-on-surface-variant">Dự án:</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => { setSelectedProjectId(e.target.value); setSelectedChapterId(""); }}
                  className="text-xs border border-outline-variant/20 rounded-lg px-2.5 py-1.5 bg-surface-container-low outline-none text-on-surface font-semibold"
                >
                  <option value="">Tất cả dự án</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            )}
            {/* Chapter selector */}
            {projectChapters.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-on-surface-variant">Chương:</label>
                <select
                  value={selectedChapterId}
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                  className="text-xs border border-outline-variant/20 rounded-lg px-2.5 py-1.5 bg-surface-container-low outline-none text-on-surface font-semibold"
                >
                  <option value="">Tất cả chương</option>
                  {projectChapters.map((ch: any) => (
                    <option key={ch.id} value={ch.id}>Ch. {ch.chapterNumber} – {ch.title}</option>
                  ))}
                </select>
              </div>
            )}
            {loadingAssets && (
              <span className="text-xs text-on-surface-variant italic">Đang tải...</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick upload input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          {projectChapters.length === 0 ? (
            <div className="text-sm font-bold px-4 py-2 bg-surface-container-high text-on-surface-variant rounded-xl flex items-center gap-2 border border-outline-variant/30">
              <AlertCircle size={16} />
              Tạo Chapter trước khi tải ảnh
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-primary text-on-primary text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <UploadCloud size={18} />
              Tải Lên Trang Mới
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column - Pages list & details */}
        <div className="lg:col-span-4 space-y-6">
          {/* Page statistics card — real data */}
          {(() => {
            const totalPages = assetPages.length;
            const approvedPages = assetPages.filter(p => p.status === "Approved").length;
            const pendingPages = assetPages.filter(p => p.status === "Pending").length;
            const revisionPages = assetPages.filter(p => p.status === "Revision").length;
            return (
              <div className="bg-white rounded-2xl p-4 border border-outline-variant/15 long-soft-shadow space-y-3">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                  Tiến độ phê duyệt
                </span>
                <p className="text-base font-bold text-on-surface">
                  {approvedPages} / {totalPages} trang đã duyệt xong
                </p>
                {totalPages > 0 && (
                  <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(approvedPages / totalPages) * 100}%` }}
                    />
                  </div>
                )}
                <div className="flex gap-3 text-[10px] font-bold">
                  <span className="text-blue-500">{pendingPages} Chờ duyệt</span>
                  <span className="text-green-600">{approvedPages} Đã duyệt</span>
                  <span className="text-red-500">{revisionPages} Cần sửa</span>
                </div>
              </div>
            );
          })()}

          {/* Pages navigator panel */}
          <div className="bg-white rounded-2xl border border-outline-variant/15 long-soft-shadow overflow-hidden">
            <div className="p-4 border-b border-outline-variant/10 bg-surface-container-low/30">
              <h3 className="font-bold text-on-surface text-sm">
                Danh mục Trang vẽ
              </h3>
            </div>

            <div className="divide-y divide-outline-variant/10 max-h-[360px] overflow-y-auto">
              {assetPages.map((p) => {
                const isSelected = p.id === selectedPageId;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPageId(p.id);
                      setActiveX(null);
                      setActiveY(null);
                    }}
                    className={`p-3.5 flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "bg-primary-container/20 border-l-4 border-primary pl-2.5 font-bold"
                        : "hover:bg-surface-container-low/40"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-12 bg-surface-container-high rounded-md overflow-hidden shrink-0 border border-outline-variant/10">
                        <img
                          src={p.imageUrl}
                          alt={p.fileName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-on-surface truncate">
                          Trang {p.pageNumber.toString().padStart(2, "0")}
                        </p>
                        <p className="text-[10px] text-on-surface-variant truncate max-w-[150px]">
                          {p.fileName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`p-1.5 rounded-full`}>
                        {getStatusIcon(p.status)}
                      </span>
                      {/* Delete option */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (assetPages.length <= 1) return;
                          onDeletePage(p.id);
                          if (isSelected) {
                            const remaining = assetPages.filter(
                              (item) => item.id !== p.id,
                            );
                            setSelectedPageId(remaining[0]?.id || "");
                          }
                        }}
                        className="text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-error hover:bg-error-container/20 p-1 rounded transition-all bg-transparent border-none cursor-pointer"
                        title="Xóa trang vẽ"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review Team Panel: ẩn tạm thời — backend chưa hỗ trợ Reviewer table */}
        </div>

        {/* Right column - Main workspace preview & feedback logs */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6">
          {!selectedPageObj ? (
            <div className="col-span-12 bg-white rounded-2xl border border-outline-variant/15 long-soft-shadow p-12 text-center text-on-surface-variant flex flex-col items-center justify-center min-h-[500px]">
              <UploadCloud size={48} className="stroke-1 mb-2 text-primary opacity-60 animate-pulse" />
              <h3 className="font-bold text-on-surface text-base">Chưa có trang vẽ nào</h3>
              <p className="text-xs text-on-surface-variant mt-1 max-w-xs">
                Hãy nhấn nút "Tải Lên Trang Mới" ở góc phải để tải bản vẽ chương đầu tiên của bạn lên hệ thống duyệt.
              </p>
            </div>
          ) : (
            <>
              {/* Main asset view block */}
              <div className="md:col-span-7 bg-white rounded-2xl border border-outline-variant/15 long-soft-shadow overflow-hidden flex flex-col min-h-[460px]">
                <div className="p-4 border-b border-outline-variant/10 bg-surface-container-low/30 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-on-surface text-sm">
                      Bản nháp Trang {selectedPageObj?.pageNumber?.toString()?.padStart(2, "0") || "00"}
                    </h3>
                    <span className="text-[10px] text-on-surface-variant font-medium">
                      Nhấp vào ảnh để ghim nhận xét chính xác
                    </span>
                  </div>

                  {/* Status flag dropdown/pills */}
                  <div className="flex items-center gap-1 bg-surface-container p-0.5 rounded-xl border border-outline-variant/20">
                    {(["Pending", "Approved", "Revision"] as const).map((st) => {
                      const isDisabled = sendingAction || (st === "Pending" && selectedPageObj.status !== "Pending") || !canReviewAssets;
                      return (
                        <button
                          key={st}
                          onClick={() => {
                            if (!canReviewAssets) return;
                            if (st === "Approved") handleApprove();
                            else if (st === "Revision") handleReject();
                          }}
                          disabled={isDisabled}
                          title={!canReviewAssets ? "Bạn không có quyền duyệt ảnh" : ""}
                          className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${st !== "Pending" && canReviewAssets ? "cursor-pointer" : "cursor-not-allowed"} ${
                            selectedPageObj.status === st
                              ? st === "Approved"
                                ? "bg-green-500 text-white shadow-sm"
                                : st === "Revision"
                                  ? "bg-red-500 text-white shadow-sm"
                                  : "bg-blue-500 text-white shadow-sm"
                              : "text-on-surface-variant hover:text-on-surface hover:bg-white/40"
                          } ${isDisabled ? "opacity-50" : ""}`}
                        >
                          {st === 'Pending' ? 'Chờ duyệt' : st === 'Approved' ? 'Duyệt qua' : 'Cần sửa'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Visual canvas page view */}
                <div className="p-6 flex-1 flex items-center justify-center bg-slate-900/5 relative overflow-hidden">
                  <div
                    ref={previewContainerRef}
                    onClick={handleImageClick}
                    className="relative max-w-full max-h-[480px] rounded-lg shadow-md border border-outline-variant/20 overflow-hidden cursor-crosshair bg-white"
                  >
                    <img
                      src={selectedPageObj?.imageUrl}
                      alt="Review Draft Preview"
                      className="w-auto h-auto max-h-[440px] block"
                    />

                    {/* Render pinpoints overlay */}
                    {(selectedPageObj?.id === "page_1" ? selectedPageObj?.feedbacks : liveReviews).map(
                      (fb) =>
                        fb.x !== undefined &&
                        fb.y !== undefined && (
                          <div
                            key={fb.id}
                            title={`${fb.user || fb.reviewerName}: ${fb.comment}`}
                            style={{ left: `${fb.x}%`, top: `${fb.y}%` }}
                            className="absolute w-6 h-6 -translate-x-3 -translate-y-3 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-md animate-bounce pointer-events-auto"
                          >
                            {(fb.user || fb.reviewerName || "U")[0]}
                          </div>
                        ),
                    )}

                    {/* Render active typing annotation pinpoint */}
                    {activeX !== null && activeY !== null && (
                      <div
                        style={{ left: `${activeX}%`, top: `${activeY}%` }}
                        className="absolute w-6 h-6 -translate-x-3 -translate-y-3 rounded-full bg-error text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-md"
                      >
                        !
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Feedback & commentary column */}
              <div className="md:col-span-5 bg-white rounded-2xl border border-outline-variant/15 long-soft-shadow flex flex-col h-[524px]">
                <div className="p-4 border-b border-outline-variant/10 bg-surface-container-low/30">
                  <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
                    <MessageSquare size={16} className="text-primary" />
                    Bình luận & Góp ý ({selectedPageObj?.feedbacks.length || 0})
                  </h3>
                </div>

                  {/* Comment logs */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {(selectedPageObj?.id === "page_1" ? selectedPageObj?.feedbacks : liveReviews).length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-on-surface-variant/50 p-6">
                        <MessageSquare
                          size={24}
                          className="stroke-1 mb-2 opacity-80 text-primary"
                        />
                        <span className="text-xs font-semibold">Chưa có góp ý nào</span>
                        <p className="text-[10px] text-on-surface-variant mt-1">
                          Hãy là người đầu tiên ghim nhận xét trên trang vẽ này.
                        </p>
                      </div>
                    ) : (
                      (selectedPageObj?.id === "page_1" ? selectedPageObj?.feedbacks : liveReviews).map((fb) => (
                        <div
                          key={fb.id}
                          className="space-y-1 bg-surface-container-low/50 p-3 rounded-xl border border-outline-variant/10"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-on-surface leading-tight">
                              {fb.user || fb.reviewerName || "Vô danh"}
                            </span>
                            <span className="text-[9px] text-on-surface-variant font-medium">
                              {fb.createdAt ? (typeof fb.createdAt === 'string' ? fb.createdAt.split('T')[0] : 'Vừa xong') : 'Vừa xong'}
                            </span>
                          </div>
                          <span className="text-[10px] text-primary font-bold">
                            {fb.role || "Reviewer"}
                          </span>
                          <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                            {fb.comment}
                          </p>

                          {/* Show coordinate marker if annotated */}
                          {fb.x !== undefined && (
                            <span className="inline-block mt-1 bg-primary/10 text-primary text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                              Vị trí ghim @ {fb.x}%, {fb.y}%
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                {/* Annotation status bar if active */}
                {activeX !== null && activeY !== null && (
                  <div className="px-4 py-2 bg-error-container/30 border-t border-error/20 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-error flex items-center gap-1">
                      <Sparkles size={12} /> Ghim nhận xét tại {activeX}%,{activeY}%
                    </span>
                    <button
                      onClick={() => {
                        setActiveX(null);
                        setActiveY(null);
                      }}
                      className="text-error font-bold text-xs bg-transparent border-none cursor-pointer"
                    >
                      Xóa ghim
                    </button>
                  </div>
                )}

                {/* Feedback submit form */}
                <form
                  onSubmit={handleSendComment}
                  className="p-3 border-t border-outline-variant/10 flex gap-2"
                >
                  <input
                    type="text"
                    placeholder={
                      activeX !== null
                        ? "Nhập nội dung ghim nhận xét..."
                        : "Viết bình luận..."
                    }
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-1 bg-surface-container-low border border-transparent rounded-xl px-4 py-2.5 text-xs outline-none focus:border-primary-container focus:bg-white transition-all text-on-surface"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="bg-primary text-on-primary rounded-xl p-2.5 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer flex items-center justify-center"
                  >
                    <Send size={14} />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Invite Reviewer Modal Popup */}
      {isInvitingReviewer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 long-soft-shadow border border-outline-variant/20 space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant/15 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus size={20} className="text-primary" />
                <h3 className="font-bold text-on-surface text-lg">
                  Mời người kiểm duyệt
                </h3>
              </div>
              <button
                onClick={() => setIsInvitingReviewer(false)}
                className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/40 p-1.5 rounded-full transition-colors bg-transparent border-none cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInviteReviewerSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">
                  Họ và tên người kiểm duyệt *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">
                  Vai trò / Chức danh trong Studio
                </label>
                <select
                  value={reviewerRole}
                  onChange={(e) => setReviewerRole(e.target.value)}
                  className="w-full px-3 py-2.5 bg-surface-container-low border border-transparent rounded-xl outline-none text-on-surface text-sm"
                >
                  <option value="Assistant Editor">Trợ lý Biên tập</option>
                  <option value="Lead Editor">Biên tập viên chính</option>
                  <option value="QC Specialist">Chuyên viên kiểm định QC</option>
                  <option value="Senior Creative Lead">
                    Trưởng ban Sáng tạo
                  </option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all mt-4 cursor-pointer text-sm"
              >
                Gửi lời mời tham gia
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
