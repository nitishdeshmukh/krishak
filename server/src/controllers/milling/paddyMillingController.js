/**
 * Paddy Milling Controller
 */
import PaddyMilling from '../../models/milling/PaddyMilling.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

// @desc    Get all paddy milling records
// @route   GET /api/milling/paddy
export const getPaddyMilling = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['paddyType']);
    filters.isActive = { $ne: false };

    const aggregate = PaddyMilling.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await PaddyMilling.aggregatePaginate(aggregate, { page, limit: pageSize });

    res.status(200).json({
        success: true,
        message: 'Paddy Milling records retrieved successfully',
        data: {
            paddyMilling: result.docs,
            totalPaddyMilling: result.totalDocs,
            ...buildPaginationResponse(result.totalDocs, page, pageSize),
        },
    });
});

// @desc    Get single paddy milling record
// @route   GET /api/milling/paddy/:id
export const getPaddyMillingById = asyncHandler(async (req, res) => {
    const record = await PaddyMilling.findById(req.params.id);
    if (!record) {
        return res.status(404).json({ success: false, message: 'Paddy Milling record not found' });
    }
    res.status(200).json({ success: true, data: record });
});

// @desc    Create paddy milling record
// @route   POST /api/milling/paddy
export const createPaddyMilling = asyncHandler(async (req, res) => {
    const record = await PaddyMilling.create(req.body);
    res.status(201).json({ success: true, message: 'Paddy Milling record created successfully', data: record });
});

// @desc    Update paddy milling record
// @route   PUT /api/milling/paddy/:id
export const updatePaddyMilling = asyncHandler(async (req, res) => {
    const record = await PaddyMilling.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) {
        return res.status(404).json({ success: false, message: 'Paddy Milling record not found' });
    }
    res.status(200).json({ success: true, message: 'Paddy Milling record updated successfully', data: record });
});

// @desc    Delete paddy milling record
// @route   DELETE /api/milling/paddy/:id
export const deletePaddyMilling = asyncHandler(async (req, res) => {
    const record = await PaddyMilling.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) {
        return res.status(404).json({ success: false, message: 'Paddy Milling record not found' });
    }
    res.status(200).json({ success: true, message: 'Paddy Milling record deleted successfully' });
});
