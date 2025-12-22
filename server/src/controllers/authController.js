import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';

/**
 * @desc    Login user with temporary credentials
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const tempEmail = process.env.AUTH_EMAIL;
    const tempPassword = process.env.AUTH_PASSWORD;

    if (email === tempEmail && password === tempPassword) {
        const mockUser = {
            id: '1',
            email: email,
            name: 'Admin User',
            role: 'admin',
            permissions: ['all'],
        };

        const token = generateToken(mockUser.id);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: mockUser,
                token,
            },
        });
    }

    return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
    });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: req.user,
    });
});
