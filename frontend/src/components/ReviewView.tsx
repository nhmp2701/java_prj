/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
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
    Trash2
} from 'lucide-react';
import { Project, MangaPage, Feedback, Reviewer } from '../types';

interface ReviewViewProps {
    pages: MangaPage[];
    project: Project | null;
    reviewers: Reviewer[];
    onUpdatePageStatus: (pageId: string, status: MangaPage['status']) => void;
    onAddFeedback: (pageId: string, feedback: Feedback) => void;
    onUploadPage: (newPage: MangaPage) => void;
    onAddReviewer: (reviewer: Reviewer) => void;
    onDeletePage: (pageId: string) => void;
}

export default function ReviewView({
                                       pages,
                                       project,
                                       reviewers,
                                       onUpdatePageStatus,
                                       onAddFeedback,
                                       onUploadPage,
                                       onAddReviewer,
                                       onDeletePage
                                   }: ReviewViewProps) {
    const [selectedPageId, setSelectedPageId] = useState(pages[0]?.id || 'page_1');
    const [newComment, setNewComment] = useState('');
    const [isInvitingReviewer, setIsInvitingReviewer] = useState(false);
    const [reviewerName, setReviewerName] = useState('');
    const [reviewerRole, setReviewerRole] = useState('Assistant Editor');

    // Interactive annotation positioning state
    const [activeX, setActiveX] = useState<number | null>(null);
    const [activeY, setActiveY] = useState<number | null>(null);

    const previewContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const selectedPageObj = pages.find(p => p.id === selectedPageId) || pages[0];
    const activeProjectName = project?.name || 'Petals of the Ronin';

    const handleSendComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !selectedPageObj) return;

        const newFb: Feedback = {
            id: `fb_${Date.now()}`,
            user: 'Minh Phương (You)',
            role: 'Creative Director',
            comment: newComment.trim(),
            createdAt: 'Just now',
            ...(activeX !== null && activeY !== null ? { x: activeX, y: activeY } : {})
        };

        onAddFeedback(selectedPageObj.id, newFb);
        setNewComment('');
        setActiveX(null);
        setActiveY(null);
    };

    // Mock file uploader callback
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const file = files[0];

        const randomPresets = [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBYi4G_ECVEGcRKTi1_ESt8bUQuRGAPsXwV6noaZ91JAYMqJbug_ln-l5s_rnYkozK4wIJgYOiEqS-1qFyXcjN3GQHamFSO1hO3I6Mlsv37ecFxzQ5jtbvqNOOVBBYUMQZhqIGzKCEZ9eh3jOOE16mhgBRPCvO_boj4ArvrPcJXhHCTwLVW6gEI0Wuc3zcWiTLyxEWffGaYEcvKtQXTBkR2ZOWF1i3R79LFZeQVahlr-eIk7Cz3cmHW6TPqQZeQLMOYqRCPFZN9-AM',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDI6hc85HpiUJGnoOJJ1OfCGmiCxc3uvTkmfPREwFrxAqRSMEW4Pl8VTMfjKflbeOmzND8h0vvd_m1MR0rTYREEikvLAvNvtBToK0-vlF7azkcKTOy64R4Vo4cOKJmv1HcxwfYumQFDRZ81q2zWd_0k7L7YRd181Wb5YUmXS3r5HF5Day2ffc8gdwyAq1uPajy1fI0FChaGOi6aJLFbwg8gYeEhEuyROjZUYjBR4SBQUpcu6TqCbCHUnKZ7hcIVPqB2z-zpLYy5RbI',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAlm9X574kLWic8_pze4FBiRQndBpkHokdEvM-pM4WDGyZ5sy_Jo119ixjz-GD8gJJZ5Qfnc4uO5bqS1b7Rp71aTbrqkrW1h4Mzs0nci6BjnLmUaJUf8LZuqGmXWIQOxhUc79HjSSLvZGM8qcpzU4PCRYpxMYgUv_OpIUoQvSiY7jm0tIVpGc6MUYgemx-rtbsFQHdBK_win5KXOMpl1wVpG3eCoqhvlB1Ah6XVD0z51qt3sLo5_Olpej5og5rbTTdiuX7OjcyIEzY'
        ];

        const nextNumber = pages.length + 1;
        const newMangaPage: MangaPage = {
            id: `page_${Date.now()}`,
            projectId: project?.id || 'proj_2',
            fileName: file.name,
            pageNumber: nextNumber,
            status: 'Pending',
            uploadedAt: 'Just now',
            uploader: '@You',
            imageUrl: randomPresets[nextNumber % randomPresets.length],
            feedbacks: []
        };

        onUploadPage(newMangaPage);
        setSelectedPageId(newMangaPage.id);
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
            .split(' ')
            .map(n => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase();

        const colors = [
            'bg-red-100 text-red-700',
            'bg-purple-100 text-purple-700',
            'bg-emerald-100 text-emerald-700',
            'bg-amber-100 text-amber-700'
        ];

        const newRev: Reviewer = {
            id: `rev_${Date.now()}`,
            name: reviewerName.trim(),
            role: reviewerRole,
            initials,
            color: colors[Math.floor(Math.random() * colors.length)],
            status: 'online'
        };

        onAddReviewer(newRev);
        setReviewerName('');
        setIsInvitingReviewer(false);
    };

    const getStatusIcon = (status: MangaPage['status']) => {
        switch (status) {
            case 'Approved':
                return <CheckCircle2 size={16} className="text-green-600" />;
            case 'Revision':
                return <AlertCircle size={16} className="text-red-500" />;
            default:
                return <Clock size={16} className="text-blue-500" />;
        }
    };

    const getStatusBadgeStyle = (status: MangaPage['status']) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-50 text-green-700 border-green-200/50';
            case 'Revision':
                return 'bg-red-50 text-red-700 border-red-200/50';
            default:
                return 'bg-blue-50 text-blue-700 border-blue-200/50';
        }
    };

    return (
        <div className="space-y-6 select-none">
            {/* Breadcrumbs Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-1 text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                        <span>Projects</span>
                        <ChevronRight size={12} />
                        <span>{activeProjectName}</span>
                        <ChevronRight size={12} />
                        <span className="text-primary">Chapter Review</span>
                    </div>
                    <h2 className="text-3xl font-bold text-primary">Asset Review Studio</h2>
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
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-primary text-on-primary text-sm font-bold px-5 py-2.5 rounded-xl hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                        <UploadCloud size={18} />
                        Upload New Page
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Left column - Pages list & details */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Page statistics card */}
                    <div className="bg-white rounded-2xl p-4 border border-outline-variant/15 long-soft-shadow flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Review Progress</span>
                            <p className="text-base font-bold text-on-surface">12 of 24 pages finalized</p>
                        </div>
                        <div className="text-right space-y-1">
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Next Deadline</span>
                            <p className="text-xs font-extrabold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">Due in 3 days</p>
                        </div>
                    </div>

                    {/* Pages navigator panel */}
                    <div className="bg-white rounded-2xl border border-outline-variant/15 long-soft-shadow overflow-hidden">
                        <div className="p-4 border-b border-outline-variant/10 bg-surface-container-low/30">
                            <h3 className="font-bold text-on-surface text-sm">Asset Catalog</h3>
                        </div>

                        <div className="divide-y divide-outline-variant/10 max-h-[360px] overflow-y-auto">
                            {pages.map((p) => {
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
                                                ? 'bg-primary-container/20 border-l-4 border-primary pl-2.5 font-bold'
                                                : 'hover:bg-surface-container-low/40'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-12 bg-surface-container-high rounded-md overflow-hidden shrink-0 border border-outline-variant/10">
                                                <img src={p.imageUrl} alt={p.fileName} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-on-surface truncate">
                                                    Page {p.pageNumber.toString().padStart(2, '0')}
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
                                                    if (pages.length <= 1) return;
                                                    onDeletePage(p.id);
                                                    if (isSelected) {
                                                        const remaining = pages.filter(item => item.id !== p.id);
                                                        setSelectedPageId(remaining[0]?.id || '');
                                                    }
                                                }}
                                                className="text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-error hover:bg-error-container/20 p-1 rounded transition-all bg-transparent border-none cursor-pointer"
                                                title="Delete asset"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Review Team Panel */}
                    <div className="bg-white rounded-2xl p-5 border border-outline-variant/15 long-soft-shadow space-y-4">
                        <div className="flex items-center justify-between border-b border-outline-variant/10 pb-3">
                            <h3 className="font-bold text-on-surface text-sm">Review Team</h3>
                            <button
                                onClick={() => setIsInvitingReviewer(true)}
                                className="text-primary hover:text-on-primary-container hover:bg-primary-container/30 p-1 rounded-lg transition-all flex items-center gap-1 font-bold text-xs bg-transparent border-none cursor-pointer"
                            >
                                <UserPlus size={14} />
                                Invite
                            </button>
                        </div>

                        <div className="space-y-3">
                            {reviewers.map((rev) => (
                                <div key={rev.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-white ${rev.color}`}>
                                            {rev.initials}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-on-surface leading-tight">{rev.name}</h4>
                                            <p className="text-[10px] text-on-surface-variant font-medium">{rev.role}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-on-surface-variant">
                                        <span className={`w-2 h-2 rounded-full ${rev.status === 'online' ? 'bg-green-500' : 'bg-amber-400'}`}></span>
                                        <span className="uppercase tracking-wider">{rev.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right column - Main workspace preview & feedback logs */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* Main asset view block */}
                    <div className="md:col-span-7 bg-white rounded-2xl border border-outline-variant/15 long-soft-shadow overflow-hidden flex flex-col min-h-[460px]">
                        <div className="p-4 border-b border-outline-variant/10 bg-surface-container-low/30 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-on-surface text-sm">
                                    Page {selectedPageObj?.pageNumber.toString().padStart(2, '0')} Draft
                                </h3>
                                <span className="text-[10px] text-on-surface-variant font-medium">Click image to drop pinpoint feedbacks</span>
                            </div>

                            {/* Status flag dropdown/pills */}
                            <div className="flex items-center gap-1 bg-surface-container p-0.5 rounded-xl border border-outline-variant/20">
                                {(['Pending', 'Approved', 'Revision'] as const).map((st) => (
                                    <button
                                        key={st}
                                        onClick={() => onUpdatePageStatus(selectedPageObj.id, st)}
                                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                                            selectedPageObj.status === st
                                                ? st === 'Approved'
                                                    ? 'bg-green-500 text-white shadow-sm'
                                                    : st === 'Revision'
                                                        ? 'bg-red-500 text-white shadow-sm'
                                                        : 'bg-blue-500 text-white shadow-sm'
                                                : 'text-on-surface-variant hover:text-on-surface hover:bg-white/40'
                                        }`}
                                    >
                                        {st}
                                    </button>
                                ))}
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
                                {selectedPageObj?.feedbacks.map((fb) => fb.x !== undefined && fb.y !== undefined && (
                                    <div
                                        key={fb.id}
                                        title={`${fb.user}: ${fb.comment}`}
                                        style={{ left: `${fb.x}%`, top: `${fb.y}%` }}
                                        className="absolute w-6 h-6 -translate-x-3 -translate-y-3 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center border-2 border-white shadow-md animate-bounce pointer-events-auto"
                                    >
                                        {fb.user[0]}
                                    </div>
                                ))}

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
                                Comments ({selectedPageObj?.feedbacks.length || 0})
                            </h3>
                        </div>

                        {/* Comment logs */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {selectedPageObj?.feedbacks.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-on-surface-variant/50 p-6">
                                    <MessageSquare size={24} className="stroke-1 mb-2 opacity-80 text-primary" />
                                    <span className="text-xs font-semibold">No feedback yet</span>
                                    <p className="text-[10px] text-on-surface-variant mt-1">Be the first to submit a review annotation.</p>
                                </div>
                            ) : (
                                selectedPageObj?.feedbacks.map((fb) => (
                                    <div key={fb.id} className="space-y-1 bg-surface-container-low/50 p-3 rounded-xl border border-outline-variant/10">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-on-surface leading-tight">{fb.user}</span>
                                            <span className="text-[9px] text-on-surface-variant font-medium">{fb.createdAt}</span>
                                        </div>
                                        <span className="text-[10px] text-primary font-bold">{fb.role}</span>
                                        <p className="text-xs text-on-surface-variant leading-relaxed mt-1">{fb.comment}</p>

                                        {/* Show coordinate marker if annotated */}
                                        {fb.x !== undefined && (
                                            <span className="inline-block mt-1 bg-primary/10 text-primary text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase">
                        Marker @ {fb.x}%, {fb.y}%
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
                  <Sparkles size={12} /> Place pinpoint feedback @ {activeX}%, {activeY}%
                </span>
                                <button
                                    onClick={() => {
                                        setActiveX(null);
                                        setActiveY(null);
                                    }}
                                    className="text-error font-bold text-xs bg-transparent border-none cursor-pointer"
                                >
                                    Clear
                                </button>
                            </div>
                        )}

                        {/* Feedback submit form */}
                        <form onSubmit={handleSendComment} className="p-3 border-t border-outline-variant/10 flex gap-2">
                            <input
                                type="text"
                                placeholder={activeX !== null ? "Type annotation feedback..." : "Write a comment..."}
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

                </div>

            </div>

            {/* Invite Reviewer Modal Popup */}
            {isInvitingReviewer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 long-soft-shadow border border-outline-variant/20 space-y-4">
                        <div className="flex justify-between items-center border-b border-outline-variant/15 pb-3">
                            <div className="flex items-center gap-2">
                                <UserPlus size={20} className="text-primary" />
                                <h3 className="font-bold text-on-surface text-lg">Invite Reviewer</h3>
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
                                <label className="text-xs font-bold text-on-surface-variant">Reviewer Full Name *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., Haruto Takahashi"
                                    value={reviewerName}
                                    onChange={(e) => setReviewerName(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-surface-container-low border border-transparent rounded-xl focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all outline-none text-on-surface text-sm"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-on-surface-variant">Studio Role / Title</label>
                                <select
                                    value={reviewerRole}
                                    onChange={(e) => setReviewerRole(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-surface-container-low border border-transparent rounded-xl outline-none text-on-surface text-sm"
                                >
                                    <option value="Assistant Editor">Assistant Editor</option>
                                    <option value="Lead Editor">Lead Editor</option>
                                    <option value="QC Specialist">QC Specialist</option>
                                    <option value="Senior Creative Lead">Senior Creative Lead</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 active:scale-95 transition-all mt-4 cursor-pointer text-sm"
                            >
                                Send Invite Proposal
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
