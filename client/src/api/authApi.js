/**
 * Authentication API service
 * Connects to backend /api/auth endpoints
 */
import apiClient from '@/lib/apiClient';

/**
 * Login function - calls backend API
 */
export const login = async ({ email, password }) => {
    try {
        const response = await apiClient.post('/auth/login', { email, password });
        return response;
    } catch (error) {
        // Fallback to mock auth if backend is unavailable
        const TEMP_EMAIL = import.meta.env.VITE_AUTH_EMAIL;
        const TEMP_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD;

        if (email === TEMP_EMAIL && password === TEMP_PASSWORD) {
            console.warn('⚠️ Using mock authentication (backend unavailable)');
            const mockUser = {
                id: '1',
                email: email,
                name: 'Admin User',
                role: 'admin',
                permissions: ['all']
            };
            const mockToken = 'mock_jwt_token_' + btoa(email);

            return {
                success: true,
                message: 'Login successful (mock)',
                data: { user: mockUser, token: mockToken }
            };
        }
        throw error;
    }
};

/**
 * Logout function
 */
export const logout = async () => {
    try {
        const response = await apiClient.post('/auth/logout');
        return response;
    } catch (error) {
        // Return success even if backend fails
        return { success: true, message: 'Logged out successfully' };
    }
};

/**
 * Get current user
 */
export const getMe = async () => {
    return await apiClient.get('/auth/me');
};

export default { login, logout, getMe };
