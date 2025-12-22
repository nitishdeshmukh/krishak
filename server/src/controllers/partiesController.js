/**
 * Parties Controller
 */
import Party from '../models/Party.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../utils/pagination.js';

// @desc    Get all parties
// @route   GET /api/parties
export const getParties = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName', 'phone', 'email']);
    filters.isActive = { $ne: false };

    const aggregate = Party.aggregate([
        { $match: filters },
        { $sort: sort },
    ]);

    const result = await Party.aggregatePaginate(aggregate, { page, limit: pageSize });

    res.status(200).json({
        success: true,
        message: 'Parties retrieved successfully',
        data: {
            parties: result.docs,
            totalParties: result.totalDocs,
            ...buildPaginationResponse(result.totalDocs, page, pageSize),
        },
    });
});

// @desc    Get single party
// @route   GET /api/parties/:id
export const getPartyById = asyncHandler(async (req, res) => {
    const party = await Party.findById(req.params.id);
    if (!party) {
        return res.status(404).json({ success: false, message: 'Party not found' });
    }
    res.status(200).json({ success: true, data: party });
});

// @desc    Create party
// @route   POST /api/parties
export const createParty = asyncHandler(async (req, res) => {
    const party = await Party.create(req.body);
    res.status(201).json({ success: true, message: 'Party created successfully', data: party });
});

// @desc    Update party
// @route   PUT /api/parties/:id
export const updateParty = asyncHandler(async (req, res) => {
    const party = await Party.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!party) {
        return res.status(404).json({ success: false, message: 'Party not found' });
    }
    res.status(200).json({ success: true, message: 'Party updated successfully', data: party });
});

// @desc    Delete party
// @route   DELETE /api/parties/:id
export const deleteParty = asyncHandler(async (req, res) => {
    const party = await Party.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!party) {
        return res.status(404).json({ success: false, message: 'Party not found' });
    }
    res.status(200).json({ success: true, message: 'Party deleted successfully' });
});
