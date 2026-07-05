/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'PLANNING' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'PUBLISHED' | 'CANCELLED';
  updatedAt: string;
  imageUrl: string;
  category: 'All Projects' | 'Drafts' | 'Published';
}

export interface Task {
  id: string;
  projectId: string;
  chapterId?: string;
  title: string;
  description: string;
  column: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  tag: string;
  priority: 'Urgent' | 'Medium' | 'Low';
  dueDate: string;
  assignees: { name: string; avatarUrl: string }[];
}

export interface Feedback {
  id: string;
  user: string;
  role: string;
  comment: string;
  createdAt: string;
  x?: number; // percentage position for annotations
  y?: number;
}

export interface MangaPage {
  id: string;
  projectId: string;
  fileName: string;
  pageNumber: number;
  status: 'Pending' | 'Approved' | 'Revision';
  note?: string;
  uploadedAt: string;
  uploader: string;
  imageUrl: string;
  feedbacks: Feedback[];
}

export interface Reviewer {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarUrl?: string;
  color: string;
  status: 'online' | 'away' | 'offline';
}

export interface UserSession {
  email: string;
  firstName?: string;
  lastName?: string;
  isLoggedIn: boolean;
  username?: string;
  role?: string;
  token?: string;
}

export interface AppUser {
  id: string;
  username: string;
  email: string;
  role: 'ADMIN' | 'TEAM_LEAD' | 'CREATOR' | 'EDITOR' | 'READER';
}

export interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  content?: string;
  status: 'DRAFT' | 'PENDING' | 'SCHEDULED' | 'PUBLISHED' | 'REJECTED';
  mangaId: string;
  scheduledPublishAt?: string;
}
