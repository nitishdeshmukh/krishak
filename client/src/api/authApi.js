/**
 * Authentication API service
 * Connects to backend /api/auth endpoints
 */
import apiClient from '@/lib/apiClient';

/**
 * Login function - calls backend API
 */
export const login = async ({ email, password }) => {
    return await apiClient.post('/auth/login', { email, password });
};

/**
 * Logout function
 */
export const logout = async () => {
    return await apiClient.post('/auth/logout');
};

/**
 * Get current user
 */
export const getMe = async () => {
    return await apiClient.get('/auth/me');
};

/**
 * Refresh access token
 */
export const refreshToken = async () => {
    return await apiClient.post('/auth/refresh');
};

export default { login, logout, getMe, refreshToken };
