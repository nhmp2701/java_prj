import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

const getAuthHeaders = (token?: string) => {
  const authToken = token || localStorage.getItem("token");
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
};

export const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  const response = await api.post("/users/login", payload);
  return response.data;
};

export const registerUser = async (payload: {
  username: string;
  email: string;
  password: string;
}) => {
  const response = await api.post("/users", payload);
  return response.data;
};

export const getProfile = async (token?: string) => {
  const response = await api.get("/users/profile", {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const getAllUsers = async (token?: string) => {
  const response = await api.get("/users/all", {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const getProjects = async (token?: string) => {
  const response = await api.get("/projects", {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const getTasks = async (token?: string) => {
  const response = await api.get("/api/tasks", {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const createProject = async (
  payload: Record<string, unknown>,
  token?: string,
) => {
  const response = await api.post("/projects", payload, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const updateProject = async (
  id: string | number,
  payload: Record<string, unknown>,
  token?: string,
) => {
  const response = await api.put(`/projects/${id}`, payload, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const deleteProject = async (id: string | number, token?: string) => {
  const response = await api.delete(`/projects/${id}`, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const createTask = async (
  payload: Record<string, unknown>,
  token?: string,
) => {
  const response = await api.post("/api/tasks", payload, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const updateTaskStatus = async (
  taskId: string | number,
  status: string,
  token?: string,
) => {
  const response = await api.put(
    `/api/tasks/${taskId}/status?status=${status}`,
    null,
    { headers: getAuthHeaders(token) },
  );
  return response.data;
};

export const getAssets = async (token?: string) => {
  const response = await api.get("/api/assets", {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const uploadAsset = async (formData: FormData, token?: string) => {
  const response = await api.post("/api/assets/upload", formData, {
    headers: {
      ...getAuthHeaders(token),
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getChaptersByManga = async (mangaId: string | number, token?: string) => {
  const response = await api.get(`/api/chapters/manga/${mangaId}`, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const createChapter = async (payload: Record<string, unknown>, token?: string) => {
  const response = await api.post("/api/chapters", payload, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const updateChapterStatus = async (id: string | number, status: string, token?: string) => {
  const response = await api.patch(`/api/chapters/${id}/status?status=${status}`, null, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const publishChapter = async (id: string | number, token?: string) => {
  const response = await api.patch(`/api/chapters/${id}/publish`, null, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const deleteChapter = async (id: string | number, token?: string) => {
  const response = await api.delete(`/api/chapters/${id}`, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const deleteAsset = async (id: string | number, token?: string) => {
  const response = await api.delete(`/api/assets/${id}`, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const approveAsset = async (id: string | number, notes: string, token?: string) => {
  const response = await api.post(`/api/assets/${id}/approve?notes=${encodeURIComponent(notes)}`, null, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const rejectAsset = async (id: string | number, comment: string, token?: string) => {
  const response = await api.post(`/api/assets/${id}/reject`, { comment }, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const getAssetReviews = async (id: string | number, token?: string) => {
  const response = await api.get(`/api/assets/${id}/reviews`, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const addAssetComment = async (id: string | number, comment: string, token?: string) => {
  const response = await api.post(`/api/assets/${id}/comments?comment=${encodeURIComponent(comment)}`, null, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const deleteTask = async (id: string | number, token?: string) => {
  const response = await api.delete(`/api/tasks/${id}`, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const updateTask = async (
  id: string | number,
  payload: Record<string, unknown>,
  token?: string,
) => {
  const response = await api.put(`/api/tasks/${id}`, payload, {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export const getReaderCount = async (token?: string) => {
  const response = await api.get("/users/count-readers", {
    headers: getAuthHeaders(token),
  });
  return response.data;
};

export default api;
