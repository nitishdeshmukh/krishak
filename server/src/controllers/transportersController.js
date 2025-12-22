/**
 * Transporters Controller
 */
import Transporter from '../models/Transporter.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../utils/pagination.js';

// @desc    Get all transporters
// @route   GET /api/transporters
export const getTransporters = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['transporterName', 'phone', 'gstn', 'city']);
    filters.isActive = { $ne: false };

    const aggregate = Transporter.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await Transporter.aggregatePaginate(aggregate, { page, limit: pageSize });

    res.status(200).json({
        success: true,
        message: 'Transporters retrieved successfully',
        data: {
            transporters: result.docs,
            totalTransporters: result.totalDocs,
            ...buildPaginationResponse(result.totalDocs, page, pageSize),
        },
    });
});

// @desc    Get single transporter
// @route   GET /api/transporters/:id
export const getTransporterById = asyncHandler(async (req, res) => {
    const transporter = await Transporter.findById(req.params.id);
    if (!transporter) {
        return res.status(404).json({ success: false, message: 'Transporter not found' });
    }
    res.status(200).json({ success: true, data: transporter });
});

// @desc    Create transporter
// @route   POST /api/transporters
export const createTransporter = asyncHandler(async (req, res) => {
    const transporter = await Transporter.create(req.body);
    res.status(201).json({ success: true, message: 'Transporter created successfully', data: transporter });
});

// @desc    Update transporter
// @route   PUT /api/transporters/:id
export const updateTransporter = asyncHandler(async (req, res) => {
    const transporter = await Transporter.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!transporter) {
        return res.status(404).json({ success: false, message: 'Transporter not found' });
    }
    res.status(200).json({ success: true, message: 'Transporter updated successfully', data: transporter });
});

// @desc    Delete transporter
// @route   DELETE /api/transporters/:id
export const deleteTransporter = asyncHandler(async (req, res) => {
    const transporter = await Transporter.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!transporter) {
        return res.status(404).json({ success: false, message: 'Transporter not found' });
    }
    res.status(200).json({ success: true, message: 'Transporter deleted successfully' });
});
