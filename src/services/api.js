import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    // Don't send JWT for public authentication endpoints
    const isPublicEndpoint =
        config.url?.startsWith("/auth/");

    if (token && !isPublicEndpoint) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;