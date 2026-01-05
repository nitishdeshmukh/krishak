import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import parseExpiry from '../utils/parseExpiry.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * @desc    Login user with database credentials
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
        // Generate tokens with separate secrets
        const accessToken = generateToken(
            user._id,
            process.env.JWT_ACCESS_EXPIRE,
            process.env.JWT_ACCESS_SECRET
        );
        const refreshToken = generateToken(
            user._id,
            process.env.JWT_REFRESH_EXPIRE,
            process.env.JWT_REFRESH_SECRET
        );

        // Send refresh token in HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: process.env.NODE_ENV === 'development' ? 'strict' : 'none',
            maxAge: parseExpiry(process.env.JWT_REFRESH_EXPIRE),
        });

        // Send access token in HTTP-only cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: process.env.NODE_ENV === 'development' ? 'strict' : 'none',
            maxAge: parseExpiry(process.env.JWT_ACCESS_EXPIRE),
        });

        const userData = {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            permissions: user.permissions,
        };

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: userData,
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

    if (!cookies?.refreshToken) {
        return res.status(401).json({ message: 'Unauthorized, no refresh token' });
    }

    const refreshToken = cookies.refreshToken;

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const accessToken = generateToken(
            user._id,
            process.env.JWT_ACCESS_EXPIRE || '15m',
            process.env.JWT_ACCESS_SECRET
        );

        // Send access token in HTTP-only cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: process.env.NODE_ENV === 'development' ? 'strict' : 'none',
            maxAge: parseExpiry(process.env.JWT_ACCESS_EXPIRE || '15m'),
        });

        return res.json({
            success: true,
            message: 'Token refreshed',
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
    if (!cookies?.refreshToken) return res.sendStatus(204); // No content

    res.clearCookie('refreshToken', {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'development' ? 'strict' : 'none',
        secure: process.env.NODE_ENV !== 'development',
    });

    res.clearCookie('accessToken', {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'development' ? 'strict' : 'none',
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
    // req.user is already populated by the protect middleware
    if (!req.user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userData = {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        permissions: req.user.permissions,
    };

    res.status(200).json({
        success: true,
        message: 'User retrieved successfully',
        data: userData,
    });
});
