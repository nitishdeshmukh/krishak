/**
 * Rice Milling Controller
 */
import RiceMilling from '../../models/milling/RiceMilling.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

// @desc    Get all rice milling records
// @route   GET /api/milling/rice
export const getRiceMilling = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['riceType']);
    filters.isActive = { $ne: false };

    const aggregate = RiceMilling.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await RiceMilling.aggregatePaginate(aggregate, { page, limit: pageSize });

    res.status(200).json({
        success: true,
        message: 'Rice Milling records retrieved successfully',
        data: {
            riceMilling: result.docs,
            totalRiceMilling: result.totalDocs,
            ...buildPaginationResponse(result.totalDocs, page, pageSize),
        },
    });
});

// @desc    Get single rice milling record
// @route   GET /api/milling/rice/:id
export const getRiceMillingById = asyncHandler(async (req, res) => {
    const record = await RiceMilling.findById(req.params.id);
    if (!record) {
        return res.status(404).json({ success: false, message: 'Rice Milling record not found' });
    }
    res.status(200).json({ success: true, data: record });
});

// @desc    Create rice milling record
// @route   POST /api/milling/rice
export const createRiceMilling = asyncHandler(async (req, res) => {
    const record = await RiceMilling.create(req.body);
    res.status(201).json({ success: true, message: 'Rice Milling record created successfully', data: record });
});

// @desc    Update rice milling record
// @route   PUT /api/milling/rice/:id
export const updateRiceMilling = asyncHandler(async (req, res) => {
    const record = await RiceMilling.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) {
        return res.status(404).json({ success: false, message: 'Rice Milling record not found' });
    }
    res.status(200).json({ success: true, message: 'Rice Milling record updated successfully', data: record });
});

// @desc    Delete rice milling record
// @route   DELETE /api/milling/rice/:id
export const deleteRiceMilling = asyncHandler(async (req, res) => {
    const record = await RiceMilling.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) {
        return res.status(404).json({ success: false, message: 'Rice Milling record not found' });
    }
    res.status(200).json({ success: true, message: 'Rice Milling record deleted successfully' });
});
