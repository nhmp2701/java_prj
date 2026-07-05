/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";

import {
  Folder,
  FileText,
  Image as ImageIcon,
  UploadCloud,
  Grid,
  List,
  Trash2,
  Search,
  Eye,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { uploadAsset, getAssets } from "../services/api";
import { Chapter, Project } from "../types";


interface AssetFile {
  id: string;
  name: string;
  type: "image" | "document" | "other";
  size: string;
  updatedAt: string;
  url: string;
  folder: string;
  status?: string;
  chapterId?: string;
}

interface AssetsViewProps {
  authToken?: string;
  canUploadAsset?: boolean;
  onDeleteAsset?: (id: string) => Promise<void> | void;
  assets?: any[];
  onReloadAssets?: () => Promise<void> | void;
  chapters?: Chapter[];
  selectedProject?: Project | null;
}

export default function AssetsView({
  authToken,
  canUploadAsset = true,
  onDeleteAsset,
  assets: externalAssets,
  onReloadAssets,
  chapters = [],
  selectedProject,
}: AssetsViewProps) {
  const [activeFolder, setActiveFolder] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedAssetUrl, setSelectedAssetUrl] = useState<string | null>(null);
  const [uploadingChapterId, setUploadingChapterId] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const projectChapters = chapters.filter(c => !selectedProject || String(c.mangaId) === String(selectedProject.id));
  const hasChapters = projectChapters.length > 0;

  const folders = [
    "Tất cả",
    "Bối cảnh",
    "Ảnh tham khảo",
    "Kịch bản",
    "Hiệu ứng & Screentone",
  ];

  const [localAssets, setLocalAssets] = useState<AssetFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const mapBackendAssets = (data: any[]): AssetFile[] =>
    data.map((asset: any) => ({
      id: String(asset.id),
      name: asset.fileName || `asset_${asset.id}`,
      type: (asset.fileUrl || "").match(/\.(png|jpg|jpeg|gif|webp|svg)$/i) || asset.fileType?.startsWith("image/")
        ? "image"
        : "document",
      size: asset.fileSize ? `${(asset.fileSize / (1024 * 1024)).toFixed(1)} MB` : "?",
      updatedAt: asset.createdAt
        ? new Date(asset.createdAt).toLocaleDateString("vi-VN")
        : "Vừa xong",
      url: asset.fileUrl || "#",
      folder: asset.assetType === "SCRIPT" ? "Kịch bản"
        : asset.assetType === "SCREENTONE" ? "Hiệu ứng & Screentone"
        : asset.assetType === "BACKGROUND" ? "Bối cảnh"
        : "Ảnh tham khảo",
      status: asset.status,
      chapterId: asset.chapterId ? String(asset.chapterId) : undefined,
    }));

  // If external assets are provided by App.tsx, use them; otherwise fetch locally
  useEffect(() => {
    if (externalAssets && Array.isArray(externalAssets)) {
      setLocalAssets(mapBackendAssets(externalAssets));
      return;
    }
    const token = authToken || localStorage.getItem("token") || undefined;
    if (!token) return;
    setIsLoading(true);
    getAssets(token)
      .then((response) => {
        if (response?.success && Array.isArray(response.data)) {
          setLocalAssets(mapBackendAssets(response.data));
        }
      })
      .catch((err) => console.error("Failed to load assets", err))
      .finally(() => setIsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, externalAssets]);



  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canUploadAsset) return;

    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("assetType", "ILLUSTRATION");
    formData.append(
      "description",
      `Được tải lên từ Kho tài nguyên: ${file.name}`,
    );
    const chapterId = uploadingChapterId || projectChapters[0]?.id;
    if (chapterId) {
      formData.append("chapterId", chapterId);
    }

    setIsUploading(true);
    try {
      await uploadAsset(formData, authToken);
      // Reload from backend to show real server URL
      if (onReloadAssets) {
        await onReloadAssets();
      } else {
        const token = authToken || localStorage.getItem("token") || undefined;
        if (token) {
          const response = await getAssets(token);
          if (response?.success && Array.isArray(response.data)) {
            setLocalAssets(mapBackendAssets(response.data));
          }
        }
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      e.target.value = "";
      setIsUploading(false);
    }
  };

  const handleDeleteAsset = async (id: string) => {
    if (onDeleteAsset) {
      await onDeleteAsset(id);
    } else {
      setLocalAssets(localAssets.filter((a) => a.id !== id));
    }
  };

  const assets = localAssets;

  const getStatusIcon = (status?: string) => {
    if (status === "APPROVED") return <CheckCircle2 size={12} className="text-green-500" />;
    if (status === "REJECTED") return <AlertCircle size={12} className="text-red-500" />;
    return <Clock size={12} className="text-blue-400" />;
  };

  const getStatusLabel = (status?: string) => {
    if (status === "APPROVED") return "Đã duyệt";
    if (status === "REJECTED") return "Từ chối";
    return "Chờ duyệt";
  };

  const visibleAssets = selectedProject
    ? localAssets.filter((asset) =>
        asset.chapterId &&
        projectChapters.some((chapter) => String(chapter.id) === String(asset.chapterId)),
      )
    : localAssets;

  const filteredAssets = visibleAssets.filter((asset) => {
    if (activeFolder !== "Tất cả" && asset.folder !== activeFolder) return false;
    if (searchQuery) {
      return asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="space-y-6 select-none animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-primary">Kho tài nguyên</h2>
          <p className="text-sm text-on-surface-variant font-medium">
            Lưu trữ tranh minh họa tham khảo, tệp kịch bản và screentone studio.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*"
          />
          {!hasChapters ? (
            <div className="text-sm font-bold px-4 py-2 bg-surface-container-high text-on-surface-variant rounded-xl flex items-center gap-2 border border-outline-variant/30">
              <AlertCircle size={16} />
              Tạo Chapter trước khi tải ảnh
            </div>
          ) : (
            <button
              onClick={() => canUploadAsset && !isUploading && fileInputRef.current?.click()}
              disabled={!canUploadAsset || isUploading}
              className={`text-sm font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm ${canUploadAsset && !isUploading ? "bg-primary text-on-primary hover:opacity-95 active:scale-95 cursor-pointer" : "bg-surface-container-high text-on-surface-variant cursor-not-allowed"}`}
            >
              <UploadCloud size={18} />
              {isUploading ? "Đang tải lên..." : "Tải Lên Tài Nguyên"}
            </button>
          )}
        </div>
      </div>

      {/* Upload options: chỉ giữ chương selector, bỏ loại tài nguyên (có sidebar rồi) */}
      {canUploadAsset && hasChapters && (
        <div className="bg-white border border-outline-variant/15 rounded-2xl p-4 flex flex-wrap gap-4 items-center">
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Gắn vào chương:</span>
          <select
            value={uploadingChapterId}
            onChange={(e) => setUploadingChapterId(e.target.value)}
            className="text-xs border border-outline-variant/20 rounded-lg px-2.5 py-1.5 bg-surface-container-low outline-none text-on-surface font-semibold"
          >
            <option value="">Không gắn chương</option>
            {projectChapters.map((ch) => (
              <option key={ch.id} value={ch.id}>
                Ch. {ch.chapterNumber} – {ch.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Filter and layout triggers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/15 pb-4">
        {/* folders row */}
        <div className="flex gap-2 bg-surface-container-low/60 p-1 rounded-xl border border-outline-variant/20 overflow-x-auto">
          {folders.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFolder(f)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                activeFolder === f
                  ? "bg-white text-primary shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-white/40"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* search & view toggles */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-on-surface-variant opacity-60">
              <Search size={14} />
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm tài nguyên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/85 border border-outline-variant/20 rounded-xl pl-9 pr-4 py-1.5 text-xs w-48 focus:ring-2 focus:ring-primary-container outline-none transition-all"
            />
          </div>

          <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant/25">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1 rounded cursor-pointer ${viewMode === "grid" ? "bg-white text-primary" : "text-on-surface-variant"}`}
            >
              <Grid size={14} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1 rounded cursor-pointer ${viewMode === "list" ? "bg-white text-primary" : "text-on-surface-variant"}`}
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Asset Grid or List rendering */}
      {isLoading ? (
        <div className="rounded-2xl border border-outline-variant/15 bg-white flex flex-col items-center justify-center p-12 text-center min-h-[300px]">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3 opacity-70" />
          <p className="text-sm font-semibold text-on-surface-variant">Đang tải tài nguyên...</p>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-outline-variant/30 bg-white/40 flex flex-col items-center justify-center p-12 text-center text-on-surface-variant/55 min-h-[300px]">
          <Folder size={32} className="stroke-1 mb-2 text-primary opacity-60" />
          <h3 className="font-bold text-on-surface text-base">
            Chưa có tài nguyên nào
          </h3>
          <p className="text-xs text-on-surface-variant mt-1 max-w-xs">
            Tải lên tệp tranh minh họa, ảnh tham khảo, hoặc kịch bản bằng nút "Tải lên tài nguyên" ở trên.
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID VIEW */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="group bg-white border border-outline-variant/15 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all flex flex-col h-52 relative"
            >
              {/* Thumbnail banner */}
              <div className="flex-1 bg-surface-container relative overflow-hidden flex items-center justify-center">
                {asset.type === "image" && asset.url !== "#" ? (
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <FileText size={32} className="text-on-surface-variant/40" />
                )}

                {/* Status badge */}
                <div className="absolute top-1.5 left-1.5">
                  <span className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                    asset.status === "APPROVED" ? "bg-green-50 text-green-700" :
                    asset.status === "REJECTED" ? "bg-red-50 text-red-700" :
                    "bg-blue-50 text-blue-700"
                  }`}>
                    {getStatusIcon(asset.status)}
                    {getStatusLabel(asset.status)}
                  </span>
                </div>

                {/* Hover preview option */}
                {asset.type === "image" && asset.url !== "#" && (
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => setSelectedAssetUrl(asset.url)}
                      className="p-2 rounded-xl bg-white text-primary hover:bg-primary-container transition-colors shadow cursor-pointer border-none"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Details strip */}
              <div className="p-2.5 bg-white border-t border-outline-variant/10">
                <h4
                  className="text-xs font-bold text-on-surface truncate"
                  title={asset.name}
                >
                  {asset.name}
                </h4>
                <div className="flex justify-between items-center mt-1 text-[9px] text-on-surface-variant font-bold">
                  <span>{asset.size}</span>
                  <button
                    onClick={() => handleDeleteAsset(asset.id)}
                    className="text-on-surface-variant hover:text-error transition-colors bg-transparent border-none cursor-pointer"
                    title="Xóa tài nguyên"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white border border-outline-variant/15 rounded-2xl overflow-hidden divide-y divide-outline-variant/10">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="p-3.5 flex items-center justify-between hover:bg-surface-container-low/35 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {asset.type === "image" && asset.url !== "#" ? (
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-10 h-10 object-cover rounded-lg border border-outline-variant/10 shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : asset.type === "image" ? (
                  <ImageIcon size={16} className="text-primary shrink-0" />
                ) : (
                  <FileText size={16} className="text-secondary shrink-0" />
                )}
                <div className="min-w-0">
                  <span className="text-xs font-bold text-on-surface truncate block max-w-md">
                    {asset.name}
                  </span>
                  <span className="flex items-center gap-1 mt-0.5">
                    {getStatusIcon(asset.status)}
                    <span className="text-[9px] text-on-surface-variant">{getStatusLabel(asset.status)}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 text-xs text-on-surface-variant font-bold">
                <span>{asset.folder}</span>
                <span>{asset.size}</span>
                <span>{asset.updatedAt}</span>
                <button
                  onClick={() => handleDeleteAsset(asset.id)}
                  className="text-on-surface-variant hover:text-error transition-colors p-1 rounded hover:bg-error-container/20 bg-transparent border-none cursor-pointer"
                  title="Xóa tài nguyên"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox asset visualizer */}
      {selectedAssetUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedAssetUrl(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-[#121314] rounded-2xl overflow-hidden border border-white/15 p-4">
            <button
              onClick={() => setSelectedAssetUrl(null)}
              className="absolute top-4 right-4 text-white hover:bg-white/10 p-2 rounded-xl transition-colors bg-transparent border-none cursor-pointer z-10"
            >
              <X size={20} />
            </button>
            <img
              src={selectedAssetUrl}
              alt="Asset Fullscreen"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>

  );
}
