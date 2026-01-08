import asyncHandler from '../utils/asyncHandler.js';
import Staff from '../models/Staff.js';

/**
 * @desc    Add new staff
 * @route   POST /api/staff
 * @access  Private
 */
export const createStaff = asyncHandler(async (req, res) => {
    const { name, post, phone, email, address, salary } = req.body;

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
        salary,
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
 * @desc    Update staff
 * @route   PUT /api/staff/:id
 * @access  Private
 */
export const updateStaff = asyncHandler(async (req, res) => {
    const { name, post, phone, email, address, salary } = req.body;

    const staff = await Staff.findById(req.params.id);

    if (!staff) {
        res.status(404);
        throw new Error('Staff not found');
    }

    // Check if salary has changed (create new entry for salary history tracking)
    const hasSalaryChanged = salary !== undefined && salary !== staff.salary;

    if (hasSalaryChanged) {
        // Create new staff entry with updated values for salary history
        const newStaff = await Staff.create({
            name: name || staff.name,
            post: post || staff.post,
            phone: phone || staff.phone,
            email: email || staff.email,
            address: address || staff.address,
            salary: salary,
            previousStaffId: staff._id,
        });

        res.status(201).json({
            success: true,
            data: newStaff,
            message: 'Staff updated - new entry created for salary history tracking',
        });
    } else {
        // Normal update - no salary change
        staff.name = name || staff.name;
        staff.post = post || staff.post;
        staff.phone = phone || staff.phone;
        staff.email = email || staff.email;
        staff.address = address || staff.address;

        const updatedStaff = await staff.save();

        res.status(200).json({
            success: true,
            data: updatedStaff,
            message: 'Staff updated successfully',
        });
    }
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
