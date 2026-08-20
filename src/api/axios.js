import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}/api`,
    headers: {
        "Content-Type": "application/json"
    }
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    const isPublicEndpoint =
        config.url?.includes("/auth/login") ||
        config.url?.includes("/auth/register") ||
        config.url?.includes("/auth/verify");

    if (token && !isPublicEndpoint) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;