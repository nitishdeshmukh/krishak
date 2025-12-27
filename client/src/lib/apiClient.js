import axios from 'axios';
import store from '@/store';
import { logout } from '@/store/slices/authSlice';

// Create axios instance with base configuration
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Include cookies in requests
});

// Request interceptor - runs before every request
apiClient.interceptors.request.use(
    (config) => {
        // Add auth token if available from Redux store
        const state = store.getState();
        const token = state.auth.token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (import.meta.env.DEV) {
            console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
        }

        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - runs after every response
apiClient.interceptors.response.use(
    (response) => {
        // Log response in development
        if (import.meta.env.DEV) {
            console.log('✅ API Response:', response.config.url, response.status);
        }

        // Return just the data from the response
        return response.data;
    },
    async (error) => {
        // Handle different error scenarios
        if (error.response) {
            // Server responded with error status
            const status = error.response.status;
            const message = error.response.data?.message || error.message;

            console.error(`❌ API Error ${status}:`, message);

            // Handle specific status codes
            switch (status) {
                case 401:
                    const originalRequest = error.config;

                    if (originalRequest.url.includes('/auth/login') || originalRequest.url.includes('/auth/refresh')) {
                        return Promise.reject(error);
                    }

                    if (!originalRequest._retry) {
                        originalRequest._retry = true;

                        try {
                            const { refreshToken } = await import('@/api/authApi');
                            const { loginSuccess } = await import('@/store/slices/authSlice');

                            const response = await refreshToken();

                            if (response.success && response.token) {
                                const state = store.getState();
                                store.dispatch(loginSuccess({
                                    user: state.auth.user,
                                    token: response.token
                                }));

                                originalRequest.headers.Authorization = `Bearer ${response.token}`;
                                return apiClient(originalRequest);
                            }
                        } catch (refreshError) {
                            store.dispatch(logout());
                        }
                    } else {
                        store.dispatch(logout());
                    }
                    break;
                case 403:
                    console.error('Access forbidden');
                    break;
                case 404:
                    console.error('Resource not found');
                    break;
                case 500:
                    console.error('Server error');
                    break;
                default:
                    console.error('An error occurred');
            }

            throw new Error(message || `Request failed with status ${status}`);
        } else if (error.request) {
            console.error('❌ Network Error: No response received');
            throw new Error('Network error. Please check your connection.');
        } else {
            console.error('❌ Error:', error.message);
            throw new Error(error.message || 'An unexpected error occurred');
        }
    }
);

export default apiClient;
