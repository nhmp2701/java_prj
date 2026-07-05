/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import AuthScreen from "./components/AuthScreen";
import DashboardView from "./components/DashboardView";
import AssetsView from "./components/AssetsView";
import CompositionView from "./components/CompositionView";
import ReviewView from "./components/ReviewView";
import LibraryView from "./components/LibraryView";
import ChaptersView from "./components/ChaptersView";
import ReaderView from "./components/ReaderView";
import Sidebar from "./components/Sidebar";
import { Project, Task, MangaPage, Feedback, Reviewer, UserSession, Chapter, AppUser } from "./types";
import {
  createProject,
  updateProject,
  deleteProject,
  getAllUsers,
  createTask,
  updateTask,
  deleteTask,
  getProjects,
  getTasks,
  updateTaskStatus,
  getAssets,
  deleteAsset,
  getChaptersByManga,
  createChapter,
  updateChapterStatus,
  publishChapter,
  deleteChapter,
  getProfile,
  getReaderCount,
} from "./services/api";

const mapWorkflowTask = (task: any): Task => ({
  id: String(task.id),
  projectId: String(task.chapterId || 1),
  chapterId: String(task.chapterId || 1),
  title: task.title,
  description: task.description || "",
  column: task.status,
  tag: task.chapterId ? `Chương ${task.chapterId}` : "Chung",
  priority: "Medium" as Task["priority"],
  dueDate: task.updatedAt
    ? task.updatedAt.split("T")[0]
    : new Date().toISOString().split("T")[0],
  assignees: task.assignedTo ? [{ name: task.assignedTo, avatarUrl: "" }] : [],
});

const mapAssetToPage = (asset: any, index: number): MangaPage => ({
  id: String(asset.id),
  projectId: String(asset.chapterId || 1),
  fileName: asset.fileName || `asset_${asset.id}`,
  pageNumber: index + 1,
  status:
    asset.status === "APPROVED"
      ? "Approved"
      : asset.status === "REJECTED"
      ? "Revision"
      : "Pending",
  uploadedAt: asset.createdAt ? asset.createdAt.split("T")[0] : "Vừa xong",
  uploader: asset.uploadedByUsername || "Họa sĩ",
  imageUrl:
    asset.fileUrl ||
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
  feedbacks: [],
});

