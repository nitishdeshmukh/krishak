/**
 * DO Entries Controller
 */
import DOEntry from '../models/DOEntry.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../utils/pagination.js';

// @desc    Get all DO entries
// @route   GET /api/do-entries
export const getDOEntries = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['doNumber', 'committeeCenter', 'status']);
    filters.isActive = { $ne: false };

    const aggregate = DOEntry.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await DOEntry.aggregatePaginate(aggregate, { page, limit: pageSize });

    res.status(200).json({
        success: true,
        message: 'DO Entries retrieved successfully',
        data: {
            doEntries: result.docs,
            totalDOEntries: result.totalDocs,
            ...buildPaginationResponse(result.totalDocs, page, pageSize),
        },
    });
});

// @desc    Get single DO entry
// @route   GET /api/do-entries/:id
export const getDOEntryById = asyncHandler(async (req, res) => {
    const doEntry = await DOEntry.findById(req.params.id);
    if (!doEntry) {
        return res.status(404).json({ success: false, message: 'DO Entry not found' });
    }
    res.status(200).json({ success: true, data: doEntry });
});

// @desc    Create DO entry
// @route   POST /api/do-entries
export const createDOEntry = asyncHandler(async (req, res) => {
    const doEntry = await DOEntry.create(req.body);
    res.status(201).json({ success: true, message: 'DO Entry created successfully', data: doEntry });
});

// @desc    Create bulk DO entries
// @route   POST /api/do-entries/bulk
export const createBulkDOEntries = asyncHandler(async (req, res) => {
    const entries = req.body.entries;
    if (!entries || !Array.isArray(entries) || entries.length === 0) {
        return res.status(400).json({ success: false, message: 'No entries provided' });
    }

    const createdEntries = await DOEntry.insertMany(entries);
    res.status(201).json({
        success: true,
        message: `${createdEntries.length} DO Entries created successfully`,
        data: createdEntries
    });
});

// @desc    Update DO entry
// @route   PUT /api/do-entries/:id
export const updateDOEntry = asyncHandler(async (req, res) => {
    const doEntry = await DOEntry.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doEntry) {
        return res.status(404).json({ success: false, message: 'DO Entry not found' });
    }
    res.status(200).json({ success: true, message: 'DO Entry updated successfully', data: doEntry });
});

// @desc    Delete DO entry
// @route   DELETE /api/do-entries/:id
export const deleteDOEntry = asyncHandler(async (req, res) => {
    const doEntry = await DOEntry.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!doEntry) {
        return res.status(404).json({ success: false, message: 'DO Entry not found' });
    }
    res.status(200).json({ success: true, message: 'DO Entry deleted successfully' });
});
