import axios from "axios";
import { Item, ItemCreate, ItemUpdate } from "./types";

export interface Inventory {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    role: string;
}

export interface InventoryUser {
    user_id: number;
    username: string;
    role: string;
}

const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to include the token and active inventory ID
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        const activeInventoryId = localStorage.getItem("activeInventoryId");
        if (activeInventoryId) {
            config.headers["X-Inventory-Id"] = activeInventoryId;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Inventory API
export const getInventories = async (): Promise<Inventory[]> => {
    const response = await api.get("/inventories");
    return response.data;
};

export const createInventory = async (data: { name: string; description?: string }): Promise<Inventory> => {
    const response = await api.post("/inventories", data);
    return response.data;
};

export const getInventoryMembers = async (inventoryId: number): Promise<InventoryUser[]> => {
    const response = await api.get(`/inventories/${inventoryId}/users`);
    return response.data;
};

export const addInventoryMember = async (inventoryId: number, username: string, role: string = "user") => {
    const response = await api.post(`/inventories/${inventoryId}/users`, { username, role });
    return response.data;
};

export const updateMemberRole = async (inventoryId: number, userId: number, role: string) => {
    const response = await api.patch(`/inventories/${inventoryId}/users/${userId}/role`, { role });
    return response.data;
};

export const removeMember = async (inventoryId: number, userId: number) => {
    const response = await api.delete(`/inventories/${inventoryId}/users/${userId}`);
    return response.data;
};

export const getItems = async (): Promise<Item[]> => {
    const response = await api.get("/items");
    return response.data;
};

export const getItem = async (id: number): Promise<Item> => {
    const response = await api.get(`/items/${id}`);
    return response.data;
};

export const createItem = async (data: ItemCreate): Promise<Item> => {
    const response = await api.post("/items", data);
    return response.data;
};

export const updateItem = async (id: number, data: ItemUpdate): Promise<Item> => {
    const response = await api.put(`/items/${id}`, data);
    return response.data;
};

export const deleteItem = async (id: number): Promise<void> => {
    await api.delete(`/items/${id}`);
};

export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const getDashboardStats = async () => {
    const response = await api.get("/dashboard/stats");
    return response.data;
};

export interface ProjectItem {
    id: number;
    project_id: number;
    item_id: number;
    quantity: number;
    item?: Item;
}

export interface Project {
    id: number;
    title: string;
    description?: string;
    status: "PLANNING" | "ACTIVE" | "COMPLETED";
    owner_id: number;
    created_at: string;
    updated_at: string;
    items: ProjectItem[];
}

export interface ProjectCreate {
    title: string;
    description?: string;
}

export interface ProjectItemCreate {
    item_id: number;
    quantity: number;
}

export const getProjects = async (): Promise<Project[]> => {
    const response = await api.get("/projects");
    return response.data;
};

export const getProject = async (id: number): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
};

export const createProject = async (data: ProjectCreate): Promise<Project> => {
    const response = await api.post("/projects", data);
    return response.data;
};

export const addProjectItem = async (projectId: number, data: ProjectItemCreate): Promise<Project> => {
    const response = await api.post(`/projects/${projectId}/items`, data);
    return response.data;
};

export const updateProjectStatus = async (projectId: number, status: string, returnItems: boolean = false): Promise<Project> => {
    const response = await api.put(`/projects/${projectId}`, { status, return_items: returnItems });
    return response.data;
};

export default api;
