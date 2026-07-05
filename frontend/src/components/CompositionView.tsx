/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Plus,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  UserPlus,
  X,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Trash2,
  Pencil,
} from "lucide-react";
import { Project, Task } from "../types";

interface CompositionViewProps {
  tasks: Task[];
  projects: Project[];
  selectedProject: Project | null;
  selectedChapter?: any | null;
  onUpdateTaskColumn: (
    taskId: string,
    direction: "prev" | "next" | "direct",
    newCol?: Task["column"],
  ) => void;
  onAddTask: (newTask: Task) => Promise<void> | void;
  onSelectProjectDirectly: (project: Project) => void;
  canManageTasks?: boolean;
  onDeleteTask?: (taskId: string) => void;
  onUpdateTaskDetails?: (taskId: string, updates: Partial<Task>) => void;
  chapters?: any[];
}

export default function CompositionView({
  tasks,
  projects,
  selectedProject,
  selectedChapter,
  onUpdateTaskColumn,
  onAddTask,
  onSelectProjectDirectly,
  canManageTasks = true,
  onDeleteTask,
  onUpdateTaskDetails,
  chapters = [],
}: CompositionViewProps) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(
    selectedProject?.id || projects[0]?.id || "",
  );

  const projectChapters = chapters.filter(c => String(c.mangaId) === String(selectedProjectId));
  const hasChapters = projectChapters.length > 0;
  // Task detail editor modal
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editColumn, setEditColumn] = useState<Task["column"]>("TODO");
  const [editPriority, setEditPriority] = useState<Task["priority"]>("Medium");
  const [editDueDate, setEditDueDate] = useState("");
  const [editTag, setEditTag] = useState("Backgrounds");

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditColumn(task.column);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate || "");
    setEditTag(task.tag || "Backgrounds");
  };

  const handleSaveEdit = () => {
    if (!editingTask) return;
    const updates: Partial<Task> = {
      title: editTitle.trim(),
      description: editDescription.trim(),
      column: editColumn,
      priority: editPriority,
      dueDate: editDueDate,
      tag: editTag,
    };
    if (onUpdateTaskDetails) {
      onUpdateTaskDetails(editingTask.id, updates);
    }
    setEditingTask(null);
  };

  // New task form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [column, setColumn] = useState<Task["column"]>("TODO");
  const [tag, setTag] = useState("Backgrounds");
  const [priority, setPriority] = useState<Task["priority"]>("Medium");
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [assigneeName, setAssigneeName] = useState(""); // Free-form assignee
  // Auto-select chapter if coming from ChaptersView navigation
  const [selectedChapterId, setSelectedChapterId] = useState(selectedChapter?.id || "");


  const currentProjectObj =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  // List of columns
  const columns: { id: Task["column"]; title: string; color: string }[] = [
    { id: "TODO", title: "Cần làm", color: "border-t-4 border-t-blue-500" },
    {
      id: "IN_PROGRESS",
      title: "Đang tiến hành",
      color: "border-t-4 border-t-yellow-500",
    },
    { id: "REVIEW", title: "Duyệt & Đánh giá", color: "border-t-4 border-t-pink-500" },
    { id: "DONE", title: "Hoàn thành", color: "border-t-4 border-t-green-500" },
  ];



  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManageTasks || !title.trim() || !selectedChapterId) return;

    const newTask: Task = {
      id: `task_${Date.now()}`,
      projectId: selectedChapterId, // App.tsx maps projectId to chapterId in handleAddTask
      title: title.trim(),
      description: description.trim(),
      column,
      tag: `Chương ${selectedChapterId}`,
      priority,
      dueDate,
      assignees: assigneeName.trim()
        ? [{ name: assigneeName.trim(), avatarUrl: "" }]
        : [],
    };

    try {
      setIsSubmittingTask(true);
      await onAddTask(newTask);
      setTitle("");
      setDescription("");
      setAssigneeName("");
      setDueDate(new Date().toISOString().split("T")[0]);
      setIsAddingTask(false);
    } finally {
      setIsSubmittingTask(false);
    }
  };


  // Filter tasks by selected chapter if we came from ChaptersView, else show all tasks of current project's chapters
  const currentProjectTasks = selectedChapter
    ? tasks.filter(t => String(t.projectId) === String(selectedChapter.id))
    : tasks.filter(
        (t) => projectChapters.some(ch => String(ch.id) === String(t.projectId))
      );

  const getPriorityBadgeStyles = (pri: Task["priority"]) => {
    switch (pri) {
      case "Urgent":
        return "bg-error-container/30 text-error";
      case "Medium":
        return "bg-orange-100 text-orange-700";
      case "Low":
        return "bg-slate-100 text-slate-700";
    }
  };

  const getPriorityLabel = (pri: Task["priority"]) => {
    switch (pri) {
      case "Urgent":
        return "Khẩn cấp";
      case "Medium":
        return "Trung bình";
      case "Low":
        return "Thấp";
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* Kanban Dashboard controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-primary">
              Tiến độ sản xuất
            </h2>
            {selectedChapter ? (
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-200">
                Chương {selectedChapter.chapterNumber}: {selectedChapter.title}
              </span>
            ) : (
              <div className="relative">
                <select
                  value={selectedProjectId}
                  onChange={(e) => {
                    setSelectedProjectId(e.target.value);
                    const found = projects.find((p) => p.id === e.target.value);
                    if (found) onSelectProjectDirectly(found);
                  }}
                  className="bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary font-bold text-xs py-1.5 px-3.5 rounded-xl cursor-pointer outline-none transition-all pr-8 appearance-none"
                >
                  {projects.map((proj) => (
                    <option
                      key={proj.id}
                      value={proj.id}
                      className="text-on-surface font-semibold"
                    >
                      {proj.name}
                    </option>
                  ))}
                </select>
                {/* custom indicator arrow */}
                <div className="absolute right-2.5 top-2.5 pointer-events-none text-primary">
                  <ChevronLeft size={12} className="rotate-[-90deg]" />
                </div>
              </div>
            )}
          </div>
          <p className="text-sm text-on-surface-variant font-medium mt-1">
            Đang quản lý{" "}
            <span className="font-bold text-primary">
              {currentProjectTasks.length} nhiệm vụ tích cực
            </span>{" "}
            {selectedChapter ? (
              <>cho chương <span className="font-bold text-primary">{selectedChapter.title}</span></>
            ) : (
              <>cho dự án <span className="font-bold text-primary">{currentProjectObj?.name}</span></>
            )}
            .
          </p>
        </div>

        {!hasChapters ? (
          <div className="text-sm font-bold px-4 py-2 bg-surface-container-high text-on-surface-variant rounded-xl flex items-center gap-2 border border-outline-variant/30">
            <AlertCircle size={16} />
            Tạo Chapter trước khi thêm Task
          </div>
        ) : (
          <button
            onClick={() => canManageTasks && setIsAddingTask(true)}
            disabled={!canManageTasks}
            className={`text-sm font-bold px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm ${canManageTasks ? "bg-primary text-on-primary hover:opacity-95 active:scale-95 cursor-pointer" : "bg-surface-container-high text-on-surface-variant cursor-not-allowed"}`}
          >
            <Plus size={18} />
            Thêm Nhiệm Vụ Mới
          </button>
        )}
      </div>

      {/* Board Column view */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        {columns.map((col) => {
          const colTasks = currentProjectTasks.filter(
            (t) => t.column === col.id,
          );
          return (
            <div
              key={col.id}
              className={`bg-surface-container-low rounded-2xl p-4 flex flex-col gap-4 border border-outline-variant/15 min-h-[500px] ${col.color}`}
            >
              {/* Column title */}
              <div className="flex items-center justify-between px-1">
                <h3 className="font-bold text-on-surface text-sm flex items-center gap-2">
                  {col.title}
                  <span className="w-5 h-5 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-on-surface-variant">
                    {colTasks.length}
                  </span>
                </h3>
                <button
                  onClick={() => {
                    setColumn(col.id);
                    setIsAddingTask(true);
                  }}
                  className="text-on-surface-variant hover:text-primary transition-colors hover:bg-surface-container-high/40 p-1 rounded-lg bg-transparent border-none cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Column task cards */}
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                {colTasks.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/20 rounded-xl p-8 text-center text-on-surface-variant/50 min-h-[160px]">
                    <AlertCircle size={20} className="stroke-1 mb-1" />
                    <span className="text-xs font-semibold">
                      Cột này đang trống
                    </span>
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white rounded-xl p-4 border border-outline-variant/10 shadow-sm hover:border-primary/20 hover:shadow-md transition-all flex flex-col gap-3 group relative cursor-pointer"
                      onClick={() => openEditModal(task)}
                    >
                      {/* Delete button on hover - stop propagation so it doesn't open edit modal */}
                      {canManageTasks && onDeleteTask && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onDeleteTask(task.id); }}
                          title="Xóa nhiệm vụ"
                          className="absolute top-2 right-2 p-1 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/20 opacity-0 group-hover:opacity-100 transition-all bg-transparent border-none cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}

                      {/* Top tags & direct transition handlers */}
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-surface-container-high text-[9px] font-extrabold text-on-surface-variant uppercase tracking-wider">
                          {task.tag === 'Backgrounds' ? 'Vẽ bối cảnh' : task.tag === 'Inking' ? 'Đi nét' : task.tag === 'Drafting' ? 'Phác thảo' : task.tag === 'Editing' ? 'Biên tập' : task.tag === 'Script' ? 'Kịch bản' : task.tag}
                        </span>

                        <div className="flex items-center gap-1">
                          {/* Quick transition triggers */}
                          {col.id !== "TODO" && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onUpdateTaskColumn(task.id, "prev"); }}
                              title="Chuyển về trước"
                              className="p-1 rounded bg-surface-container hover:bg-primary-container hover:text-primary text-on-surface-variant transition-colors bg-transparent border-none cursor-pointer"
                            >
                              <ChevronLeft size={12} />
                            </button>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold ${getPriorityBadgeStyles(task.priority)}`}
                          >
                            {getPriorityLabel(task.priority)}
                          </span>
                          {col.id !== "DONE" && (
                            <button
                              onClick={(e) => { e.stopPropagation(); onUpdateTaskColumn(task.id, "next"); }}
                              title="Chuyển tiếp sau"
                              className="p-1 rounded bg-surface-container hover:bg-primary-container hover:text-primary text-on-surface-variant transition-colors bg-transparent border-none cursor-pointer"
                            >
                              <ChevronRight size={12} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="space-y-1">
                        <h4 className="font-bold text-on-surface text-sm group-hover:text-primary transition-colors leading-snug">
                          {task.title}
                        </h4>
                        <p className="text-xs text-on-surface-variant font-medium line-clamp-2">
                          {task.description}
                        </p>
                      </div>

                      {/* Card Footer: DueDate, Avatars */}
                      <div className="flex items-center justify-between pt-3 border-t border-outline-variant/10 mt-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant">
                          <Clock size={12} className="opacity-75" />
                          <span>{task.dueDate}</span>
                        </div>

                        {/* Avatars stacked list */}
                        <div className="flex -space-x-1.5 overflow-hidden">
                          {task.assignees.map((assignee, idx) => (
                            <img
                              key={idx}
                              src={assignee.avatarUrl}
                              alt={assignee.name}
                              title={assignee.name}
                              referrerPolicy="no-referrer"
                              className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Edit hint */}
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-60 transition-opacity">
                        <Pencil size={10} className="text-on-surface-variant" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Creation Modal Drawer */}
      {isAddingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 long-soft-shadow border border-outline-variant/20 space-y-4">
            <div className="flex justify-between items-center border-b border-outline-variant/15 pb-3">
              <div className="flex items-center gap-2">
                <Plus size={20} className="text-primary" />
                <h3 className="font-bold text-on-surface text-lg">
                  Thêm Nhiệm Vụ Mới
                </h3>
              </div>
              <button
                onClick={() => setIsAddingTask(false)}
                className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/40 p-1.5 rounded-full transition-colors bg-transparent border-none cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">
                  Tiêu đề nhiệm vụ *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Đi nét cảnh chiến đấu trong rừng"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">
                  Mô tả chi tiết / Hướng dẫn
                </label>
                <textarea
                  placeholder="Thêm hướng dẫn chi tiết cho họa sĩ hoặc tiêu chí kiểm duyệt..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">
                    Trạng thái Kanban
                  </label>
                  <select
                    value={column}
                    onChange={(e) => setColumn(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-surface-container-low border border-transparent rounded-xl outline-none text-on-surface text-sm"
                  >
                    <option value="TODO">Cần làm</option>
                    <option value="IN_PROGRESS">Đang tiến hành</option>
                    <option value="REVIEW">Chờ đánh giá</option>
                    <option value="DONE">Hoàn thành</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">
                    Chọn Chương *
                  </label>
                  <select
                    required
                    value={selectedChapterId}
                    onChange={(e) => setSelectedChapterId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-surface-container-low border border-transparent rounded-xl outline-none text-on-surface text-sm font-semibold"
                  >
                    <option value="" disabled>-- Chọn Chương --</option>
                    {projectChapters.map(ch => (
                      <option key={ch.id} value={ch.id}>Chương {ch.chapterNumber}: {ch.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">
                  Hạn hoàn thành
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container outline-none text-on-surface text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">
                  Giao cho (Tên thành viên)
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên thành viên..."
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                />
              </div>


              <button
                type="submit"
                disabled={isSubmittingTask}
                className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all mt-4 cursor-pointer text-sm disabled:opacity-60 disabled:cursor-wait"
              >
                Tạo Nhiệm Vụ
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Task Detail & Edit Modal */}
      {editingTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          onClick={() => setEditingTask(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 long-soft-shadow border border-outline-variant/20 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex justify-between items-center border-b border-outline-variant/15 pb-3">
              <div className="flex items-center gap-2">
                <Pencil size={18} className="text-primary" />
                <h3 className="font-bold text-on-surface text-lg">Chi tiết & Chỉnh sửa nhiệm vụ</h3>
              </div>
              <button
                onClick={() => setEditingTask(null)}
                className="text-on-surface-variant hover:text-on-surface p-2 rounded-xl hover:bg-surface-container-low transition-colors bg-transparent border-none cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">Tiêu đề nhiệm vụ</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm font-bold"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">Mô tả</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm resize-none"
                />
              </div>

              {/* Row: Column + Priority + Tag */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">Trạng thái</label>
                  <select
                    value={editColumn}
                    onChange={(e) => setEditColumn(e.target.value as Task["column"])}
                    className="w-full px-3 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container outline-none text-on-surface text-xs"
                  >
                    <option value="TODO">Cần làm</option>
                    <option value="IN_PROGRESS">Đang tiến hành</option>
                    <option value="REVIEW">Duyệt & Đánh giá</option>
                    <option value="DONE">Hoàn thành</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">Độ ưu tiên</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as Task["priority"])}
                    className="w-full px-3 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container outline-none text-on-surface text-xs"
                  >
                    <option value="Urgent">Khẩn cấp</option>
                    <option value="Medium">Trung bình</option>
                    <option value="Low">Thấp</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">Loại công việc</label>
                  <select
                    value={editTag}
                    onChange={(e) => setEditTag(e.target.value)}
                    className="w-full px-3 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container outline-none text-on-surface text-xs"
                  >
                    <option value="Backgrounds">Vẽ bối cảnh</option>
                    <option value="Drafting">Phác thảo</option>
                    <option value="Inking">Đi nét</option>
                    <option value="Editing">Biên tập</option>
                    <option value="Script">Kịch bản</option>
                  </select>
                </div>
              </div>

              {/* Due date */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant">Hạn hoàn thành</label>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container outline-none text-on-surface text-sm"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2 border-t border-outline-variant/15">
              {canManageTasks && onDeleteTask && (
                <button
                  onClick={() => { onDeleteTask(editingTask.id); setEditingTask(null); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-error/30 text-error hover:bg-error-container/20 transition-colors text-sm font-bold bg-transparent cursor-pointer"
                >
                  <Trash2 size={14} />
                  Xóa nhiệm vụ
                </button>
              )}
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-primary text-white font-bold py-2.5 rounded-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer text-sm flex items-center justify-center gap-2"
              >
                <Pencil size={14} />
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
}
