/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import DashboardView from './components/DashboardView';
// The following components are not on disk yet. We comment imports out and stub them below.
// import Sidebar from './components/Sidebar';
// import AssetsView from './components/AssetsView';
// import CompositionView from './components/CompositionView';
// import ReviewView from './components/ReviewView';
// import LibraryView from './components/LibraryView';
// import ReaderView from './components/ReaderView';

import { Project, Task, MangaPage, Feedback, Reviewer, UserSession } from './types';
import { INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_PAGES, INITIAL_REVIEWERS } from './mockData';

// Stub components directly in App.tsx to bypass missing file compile errors while complying with "no new component files" instruction.
const Sidebar = ({ activeTab, setActiveTab, session, onLogout }: any) => (
  <div className="w-64 bg-surface-container-low border-r border-outline-variant/15 p-6 flex flex-col justify-between fixed h-screen left-0 top-0 bg-white shadow-sm z-30">
    <div className="space-y-6">
      <h3 className="font-bold text-primary text-lg">MangaFlow Pro</h3>
      <div className="space-y-1">
        {['dashboard', 'assets', 'composition', 'review', 'library'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs capitalize transition-all cursor-pointer ${
              activeTab === tab ? 'bg-primary/10 text-primary font-extrabold' : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
    <div className="pt-4 border-t border-outline-variant/10 space-y-3">
      <div className="text-xs">
        <p className="font-bold truncate">{session.username || session.firstName}</p>
        <p className="text-on-surface-variant truncate">{session.email}</p>
      </div>
      <button
        onClick={onLogout}
        className="w-full bg-error-container/20 text-error hover:bg-error-container/40 text-xs font-bold py-2 rounded-lg cursor-pointer transition-all"
      >
        Logout
      </button>
    </div>
  </div>
);

const AssetsView = () => <div className="p-6 bg-white rounded-2xl border border-outline-variant/15">Assets View (Placeholder - File components/AssetsView.tsx chưa được tạo)</div>;
const CompositionView = ({ onAddTask, projects }: any) => (
  <div className="p-6 bg-white rounded-2xl border border-outline-variant/15 space-y-4">
    <h3 className="font-bold text-lg">Composition View (Placeholder)</h3>
    <p className="text-sm text-on-surface-variant">File components/CompositionView.tsx chưa được tạo. Bạn có thể tự tạo nó sau.</p>
    <button 
      onClick={() => onAddTask({
        id: String(Date.now()),
        projectId: projects[0]?.id || '1',
        title: 'New Manga Task via Placeholder',
        description: 'Auto task description',
        column: 'TODO',
        tag: 'Chapter 1',
        priority: 'Medium',
        dueDate: new Date().toISOString().split('T')[0],
        assignees: []
      })}
      className="bg-primary text-on-primary text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer hover:opacity-90 active:scale-95 transition-all"
    >
      Quick Add Task Test (Backend Connect)
    </button>
  </div>
);
const ReviewView = () => <div className="p-6 bg-white rounded-2xl border border-outline-variant/15">Review View (Placeholder - File components/ReviewView.tsx chưa được tạo)</div>;
const LibraryView = ({ onAddProject }: any) => (
  <div className="p-6 bg-white rounded-2xl border border-outline-variant/15 space-y-4">
    <h3 className="font-bold text-lg">Library View (Placeholder)</h3>
    <p className="text-sm text-on-surface-variant">File components/LibraryView.tsx chưa được tạo.</p>
    <button
      onClick={() => onAddProject({
        id: String(Date.now()),
        name: 'New Project via Placeholder',
        description: 'Dynamic library workspace project',
        status: 'PLANNING',
        updatedAt: new Date().toISOString().split('T')[0],
        imageUrl: '',
        category: 'All Projects'
      })}
      className="bg-primary text-on-primary text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer hover:opacity-90 active:scale-95 transition-all"
    >
      Quick Add Project Test (Backend Connect)
    </button>
  </div>
);
const ReaderView = ({ onExitReader }: any) => (
  <div className="p-8 space-y-4">
    <h3 className="font-bold text-lg">Reader Mode (Placeholder)</h3>
    <button onClick={onExitReader} className="bg-primary text-on-primary text-xs font-bold px-4 py-2 rounded-xl">Exit Reader</button>
  </div>
);

export default function App() {
  const [session, setSession] = useState<UserSession>({
    email: 'nguyenhuynhminhphuong2701@gmail.com',
    firstName: 'Minh Phương',
    lastName: 'Nguyễn',
    isLoggedIn: false
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [pages, setPages] = useState<MangaPage[]>(INITIAL_PAGES);
  const [reviewers, setReviewers] = useState<Reviewer[]>(INITIAL_REVIEWERS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Fetch projects and tasks helper
  const fetchData = (authToken: string) => {
    fetch('http://localhost:8080/projects', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(res => res.json())
    .then(apiRes => {
      if (apiRes.success && Array.isArray(apiRes.data)) {
        const mapped = apiRes.data.map((proj: any) => ({
          id: String(proj.id),
          name: proj.title,
          description: proj.description,
          status: proj.status,
          updatedAt: proj.startDate || new Date().toISOString().split('T')[0],
          imageUrl: proj.coverUrl || 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80',
          category: proj.status === 'COMPLETED' ? 'Published' : (proj.status === 'PLANNING' ? 'Drafts' : 'All Projects')
        }));
        setProjects(mapped);
        if (mapped.length > 0) {
          setSelectedProject(mapped[0]);
        }
      }
    })
    .catch(err => console.error("Failed to fetch projects", err));

    fetch('http://localhost:8080/api/tasks', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(res => res.json())
    .then(apiRes => {
      if (apiRes.success && Array.isArray(apiRes.data)) {
        const mapped = apiRes.data.map((task: any) => ({
          id: String(task.id),
          projectId: String(task.chapterId || 1),
          title: task.title,
          description: task.description || '',
          column: task.status,
          tag: 'Chapter ' + (task.chapterId || 1),
          priority: 'Medium',
          dueDate: task.updatedAt ? task.updatedAt.split('T')[0] : new Date().toISOString().split('T')[0],
          assignees: task.assignedTo ? [{ name: task.assignedTo, avatarUrl: '' }] : []
        }));
        setTasks(mapped);
      }
    })
    .catch(err => console.error("Failed to fetch tasks", err));
  };

  // Auto load session on startup
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('http://localhost:8080/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) throw new Error('Token invalid or expired');
        return res.json();
      })
      .then(profileRes => {
        if (profileRes.success && profileRes.data) {
          const profile = profileRes.data;
          const nameParts = profile.username ? profile.username.split(' ') : ['User', ''];
          setSession({
            email: profile.email,
            firstName: nameParts[0],
            lastName: nameParts.slice(1).join(' '),
            isLoggedIn: true,
            role: profile.role,
            username: profile.username,
            token: token
          });
          fetchData(token);
        } else {
          throw new Error('Invalid profile details');
        }
      })
      .catch(err => {
        console.error("Auto login validation failed", err);
        localStorage.removeItem('token');
        setSession(prev => ({ ...prev, isLoggedIn: false }));
      });
    }
  }, []);

  // Auth actions
  const handleLoginSuccess = (userSession: UserSession) => {
    setSession(userSession);
    setActiveTab('dashboard');
    if (userSession.token) {
      fetchData(userSession.token);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setSession({
      email: '',
      isLoggedIn: false
    });
  };

  // Select project and route tabs
  const handleSelectProject = (project: Project, tabRedirect: string) => {
    setSelectedProject(project);
    setActiveTab(tabRedirect);
  };

  // Library actions
  const handleAddProject = (newProject: Project) => {
    const token = localStorage.getItem('token') || session.token;
    if (!token) return;

    fetch('http://localhost:8080/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: newProject.name,
        description: newProject.description,
        status: newProject.status,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        coverUrl: newProject.imageUrl,
        authorName: session.username || session.firstName
      })
    })
    .then(res => res.json())
    .then(apiRes => {
      if (apiRes.success && apiRes.data) {
        const created = apiRes.data;
        const mapped: Project = {
          id: String(created.id),
          name: created.title,
          description: created.description,
          status: created.status,
          updatedAt: created.startDate,
          imageUrl: created.coverUrl || newProject.imageUrl,
          category: created.status === 'COMPLETED' ? 'Published' : (created.status === 'PLANNING' ? 'Drafts' : 'All Projects')
        };
        setProjects(prev => [mapped, ...prev]);
        setSelectedProject(mapped);
      }
    })
    .catch(err => console.error("Failed to add project", err));
  };

  // Composition actions
  const handleAddTask = (newTask: Task) => {
    const token = localStorage.getItem('token') || session.token;
    if (!token) return;

    fetch('http://localhost:8080/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: newTask.title,
        description: newTask.description,
        assignedTo: newTask.assignees.length > 0 ? newTask.assignees[0].name : '',
        status: newTask.column,
        chapterId: Number(newTask.projectId) || null
      })
    })
    .then(res => res.json())
    .then(apiRes => {
      if (apiRes.success && apiRes.data) {
        const createdTask = apiRes.data;
        const mapped: Task = {
          id: String(createdTask.id),
          projectId: String(createdTask.chapterId || 1),
          title: createdTask.title,
          description: createdTask.description || '',
          column: createdTask.status,
          tag: 'Chapter ' + (createdTask.chapterId || 1),
          priority: 'Medium',
          dueDate: new Date().toISOString().split('T')[0],
          assignees: createdTask.assignedTo ? [{ name: createdTask.assignedTo, avatarUrl: '' }] : []
        };
        setTasks(prev => [mapped, ...prev]);
      }
    })
    .catch(err => console.error("Failed to add task", err));
  };

  const handleUpdateTaskColumn = (taskId: string, direction: 'prev' | 'next' | 'direct', newCol?: Task['column']) => {
    const columns: Task['column'][] = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
    const currentTask = tasks.find(t => t.id === taskId);
    if (!currentTask) return;

    let targetCol = currentTask.column;
    if (direction === 'next') {
      const idx = columns.indexOf(currentTask.column);
      if (idx < columns.length - 1) targetCol = columns[idx + 1];
    } else if (direction === 'prev') {
      const idx = columns.indexOf(currentTask.column);
      if (idx > 0) targetCol = columns[idx - 1];
    } else if (direction === 'direct' && newCol) {
      targetCol = newCol;
    }

    const token = localStorage.getItem('token') || session.token;
    if (!token) return;

    fetch(`http://localhost:8080/api/tasks/${taskId}/status?status=${targetCol}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to update task status');
      return res.json();
    })
    .then(apiRes => {
      if (apiRes.success) {
        setTasks(prevTasks => 
          prevTasks.map((t) => {
            if (t.id !== taskId) return t;
            return { ...t, column: targetCol };
          })
        );
      }
    })
    .catch(err => console.error("Failed to update status in backend", err));
  };

  // Review asset actions
  const handleUpdatePageStatus = (pageId: string, status: MangaPage['status']) => {
    setPages(prevPages => 
      prevPages.map(p => p.id === pageId ? { ...p, status } : p)
    );
  };

  const handleAddFeedback = (pageId: string, fb: Feedback) => {
    setPages(prevPages => 
      prevPages.map(p => p.id === pageId ? { ...p, feedbacks: [...p.feedbacks, fb] } : p)
    );
  };

  const handleUploadPage = (newPage: MangaPage) => {
    setPages([newPage, ...pages]);
  };

  const handleDeletePage = (pageId: string) => {
    setPages(pages.filter(p => p.id !== pageId));
  };

  const handleAddReviewer = (newRev: Reviewer) => {
    setReviewers([...reviewers, newRev]);
  };

  // Render correct tab view panel
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            session={session}
            projects={projects}
            tasks={tasks}
            pages={pages}
            onSelectProject={handleSelectProject}
            onNavigateTab={setActiveTab}
            onUpdateTaskColumn={handleUpdateTaskColumn}
          />
        );
      case 'assets':
        return <AssetsView />;
      case 'composition':
        return (
          <CompositionView 
            tasks={tasks}
            projects={projects}
            selectedProject={selectedProject}
            onUpdateTaskColumn={handleUpdateTaskColumn}
            onAddTask={handleAddTask}
            onSelectProjectDirectly={setSelectedProject}
          />
        );
      case 'review':
        return (
          <ReviewView 
            pages={pages}
            project={selectedProject}
            reviewers={reviewers}
            onUpdatePageStatus={handleUpdatePageStatus}
            onAddFeedback={handleAddFeedback}
            onUploadPage={handleUploadPage}
            onAddReviewer={handleAddReviewer}
            onDeletePage={handleDeletePage}
          />
        );
      case 'library':
        return (
          <LibraryView 
            projects={projects}
            onSelectProject={handleSelectProject}
            onAddProject={handleAddProject}
          />
        );
      default:
        return <DashboardView session={session} projects={projects} tasks={tasks} pages={pages} onSelectProject={handleSelectProject} onNavigateTab={setActiveTab} onUpdateTaskColumn={handleUpdateTaskColumn} />;
    }
  };

  // If reader tab redirect, open full screen reader mode
  if (session.isLoggedIn && activeTab === 'reader') {
    return (
      <ReaderView 
        project={selectedProject}
        onExitReader={() => setActiveTab('library')}
      />
    );
  }

  // Not logged in gate
  if (!session.isLoggedIn) {
    return (
      <AuthScreen 
        onLoginSuccess={handleLoginSuccess}
        defaultEmail={session.email}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex font-sans">
      
      {/* Permanent Navigation Rail */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        session={session}
        onLogout={handleLogout}
      />

      {/* Main viewport panels */}
      <main className="flex-1 min-h-screen pl-64 p-8 transition-all relative">
        <div className="max-w-[1300px] mx-auto pb-12">
          {renderTabContent()}
        </div>
      </main>

    </div>
  );
}
