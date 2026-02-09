import axios from 'axios';
import { useAuthStore } from './auth_session_manager';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Inject Token from Zustand Store
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor: Handle 401 Unauthorized
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        console.warn('Session expired (401). Logging out...');
        // Token expired or invalid -> Clean slate logout
        useAuthStore.getState().logout();
    }
    return Promise.reject(error);
});

export default api;
