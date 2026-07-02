import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

const getAuthHeaders = (token?: string) => {
    const authToken = token || localStorage.getItem("token");
    return authToken ? { Authorization: `Bearer ${authToken}` } : {};
};

export const getProjects = async (token?: string) => {
    const response = await api.get("/projects", { headers: getAuthHeaders(token) });
    return response.data;
};

export const getTasks = async (token?: string) => {
    const response = await api.get("/api/tasks", { headers: getAuthHeaders(token) });
    return response.data;
};

export const createProject = async (payload: Record<string, unknown>, token?: string) => {
    const response = await api.post("/projects", payload, { headers: getAuthHeaders(token) });
    return response.data;
};

export const createTask = async (payload: Record<string, unknown>, token?: string) => {
    const response = await api.post("/api/tasks", payload, { headers: getAuthHeaders(token) });
    return response.data;
};

export const updateTaskStatus = async (taskId: string | number, status: string, token?: string) => {
    const response = await api.put(`/api/tasks/${taskId}/status?status=${status}`, null, { headers: getAuthHeaders(token) });
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

export default api;