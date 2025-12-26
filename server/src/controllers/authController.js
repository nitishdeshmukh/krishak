import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

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

        // Generate tokens
        const accessToken = generateToken(mockUser.id, '15m');
        const refreshToken = generateToken(mockUser.id, '7d');

        // Send refresh token in HTTP-only cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
            sameSite: 'strict', // Prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: mockUser,
                token: accessToken,
            },
        });
    }

    return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
    });
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public (with cookie)
 */
export const refreshToken = asyncHandler(async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.status(401).json({ message: 'Unauthorized, no refresh token' });
    }

    const refreshToken = cookies.jwt;

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        // Found valid user (In a real app, verify user exists in DB)
        // For mock user, we just check ID
        if (decoded.id !== '1') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const accessToken = generateToken(decoded.id, '15m');

        return res.json({
            success: true,
            token: accessToken,
        });

    } catch (err) {
        return res.status(403).json({ message: 'Forbidden, invalid token' });
    }
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // No content

    res.clearCookie('jwt', {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV !== 'development',
    });

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
