/**
 * Authentication API service
 * Note: State storage is handled by Redux (authSlice)
 */
import apiClient from '@/lib/apiClient';

// Test credentials from environment variables
const TEMP_CREDENTIALS = {
    email: import.meta.env.VITE_AUTH_EMAIL,
    password: import.meta.env.VITE_AUTH_PASSWORD
};

/**
 * Login function with temporary credentials
 * Credentials are set via VITE_AUTH_EMAIL and VITE_AUTH_PASSWORD env vars
 */
export const login = async ({ email, password }) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check temporary credentials
    console.log('email', email);
    console.log('password', password);
    console.log('TEMP_CREDENTIALS', TEMP_CREDENTIALS);
    if (email === TEMP_CREDENTIALS.email && password === TEMP_CREDENTIALS.password) {
        // Mock successful response
        const mockUser = {
            id: '1',
            email: email,
            name: 'Admin User',
            role: 'admin',
            permissions: ['all']
        };

        const mockToken = 'mock_jwt_token_' + btoa(email);

        // Return data for Redux to store (no localStorage here)
        return {
            success: true,
            message: 'Login successful',
            data: {
                user: mockUser,
                token: mockToken
            }
        };
    }

    // Invalid credentials
    throw new Error('Invalid email or password');
};

/**
 * Logout function
 * Redux authSlice handles clearing localStorage
 */
export const logout = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        success: true,
        message: 'Logged out successfully'
    };
};

export default {
    login,
    logout,
    TEMP_CREDENTIALS // Export for reference
};