export default function App() {
  const [session, setSession] = useState<UserSession>({
    email: "",
    isLoggedIn: false,
  });

  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [pages, setPages] = useState<MangaPage[]>([]);
  const [reviewers, setReviewers] = useState<Reviewer[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [readerCount, setReaderCount] = useState<number>(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  // ─── Role & Permission Logic ───────────────────────────────────────────────
  const role = (session.role || "READER").toUpperCase().replace(/^ROLE_/, "");

  const isStaffRole = ["ADMIN", "TEAM_LEAD", "CREATOR", "EDITOR"].includes(role);

  // All logged-in users can see Library and Chapters (read-only).
  // Staff gets full workspace access.
  const allowedTabs = isStaffRole
    ? ["dashboard", "library", "chapters", "assets", "composition", "review", "reader"]
    : ["library", "chapters", "reader"];

  const canCreateProjects  = ["ADMIN", "TEAM_LEAD"].includes(role);
  const canDeleteProjects  = role === "ADMIN";
  const canManageTasks     = ["ADMIN", "TEAM_LEAD", "CREATOR", "EDITOR"].includes(role);
  const canUploadAssets    = ["ADMIN", "TEAM_LEAD", "CREATOR"].includes(role);
  const canCreateChapters  = ["ADMIN", "TEAM_LEAD", "CREATOR"].includes(role);
  const canRequestChapterApproval = role === "EDITOR";
  const canApproveChapters = ["ADMIN", "TEAM_LEAD"].includes(role);
  const canQuickApproveChapters = role === "ADMIN";
  const canUpdateChapterStatus = canRequestChapterApproval || canApproveChapters;
  const canDeleteChapters  = role === "ADMIN";
  const canReviewAssets    = ["ADMIN", "TEAM_LEAD", "EDITOR"].includes(role);
  const canPublish         = ["ADMIN", "TEAM_LEAD"].includes(role);

  useEffect(() => {
    if (!allowedTabs.includes(activeTab)) {
      setActiveTab(allowedTabs[0] || "library");
    }
  }, [activeTab, role]);

  const refreshTasks = async (authToken: string) => {
    if (!isStaffRole) {
      setTasks([]);
      return;
    }

    try {
      const tasksRes = await getTasks(authToken);
      if (tasksRes?.success && Array.isArray(tasksRes.data)) {
        setTasks(tasksRes.data.map(mapWorkflowTask));
      }
    } catch (err) {
      console.error("Failed to refresh tasks", err);
    }
  };

  const refreshAssets = async (authToken: string) => {
    try {
      const assetsRes = await getAssets(authToken);
      if (assetsRes?.success && Array.isArray(assetsRes.data)) {
        setAssets(assetsRes.data);
        setPages(assetsRes.data.map(mapAssetToPage));
      }
    } catch (err) {
      console.error("Failed to refresh assets", err);
    }
  };

  const refreshUsers = async (authToken: string, effectiveRole = role) => {
    if (effectiveRole !== "ADMIN") {
      setUsers([]);
      return;
    }

    try {
      const usersRes = await getAllUsers(authToken);
      if (usersRes?.success && Array.isArray(usersRes.data)) {
        setUsers(
          usersRes.data.map((user: any) => ({
            id: String(user.id),
            username: user.username || "",
            email: user.email || "",
            role: user.role,
          })),
        );
      }
    } catch (err) {
      console.error("Failed to refresh users", err);
    }
  };

  // ─── Refresh chapters from backend (syncs across users) ───────────────────────
  const refreshChapters = async (authToken: string, projectList?: Project[]) => {
    const list = projectList || projects;
    if (!list.length) return;
    try {
      const allChaptersResults = await Promise.all(
        list.map((p: Project) => getChaptersByManga(p.id, authToken).catch(() => ({ data: [] })))
      );
      let allChapters: Chapter[] = [];
      allChaptersResults.forEach((chRes, index) => {
        const p = list[index];
        const chList = Array.isArray(chRes) ? chRes : chRes?.data || [];
        if (Array.isArray(chList)) {
          const mappedCh = chList
            .filter((ch: any) => isStaffRole || ch.status === "PUBLISHED")
            .map((ch: any) => ({
              id: String(ch.id),
              title: ch.title,
              chapterNumber: ch.chapterNumber,
              content: ch.content || "",
              status: ch.status,
              mangaId: String(p.id),
              scheduledPublishAt: ch.scheduledPublishAt || "",
            }));
          allChapters = [...allChapters, ...mappedCh];
        }
      });
      setChapters(allChapters);
    } catch (err) {
      console.error("Failed to refresh chapters", err);
    }
  };

  const refreshProjects = async (authToken: string) => {
    try {
      const projectsRes = await getProjects(authToken);
      if (!projectsRes?.success || !Array.isArray(projectsRes.data)) return;

      const mapped: Project[] = projectsRes.data.map((proj: any) => ({
        id: String(proj.id),
        name: proj.title,
        description: proj.description || "",
        status: proj.status,
        updatedAt: proj.startDate || new Date().toISOString().split("T")[0],
        imageUrl:
          proj.coverUrl ||
          "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80",
        category:
          proj.status === "PUBLISHED"
            ? "Published"
            : proj.status === "COMPLETED"
            ? "Published"
            : "Drafts",
      }));
      const visibleProjects = mapped;

      setProjects(visibleProjects);
      setSelectedProject((current) => {
        if (current && visibleProjects.some((project) => project.id === current.id)) {
          return current;
        }
        return visibleProjects[0] || null;
      });
      await refreshChapters(authToken, visibleProjects);
    } catch (err) {
      console.error("Failed to refresh projects", err);
    }
  };

  // Poll chapters every 30 seconds to stay in sync with other users
  useEffect(() => {
    const token = localStorage.getItem("token") || session.token;
    if (!token || !session.isLoggedIn || projects.length === 0) return;
    const interval = setInterval(() => refreshChapters(token), 30000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.isLoggedIn, session.token, projects.length]);

  // Poll projects on project/chapter surfaces so other users see new projects
  // without having to create another project first.
  useEffect(() => {
    const token = localStorage.getItem("token") || session.token;
    const shouldSyncProjects =
      token &&
      session.isLoggedIn &&
      ["dashboard", "library", "chapters", "reader"].includes(activeTab);

    if (!shouldSyncProjects) return;

    refreshProjects(token);
    const interval = setInterval(() => refreshProjects(token), 5000);
    const handleFocus = () => refreshProjects(token);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.isLoggedIn, session.token, role, activeTab]);

  useEffect(() => {
    const token = localStorage.getItem("token") || session.token;
    if (!token || !session.isLoggedIn || role !== "ADMIN" || activeTab !== "dashboard") return;

    refreshUsers(token, role);
    const interval = setInterval(() => refreshUsers(token, role), 10000);
    const handleFocus = () => refreshUsers(token, role);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.isLoggedIn, session.token, role, activeTab]);

  useEffect(() => {
    const token = localStorage.getItem("token") || session.token;
    const shouldSyncAssets =
      token &&
      session.isLoggedIn &&
      ["assets", "review", "reader", "chapters"].includes(activeTab);

    if (!shouldSyncAssets) return;

    refreshAssets(token);
    const interval = setInterval(() => refreshAssets(token), 5000);
    const handleFocus = () => refreshAssets(token);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.isLoggedIn, session.token, activeTab]);

  // Poll tasks while staff users are on workflow-heavy screens.
  // This keeps Kanban synced when another user creates or edits tasks.
  useEffect(() => {
    const token = localStorage.getItem("token") || session.token;
    const shouldSyncTasks =
      token &&
      session.isLoggedIn &&
      isStaffRole &&
      ["dashboard", "composition"].includes(activeTab);

    if (!shouldSyncTasks) return;

    refreshTasks(token);
    const interval = setInterval(() => refreshTasks(token), 5000);
    const handleFocus = () => refreshTasks(token);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.isLoggedIn, session.token, role, activeTab]);

  // ─── Data Fetching ─────────────────────────────────────────────────────────
  const fetchData = async (authToken: string, effectiveRole = role) => {
    const effectiveIsStaffRole = ["ADMIN", "TEAM_LEAD", "CREATOR", "EDITOR"].includes(effectiveRole);
    try {
      const [projectsRes, tasksRes, assetsRes, readerCountRes] = await Promise.all([
        getProjects(authToken),
        effectiveIsStaffRole ? getTasks(authToken).catch(() => ({ success: true, data: [] })) : Promise.resolve({ success: true, data: [] }),
        getAssets(authToken).catch(() => ({ success: true, data: [] })),
        getReaderCount(authToken).catch(() => ({ success: true, data: 0 })),
      ]);

      if (projectsRes?.success && Array.isArray(projectsRes.data)) {
        const mapped: Project[] = projectsRes.data.map((proj: any) => ({
          id: String(proj.id),
          name: proj.title,
          description: proj.description || "",
          status: proj.status,
          updatedAt: proj.startDate || new Date().toISOString().split("T")[0],
          imageUrl:
            proj.coverUrl ||
            "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&q=80",
          category:
            proj.status === "PUBLISHED"
              ? "Published"
              : proj.status === "COMPLETED"
              ? "Published"
              : "Drafts",
        }));
        const visibleProjects = mapped;

        setProjects(visibleProjects);
        if ((!selectedProject || !visibleProjects.some((p) => p.id === selectedProject.id)) && visibleProjects.length > 0) {
          setSelectedProject(visibleProjects[0]);
        }

        // Load chapters for all projects
        try {
          const allChaptersResults = await Promise.all(
            visibleProjects.map((p: Project) => getChaptersByManga(p.id, authToken).catch(() => ({ data: [] })))
          );
          let allChapters: Chapter[] = [];
          allChaptersResults.forEach((chRes, index) => {
            const p = visibleProjects[index];
            const chList = Array.isArray(chRes) ? chRes : chRes?.data || [];
            if (Array.isArray(chList)) {
              const mappedCh = chList
                .filter((ch: any) => effectiveIsStaffRole || ch.status === "PUBLISHED")
                .map((ch: any) => ({
                  id: String(ch.id),
                  title: ch.title,
                  chapterNumber: ch.chapterNumber,
                  content: ch.content || "",
                  status: ch.status,
                  mangaId: String(p.id),
                  scheduledPublishAt: ch.scheduledPublishAt || "",
                }));
              allChapters = [...allChapters, ...mappedCh];
            }
          });
          setChapters(allChapters);
        } catch (chErr) {
          console.error("Failed to load chapters", chErr);
        }
      }

      if (tasksRes?.success && Array.isArray(tasksRes.data)) {
        const mapped: Task[] = tasksRes.data.map((task: any) => ({
          id: String(task.id),
          projectId: String(task.chapterId || 1),
          chapterId: String(task.chapterId || 1),
          title: task.title,
          description: task.description || "",
          column: task.status,
          tag: task.chapterId ? `Chương ${task.chapterId}` : "Chung",
          priority: "Medium" as Task["priority"],
          dueDate: task.updatedAt
            ? task.updatedAt.split("T")[0]
            : new Date().toISOString().split("T")[0],
          assignees: task.assignedTo ? [{ name: task.assignedTo, avatarUrl: "" }] : [],
        }));
        setTasks(mapped);
      }

      if (assetsRes?.success && Array.isArray(assetsRes.data)) {
        setAssets(assetsRes.data);
        const mappedPages: MangaPage[] = assetsRes.data.map((asset: any, index: number) => ({
          id: String(asset.id),
          projectId: String(asset.chapterId || 1),
          fileName: asset.fileName || `asset_${asset.id}`,
          pageNumber: index + 1,
          status:
            asset.status === "APPROVED"
              ? "Approved"
              : asset.status === "REJECTED"
              ? "Revision"
              : "Pending",
          uploadedAt: asset.createdAt ? asset.createdAt.split("T")[0] : "Vừa xong",
          uploader: asset.uploadedByUsername || "Họa sĩ",
          imageUrl:
            asset.fileUrl ||
            "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
          feedbacks: [],
        }));
        setPages(mappedPages);
      }

      if (readerCountRes?.success) {
        setReaderCount(Number(readerCountRes.data));
      }

      await refreshUsers(authToken, effectiveRole);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  // ─── Auto-login from stored token ─────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getProfile(token)
        .then((profileRes) => {
          if (profileRes.success && profileRes.data) {
            const profile = profileRes.data;
            const nameParts = profile.username ? profile.username.split(" ") : ["User", ""];
            setSession({
              email: profile.email,
              firstName: nameParts[0],
              lastName: nameParts.slice(1).join(" "),
              isLoggedIn: true,
              role: profile.role,
              username: profile.username,
              token: token,
            });
            fetchData(token, profile.role);
          } else {
            throw new Error("Invalid profile");
          }
        })
        .catch((err) => {
          console.error("Auto login failed", err);
          localStorage.removeItem("token");
          setSession((prev) => ({ ...prev, isLoggedIn: false }));
        });
    }
  }, []);

  // ─── Auth handlers ─────────────────────────────────────────────────────────
  const handleLoginSuccess = (userSession: UserSession) => {
    setSession(userSession);
    const nextRole = (userSession.role || "READER").toUpperCase();
    const nextIsStaffRole = ["ADMIN", "TEAM_LEAD", "CREATOR", "EDITOR"].includes(nextRole);
    setActiveTab(nextIsStaffRole ? "dashboard" : "library");
    if (userSession.token) {
      fetchData(userSession.token, nextRole);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setSession({ email: "", isLoggedIn: false });
    setProjects([]);
    setTasks([]);
    setPages([]);
    setChapters([]);
    setAssets([]);
    setUsers([]);
    setSelectedProject(null);
    setSelectedChapter(null);
  };

  // ─── Project handlers ───────────────────────────────────────────────────────
  const handleSelectProject = (project: Project, tabRedirect: string) => {
    setSelectedProject(project);
    if (tabRedirect === "reader") {
      const firstReadableChapter = chapters.find(
        (chapter) => chapter.mangaId === project.id && chapter.status === "PUBLISHED",
      );
      setSelectedChapter(firstReadableChapter || null);
    }
    setActiveTab(tabRedirect);
  };

  const handleAddProject = async (newProject: Project) => {
    const token = localStorage.getItem("token") || session.token;
    if (!token) throw new Error("Chưa đăng nhập");
    const profileRes = await getProfile(token);
    const currentRole = String(profileRes?.data?.role || "").toUpperCase();
    if (!["ADMIN", "TEAM_LEAD"].includes(currentRole)) {
      throw new Error("Chỉ ADMIN hoặc TEAM_LEAD mới được tạo Project Manga. Vui lòng đăng xuất và đăng nhập lại đúng tài khoản.");
    }

    const apiRes = await createProject(
      {
        title: newProject.name,
        description: newProject.description || "Mô tả dự án",
        status: newProject.status,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        coverUrl: newProject.imageUrl,
        authorName: session.username || session.firstName,
      },
      token
    );
    if (apiRes?.success && apiRes.data) {
      await fetchData(token, currentRole);
    } else {
      throw new Error(apiRes?.message || "Tạo dự án thất bại");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    const token = localStorage.getItem("token") || session.token;
    if (!token) return;
    try {
      const apiRes = await deleteProject(projectId, token);
      if (apiRes?.success) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
        if (selectedProject?.id === projectId) setSelectedProject(null);
      }
    } catch (err) {
      console.error("Failed to delete project", err);
    }
  };

  const handleUpdateProjectStatus = async (projectId: string, status: string) => {
    const token = localStorage.getItem("token") || session.token;
    if (!token) return;
    try {
      const proj = projects.find((p) => p.id === projectId);
      if (!proj) return;
      const payload: Record<string, any> = {
        title: proj.name,
        description: proj.description,
        status: status,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        coverUrl: proj.imageUrl,
        authorName: session.username || session.firstName,
      };
      const apiRes = await updateProject(projectId, payload, token);
      if (apiRes?.success) {
        const updatedProject = apiRes.data
          ? {
              id: String(apiRes.data.id),
              name: apiRes.data.title,
              description: apiRes.data.description || "",
              status: apiRes.data.status,
              updatedAt: apiRes.data.startDate || new Date().toISOString().split("T")[0],
              imageUrl: apiRes.data.coverUrl || proj.imageUrl,
              category: apiRes.data.status === "PUBLISHED" || apiRes.data.status === "COMPLETED" ? "Published" : "Drafts",
            } as Project
          : ({ ...proj, status: status as Project["status"] });
        setProjects((prev) => prev.map((p) => (p.id === projectId ? updatedProject : p)));
        setSelectedProject((current) => (current?.id === projectId ? updatedProject : current));
        await refreshProjects(token);
      }
    } catch (err) {
      console.error("Failed to update project status", err);
    }
  };

  // ─── Chapter handlers ──────────────────────────────────────────────────────
  const handleSelectChapter = (chapter: Chapter, tabRedirect: string) => {
    setSelectedChapter(chapter);
    const chapterProject = projects.find((project) => project.id === chapter.mangaId);
    if (chapterProject) {
      setSelectedProject(chapterProject);
    }
    // Only navigate to the target tab if the user has access to it
    if (allowedTabs.includes(tabRedirect)) {
      setActiveTab(tabRedirect);
    } else {
      // Fall back to chapters tab so the page doesn’t go blank
      setActiveTab("chapters");
    }
  };

  const handleAddChapter = async (newCh: Chapter) => {
    const token = localStorage.getItem("token") || session.token;
    if (!token) throw new Error("Chua dang nhap");
    const mangaId = selectedProject?.id || projects[0]?.id;
    if (!mangaId) throw new Error("Vui long tao hoac chon project truoc khi them chapter");
    try {
      const createdChapter = await createChapter(
        {
          title: newCh.title,
          chapterNumber: newCh.chapterNumber,
          content: newCh.content,
          mangaId: Number(mangaId),
          scheduledPublishAt: newCh.scheduledPublishAt || null,
        },
        token
      );
      if (createdChapter?.id) {
        setChapters((prev) => [
          ...prev,
          {
            id: String(createdChapter.id),
            title: createdChapter.title,
            chapterNumber: createdChapter.chapterNumber,
            content: createdChapter.content || "",
            status: createdChapter.status,
            mangaId: String(mangaId),
            scheduledPublishAt: createdChapter.scheduledPublishAt || "",
          },
        ]);
      }
      // Refresh from backend so all users see the new chapter
      await refreshChapters(token, projects);
    } catch (err) {
      console.error("Failed to add chapter", err);
      throw err;
    }
  };

  const handleUpdateChapterStatus = async (chapterId: string, status: Chapter["status"]) => {
    const token = localStorage.getItem("token") || session.token;
    try {
      if (token) {
        await updateChapterStatus(chapterId, status, token);
        // Refresh from backend to sync status across users
        await refreshChapters(token);
      }
    } catch (err) {
      console.error("Failed to update chapter status", err);
      const message =
        (err as any)?.response?.data?.message ||
        (err as any)?.response?.data?.error ||
        (err as any)?.message ||
        "Khong the cap nhat trang thai chapter. Vui long kiem tra quyen va trang thai hien tai.";
      alert(message);
    }
  };

  const handlePublishChapter = async (chapterId: string) => {
    const token = localStorage.getItem("token") || session.token;
    try {
      if (!token) throw new Error("Chua dang nhap");
      await Promise.all([
        refreshTasks(token),
        refreshAssets(token),
      ]);
      await publishChapter(chapterId, token);
      await Promise.all([
        refreshChapters(token),
        refreshTasks(token),
        refreshAssets(token),
      ]);
    } catch (err) {
      console.error("Failed to publish chapter", err);
      const message =
        (err as any)?.response?.data?.message ||
        (err as any)?.response?.data?.error ||
        (err as any)?.message ||
        "Khong the xuat ban chapter. Chapter can o PENDING/SCHEDULED, task phai DONE va asset phai APPROVED.";
      alert(message);
    }
  };

  const handleDeleteChapter = async (chapterId: string) => {
    const token = localStorage.getItem("token") || session.token;
    try {
      if (token) await deleteChapter(chapterId, token);
    } catch (err) {
      console.error("Failed to delete chapter", err);
    }
    setChapters((prev) => prev.filter((ch) => ch.id !== chapterId));
  };

  // ─── Task handlers ─────────────────────────────────────────────────────────
  const handleAddTask = async (newTask: Task) => {
    const token = localStorage.getItem("token") || session.token;
    if (!token) return;
    try {
      const apiRes = await createTask(
        {
          title: newTask.title,
          description: newTask.description,
          assignedTo: newTask.assignees.length > 0 ? newTask.assignees[0].name : "",
          status: newTask.column,
          chapterId: Number(newTask.projectId) || null,
        },
        token
      );
      if (apiRes?.success && apiRes.data) {
        const tasksRes = await getTasks(token);
        if (tasksRes?.success && Array.isArray(tasksRes.data)) {
          setTasks(
            tasksRes.data.map((task: any) => ({
              id: String(task.id),
              projectId: String(task.chapterId || 1),
              chapterId: String(task.chapterId || 1),
              title: task.title,
              description: task.description || "",
              column: task.status,
              tag: task.chapterId ? `Chương ${task.chapterId}` : "Chung",
              priority: "Medium" as Task["priority"],
              dueDate: task.updatedAt ? task.updatedAt.split("T")[0] : new Date().toISOString().split("T")[0],
              assignees: task.assignedTo ? [{ name: task.assignedTo, avatarUrl: "" }] : [],
            }))
          );
        }
        await refreshTasks(token);
      }
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  const handleUpdateTaskColumn = async (
    taskId: string,
    direction: "prev" | "next" | "direct",
    newCol?: Task["column"]
  ) => {
    const columns: Task["column"][] = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];
    const currentTask = tasks.find((t) => t.id === taskId);
    if (!currentTask) return;

    let targetCol = currentTask.column;
    if (direction === "next") {
      const idx = columns.indexOf(currentTask.column);
      if (idx < columns.length - 1) targetCol = columns[idx + 1];
    } else if (direction === "prev") {
      const idx = columns.indexOf(currentTask.column);
      if (idx > 0) targetCol = columns[idx - 1];
    } else if (direction === "direct" && newCol) {
      targetCol = newCol;
    }

    const token = localStorage.getItem("token") || session.token;
    if (!token) return;
    try {
      const apiRes = await updateTaskStatus(taskId, targetCol, token);
      if (apiRes?.success) {
        setTasks((prev) => prev.map((t) => (t.id !== taskId ? t : { ...t, column: targetCol })));
        await refreshTasks(token);
      }
    } catch (err) {
      console.error("Failed to update task column", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const token = localStorage.getItem("token") || session.token;
    if (!token) return;
    try {
      const apiRes = await deleteTask(taskId, token);
      if (apiRes?.success) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId));
        await refreshTasks(token);
      }
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const handleUpdateTaskDetails = async (taskId: string, updatedFields: Partial<Task>) => {
    const token = localStorage.getItem("token") || session.token;
    if (!token) return;
    try {
      const existing = tasks.find((t) => t.id === taskId);
      if (!existing) return;
      const payload: Record<string, any> = {
        title: updatedFields.title ?? existing.title,
        description: updatedFields.description ?? existing.description,
        assignedTo:
          updatedFields.assignees && updatedFields.assignees.length > 0
            ? updatedFields.assignees[0].name
            : existing.assignees.length > 0
            ? existing.assignees[0].name
            : "",
        status: updatedFields.column ?? existing.column,
        chapterId: updatedFields.projectId != null ? Number(updatedFields.projectId) : Number(existing.projectId),
      };
      const apiRes = await updateTask(taskId, payload, token);
      if (apiRes?.success) {
        const tasksRes = await getTasks(token);
        if (tasksRes?.success && Array.isArray(tasksRes.data)) {
          setTasks(
            tasksRes.data.map((task: any) => ({
              id: String(task.id),
              projectId: String(task.chapterId || 1),
              chapterId: String(task.chapterId || 1),
              title: task.title,
              description: task.description || "",
              column: task.status,
              tag: task.chapterId ? `Chương ${task.chapterId}` : "Chung",
              priority: "Medium" as Task["priority"],
              dueDate: task.updatedAt ? task.updatedAt.split("T")[0] : new Date().toISOString().split("T")[0],
              assignees: task.assignedTo ? [{ name: task.assignedTo, avatarUrl: "" }] : [],
            }))
          );
        }
        await refreshTasks(token);
      }
    } catch (err) {
      console.error("Failed to update task details", err);
    }
  };

  // ─── Asset/Review handlers ─────────────────────────────────────────────────
  const handleUpdatePageStatus = (pageId: string, status: MangaPage["status"]) => {
    setPages((prev) => prev.map((p) => (p.id === pageId ? { ...p, status } : p)));
    const backendStatus = status === "Approved" ? "APPROVED" : status === "Revision" ? "REJECTED" : "PENDING";
    setAssets((prev) => prev.map((a) => (String(a.id) === pageId ? { ...a, status: backendStatus } : a)));
  };

  const handleAddFeedback = (pageId: string, fb: Feedback) => {
    setPages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, feedbacks: [...p.feedbacks, fb] } : p))
    );
  };

  const handleUploadPage = (newPage: MangaPage) => {
    setPages([newPage, ...pages]);
  };

  const handleAddReviewer = (newRev: Reviewer) => {
    setReviewers([...reviewers, newRev]);
  };

  const handleDeleteAsset = async (assetId: string) => {
    const token = localStorage.getItem("token") || session.token;
    if (!token) return;
    try {
      const apiRes = await deleteAsset(assetId, token);
      if (apiRes?.success) {
        setAssets((prev) => prev.filter((a) => String(a.id) !== assetId));
        setPages((prev) => prev.filter((p) => p.id !== assetId));
      }
    } catch (err) {
      console.error("Failed to delete asset", err);
    }
  };

  const handleReloadAssets = async () => {
    const token = localStorage.getItem("token") || session.token;
    if (!token) return;
    try {
      const assetsRes = await getAssets(token);
      if (assetsRes?.success && Array.isArray(assetsRes.data)) {
        setAssets(assetsRes.data);
        const mappedPages: MangaPage[] = assetsRes.data.map((asset: any, index: number) => ({
          id: String(asset.id),
          projectId: String(asset.chapterId || 1),
          fileName: asset.fileName || `asset_${asset.id}`,
          pageNumber: index + 1,
          status:
            asset.status === "APPROVED" ? "Approved" : asset.status === "REJECTED" ? "Revision" : "Pending",
          uploadedAt: asset.createdAt ? asset.createdAt.split("T")[0] : "Vừa xong",
          uploader: asset.uploadedByUsername || "Họa sĩ",
          imageUrl:
            asset.fileUrl ||
            "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
          feedbacks: [],
        }));
        setPages(mappedPages);
      }
    } catch (err) {
      console.error("Failed to reload assets", err);
    }
  };

  // ─── Tab Content Renderer ─────────────────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardView
            session={session}
            projects={projects}
            tasks={tasks}
            pages={pages}
            users={users}
            onSelectProject={handleSelectProject}
            onNavigateTab={setActiveTab}
            onUpdateTaskColumn={handleUpdateTaskColumn}
          />
        );
      case "library":
        return (
          <LibraryView
            projects={projects}
            onSelectProject={handleSelectProject}
            onAddProject={handleAddProject}
            canAddProject={canCreateProjects}
            chapters={chapters}
            assets={assets}
            readerCount={readerCount}
            onDeleteProject={canDeleteProjects ? handleDeleteProject : undefined}
            onUpdateProjectStatus={canCreateProjects ? handleUpdateProjectStatus : undefined}
          />
        );
      case "chapters":
        return (
          <ChaptersView
            chapters={chapters}
            projects={projects}
            tasks={tasks}
            assets={assets}
            selectedProject={selectedProject}
            onSelectProjectDirectly={setSelectedProject}
            onSelectChapter={handleSelectChapter}
            onAddChapter={handleAddChapter}
            onUpdateChapterStatus={handleUpdateChapterStatus}
            onPublishChapter={handlePublishChapter}
            onDeleteChapter={handleDeleteChapter}
            canManageChapters={canCreateChapters}
            canUpdateChapterStatus={canUpdateChapterStatus}
            canRequestChapterApproval={canRequestChapterApproval}
            canApproveChapters={canApproveChapters}
            canQuickApproveChapters={canQuickApproveChapters}
            canDeleteChapters={canDeleteChapters}
            canPublish={canPublish}
            canManageTasks={canManageTasks}
            canReviewAssets={canReviewAssets}
            canReadChapters
          />
        );
      case "assets":
        return (
          <AssetsView
            authToken={session.token}
            canUploadAsset={canUploadAssets}
            onDeleteAsset={handleDeleteAsset}
            assets={assets}
            onReloadAssets={handleReloadAssets}
            chapters={chapters}
            selectedProject={selectedProject}
          />
        );
      case "composition":
        return (
          <CompositionView
            tasks={tasks}
            projects={projects}
            selectedProject={selectedProject}
            selectedChapter={selectedChapter}
            onUpdateTaskColumn={handleUpdateTaskColumn}
            onAddTask={handleAddTask}
            onSelectProjectDirectly={setSelectedProject}
            canManageTasks={canManageTasks}
            onDeleteTask={handleDeleteTask}
            onUpdateTaskDetails={handleUpdateTaskDetails}
            chapters={chapters}
          />
        );
      case "review":
        return (
          <ReviewView
            pages={pages}
            project={selectedProject}
            selectedChapter={selectedChapter}
            reviewers={reviewers}
            onUpdatePageStatus={handleUpdatePageStatus}
            onAddFeedback={handleAddFeedback}
            onUploadPage={handleUploadPage}
            onAddReviewer={handleAddReviewer}
            onDeletePage={handleDeleteAsset}
            chapters={chapters}
            projects={projects}
            assets={assets}
            onReloadAssets={handleReloadAssets}
            canReviewAssets={canReviewAssets}
          />
        );
      case "reader":
        return (
          <ReaderView
            project={selectedProject}
            chapter={selectedChapter}
            chapters={chapters}
            pages={pages}
            onSelectChapter={(chapter) => handleSelectChapter(chapter, "reader")}
            onExitReader={() => setActiveTab("chapters")}
          />
        );
      default:
        return (
          <DashboardView
            session={session}
            projects={projects}
            tasks={tasks}
            pages={pages}
            users={users}
            onSelectProject={handleSelectProject}
            onNavigateTab={setActiveTab}
            onUpdateTaskColumn={handleUpdateTaskColumn}
          />
        );
    }
  };

  // ─── Gate: Not logged in ──────────────────────────────────────────────────
  if (!session.isLoggedIn) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} defaultEmail={session.email} />;
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        session={session}
        onLogout={handleLogout}
        availableTabs={allowedTabs}
      />

      <main className="flex-1 min-h-screen pl-64 p-8 transition-all relative">
        <div className="max-w-[1300px] mx-auto pb-12">{renderTabContent()}</div>
      </main>
    </div>
  );
}
