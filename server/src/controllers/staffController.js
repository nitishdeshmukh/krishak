import asyncHandler from '../utils/asyncHandler.js';
import Staff from '../models/Staff.js';

/**
 * @desc    Add new staff
 * @route   POST /api/staff
 * @access  Private
 */
export const createStaff = asyncHandler(async (req, res) => {
    const { name, post, phone, email, address } = req.body;

    if (!name) {
        res.status(400);
        throw new Error('Name is required');
    }

    const staff = await Staff.create({
        name,
        post,
        phone,
        email,
        address,
    });

    res.status(201).json({
        success: true,
        data: staff,
        message: 'Staff added successfully',
    });
});

/**
 * @desc    Get all staff
 * @route   GET /api/staff
 * @access  Private
 */
export const getStaff = asyncHandler(async (req, res) => {
    const staff = await Staff.find({}).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: staff,
        message: 'Staff retrieved successfully',
    });
});

/**
 * @desc    Delete staff
 * @route   DELETE /api/staff/:id
 * @access  Private
 */
export const deleteStaff = asyncHandler(async (req, res) => {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
        res.status(404);
        throw new Error('Staff not found');
    }

    await staff.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Staff deleted successfully',
    });
});
