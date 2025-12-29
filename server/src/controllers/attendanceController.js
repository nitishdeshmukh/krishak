import asyncHandler from '../utils/asyncHandler.js';
import Attendance from '../models/Attendance.js';
import Staff from '../models/Staff.js';
import mongoose from 'mongoose';

/**
 * @desc    Bulk create or update attendance
 * @route   POST /api/attendance/bulk
 * @access  Private
 */
export const bulkCreateAttendance = asyncHandler(async (req, res) => {
    const { date, records } = req.body;

    if (!date || !records || !Array.isArray(records)) {
        res.status(400);
        throw new Error('Date and records array are required');
    }

    const attendanceDate = new Date(date);
    const operations = records.map(record => ({
        updateOne: {
            filter: { date: attendanceDate, staff: record.staff },
            update: { $set: { status: record.status } },
            upsert: true
        }
    }));

    if (operations.length > 0) {
        await Attendance.bulkWrite(operations);
    }

    res.status(200).json({
        success: true,
        message: 'Attendance saved successfully',
    });
});

/**
 * @desc    Get attendance by date
 * @route   GET /api/attendance/by-date
 * @access  Private
 */
export const getAttendanceByDate = asyncHandler(async (req, res) => {
    const { date } = req.query;

    if (!date) {
        res.status(400);
        throw new Error('Date is required');
    }

    const queryDate = new Date(date);
    // Adjust logic if needed for timezone, but assuming input date is simple YYYY-MM-DD or ISO

    // Find all attendance for this date
    const attendance = await Attendance.find({ date: queryDate }).populate('staff', 'name post');

    res.status(200).json({
        success: true,
        data: attendance,
    });
});

/**
 * @desc    Get attendance report with filters
 * @route   GET /api/attendance
 * @access  Private
 */
export const getAttendanceReport = asyncHandler(async (req, res) => {
    const { page = 1, pageSize = 10, fromDate, toDate, staffId } = req.query;

    const query = { isActive: true };

    if (fromDate && toDate) {
        query.date = {
            $gte: new Date(fromDate),
            $lte: new Date(toDate)
        };
    } else if (fromDate) {
        query.date = { $gte: new Date(fromDate) };
    }

    if (staffId) {
        query.staff = staffId;
    }

    // Support for text search on staff name (from Report filters)
    const { staffName } = req.query;
    if (staffName) {
        const staffDocs = await Staff.find({ name: { $regex: staffName, $options: 'i' } });
        const staffIds = staffDocs.map(s => s._id);
        if (query.staff) {
            query.staff = { $in: staffIds.filter(id => id.toString() === query.staff.toString()) };
        } else {
            query.staff = { $in: staffIds };
        }
    }

    if (req.query.status) {
        query.status = req.query.status;
    }

    const totalRecords = await Attendance.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / pageSize);

    const attendanceStats = await Attendance.find(query)
        .sort({ date: -1 })
        .skip((page - 1) * pageSize)
        .limit(Number(pageSize))
        .populate('staff', 'name post');

    res.status(200).json({
        success: true,
        data: attendanceStats,
        pagination: {
            totalRecords,
            totalPages,
            currentPage: Number(page),
            pageSize: Number(pageSize),
        },
    });
});

/**
 * @desc    Delete attendance record
 * @route   DELETE /api/attendance/:id
 * @access  Private
 */
export const deleteAttendance = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const attendance = await Attendance.findById(id);

    if (!attendance) {
        res.status(404);
        throw new Error('Attendance record not found');
    }

    await attendance.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Attendance record deleted successfully'
    });
});
