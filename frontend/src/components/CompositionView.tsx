/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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
    AlertCircle
} from 'lucide-react';
import { Project, Task } from '../types';

interface CompositionViewProps {
    tasks: Task[];
    projects: Project[];
    selectedProject: Project | null;
    onUpdateTaskColumn: (taskId: string, direction: 'prev' | 'next' | 'direct', newCol?: Task['column']) => void;
    onAddTask: (newTask: Task) => void;
    onSelectProjectDirectly: (project: Project) => void;
}

export default function CompositionView({
                                            tasks,
                                            projects,
                                            selectedProject,
                                            onUpdateTaskColumn,
                                            onAddTask,
                                            onSelectProjectDirectly
                                        }: CompositionViewProps) {
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(selectedProject?.id || projects[0]?.id || 'proj_2');

    // New task form fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [column, setColumn] = useState<Task['column']>('TODO');
    const [tag, setTag] = useState('Backgrounds');
    const [priority, setPriority] = useState<Task['priority']>('Medium');
    const [dueDate, setDueDate] = useState('3d left');
    const [selectedAssignee, setSelectedAssignee] = useState('Mika Sato');

    const currentProjectObj = projects.find(p => p.id === selectedProjectId) || projects[0];

    // List of columns
    const columns: { id: Task['column']; title: string; color: string }[] = [
        { id: 'TODO', title: 'To Do', color: 'border-t-4 border-t-blue-500' },
        { id: 'IN_PROGRESS', title: 'In Progress', color: 'border-t-4 border-t-yellow-500' },
        { id: 'REVIEW', title: 'Review', color: 'border-t-4 border-t-pink-500' },
        { id: 'DONE', title: 'Done', color: 'border-t-4 border-t-green-500' }
    ];

    // Preset assignees with photos
    const assigneePresets = [
        {
            name: 'Mika Sato',
            avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDclkyrL7wFDm6Qr_EK9HTLIxB3uAjI4G2USFyNYtMdTdrKi_i5y6xpvaSUtQvPrbFtytQpB8j88AK05x_nkQ-XyM3T52jZ27I3gXpXXt3i7Z5lBEz-TOSSmOMbqIjVP2Z_YsVts-Bfg4B0RBRbxUynQzewuA4tDtZDWgstHBLIa9Kw4HkaFLW7kIFCiSu3_N8EFQnMolDGnN7M9u6UHLMXqXM4AYit-hA-a1rM87cuda_YuHcIGbEsEtjzDysGT61e-K_dV7BINQA'
        },
        {
            name: 'Haru Art',
            avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgMPYWG9O5Kue7Pmsbf2v_sUB6o8SwR8kjiBPwe9lYI_4H4Qy2QGCD5hcyZHBCddQSdHvJWDW36kLW1edvkOpi6HvA1tkj09V1eoBLaICZCNFFUJlBjr64upU7d8Huq6MNSmA54UAYcyx5GtNhD0D-x0ixi8AJryKeH5i-JXTW3PEWXkW9F9i70NL1_z5f_0HrCbvGEniuJQblqadmXVtvaU93NYJeqIVJvJmmlP7CMMrG4q7vWPj2HFiHN0FAEt4NylgSf6wNzmY'
        },
        {
            name: 'Jun Tanaka',
            avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARnqAr_XxVAGjUz6av3mvDkctlxGbVPspJLWvrLSICFexKnjrT3K5B5pyaD0sIjX7h7JPTj2O-X4zemBukUYrdeDjYsK9JgemWQoIx7_bVdGrJ7iKufGeIMy1uAvcOIXmu6-VXs7_0l2litdgfxDd11a7yKBI5MJzMcP051uncu65zUHqQog1tq3c5X_uzBD6QibvNGdFbkrCAipHFsjl1wCnvKm-FG24ABYY3zd-XZtbWkBEqvotbvkqdYSIXagLmp9ZXEbdFDlM'
        },
        {
            name: 'Kaito Hoshino',
            avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnu5NBpZXx6kJ-sAlQYP-XGmO-3tjT6akdWauskW5wLx4a7CVWRM4gb6CWXA6Gl7kVOQrMLwbc_0b_f23XMLZdAu9-ApNPXRmYCWnUY9H9rSI0eJ1IDYXXUIaNUm-IbxPaQoqlOhquAlNNgTjiIZPjS_5bU_PItnhc5_HAi-E0n_qD3MDjgZKqOl8jG9oNHT7hMvQyd6ZEH5b-aBWiNNiiN36zQt973UvlkfKFz2QLiD7AYPFcOnaXcir5peOxouxcJRjR4BDilCQ'
        }
    ];

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const chosenAssignee = assigneePresets.find(a => a.name === selectedAssignee) || assigneePresets[0];

        const newTask: Task = {
            id: `task_${Date.now()}`,
            projectId: selectedProjectId,
            title: title.trim(),
            description: description.trim() || 'No details provided.',
            column,
            tag,
            priority,
            dueDate,
            assignees: [chosenAssignee]
        };

        onAddTask(newTask);

        setTitle('');
        setDescription('');
        setIsAddingTask(false);
    };

    // Filter tasks belonging only to the currently selected project
    const currentProjectTasks = tasks.filter((t) => t.projectId === selectedProjectId);

    const getPriorityBadgeStyles = (pri: Task['priority']) => {
        switch (pri) {
            case 'Urgent':
                return 'bg-error-container/30 text-error';
            case 'Medium':
                return 'bg-orange-100 text-orange-700';
            case 'Low':
                return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6 select-none">
            {/* Kanban Dashboard controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-bold text-primary">Composition Board</h2>
                        <div className="relative">
                            <select
                                value={selectedProjectId}
                                onChange={(e) => {
                                    setSelectedProjectId(e.target.value);
                                    const found = projects.find(p => p.id === e.target.value);
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
                            {/* custom indicator arrow */}
                            <div className="absolute right-2.5 top-2.5 pointer-events-none text-primary">
                                <ChevronLeft size={12} className="rotate-[-90deg]" />
                            </div>
                        </div>
                    </div>
                    <p className="text-sm text-on-surface-variant font-medium mt-1">
                        Managing <span className="font-bold text-primary">{currentProjectTasks.length} active tasks</span> for <span className="font-bold text-primary">{currentProjectObj?.name}</span>.
                    </p>
                </div>

                <button
                    onClick={() => setIsAddingTask(true)}
                    className="bg-primary text-on-primary text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                    <Plus size={18} />
                    Add Composition Task
                </button>
            </div>

            {/* Board Column view */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
                {columns.map((col) => {
                    const colTasks = currentProjectTasks.filter((t) => t.column === col.id);
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
                                        <span className="text-xs font-semibold">Column is empty</span>
                                    </div>
                                ) : (
                                    colTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="bg-white rounded-xl p-4 border border-outline-variant/10 shadow-sm hover:border-primary/20 hover:shadow-md transition-all flex flex-col gap-3 group relative"
                                        >
                                            {/* Top tags & direct transition handlers */}
                                            <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-surface-container-high text-[9px] font-extrabold text-on-surface-variant uppercase tracking-wider">
                          {task.tag}
                        </span>

                                                <div className="flex items-center gap-1">
                                                    {/* Quick transition triggers */}
                                                    {col.id !== 'TODO' && (
                                                        <button
                                                            onClick={() => onUpdateTaskColumn(task.id, 'prev')}
                                                            title="Move back"
                                                            className="p-1 rounded bg-surface-container hover:bg-primary-container hover:text-primary text-on-surface-variant transition-colors bg-transparent border-none cursor-pointer"
                                                        >
                                                            <ChevronLeft size={12} />
                                                        </button>
                                                    )}
                                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${getPriorityBadgeStyles(task.priority)}`}>
                            {task.priority}
                          </span>
                                                    {col.id !== 'DONE' && (
                                                        <button
                                                            onClick={() => onUpdateTaskColumn(task.id, 'next')}
                                                            title="Move forward"
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
                                <h3 className="font-bold text-on-surface text-lg">Add Composition Task</h3>
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
                                <label className="text-xs font-bold text-on-surface-variant">Task Title *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Ink the forest battle scene"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-on-surface-variant">Description / Details</label>
                                <textarea
                                    placeholder="Add specific instructions for artists or review guidelines..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={2}
                                    className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-on-surface-variant">Kanban Status</label>
                                    <select
                                        value={column}
                                        onChange={(e) => setColumn(e.target.value as any)}
                                        className="w-full px-3 py-2.5 bg-surface-container-low border border-transparent rounded-xl outline-none text-on-surface text-sm"
                                    >
                                        <option value="TODO">To Do</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="REVIEW">Review</option>
                                        <option value="DONE">Done</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-on-surface-variant">Category Tag</label>
                                    <select
                                        value={tag}
                                        onChange={(e) => setTag(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-surface-container-low border border-transparent rounded-xl outline-none text-on-surface text-sm"
                                    >
                                        <option value="Backgrounds">Backgrounds</option>
                                        <option value="Inking">Inking</option>
                                        <option value="Drafting">Drafting</option>
                                        <option value="Editing">Editing</option>
                                        <option value="Script">Script</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-on-surface-variant">Priority Level</label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value as any)}
                                        className="w-full px-3 py-2.5 bg-surface-container-low border border-transparent rounded-xl outline-none text-on-surface text-sm"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Urgent">Urgent</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-on-surface-variant">Due Target</label>
                                    <input
                                        type="text"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        placeholder="e.g., 2d left"
                                        className="w-full px-3 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container outline-none text-on-surface text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-on-surface-variant">Assign Artist Team Member</label>
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    {assigneePresets.map((a) => (
                                        <button
                                            key={a.name}
                                            type="button"
                                            onClick={() => setSelectedAssignee(a.name)}
                                            className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all cursor-pointer ${
                                                selectedAssignee === a.name
                                                    ? 'bg-primary-container/30 text-primary border-primary'
                                                    : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container-high/40'
                                            }`}
                                        >
                                            <img src={a.avatarUrl} alt={a.name} referrerPolicy="no-referrer" className="w-5 h-5 rounded-full object-cover" />
                                            <span className="text-xs font-bold truncate">{a.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all mt-4 cursor-pointer text-sm"
                            >
                                Create Task
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
