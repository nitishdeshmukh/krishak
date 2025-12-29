import RiceInward from '../../models/inward/RiceInward.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

// Get all unique lot numbers (for dropdowns)
export const getAllLotNumbers = asyncHandler(async (req, res) => {
    const lotNumbers = await RiceInward.find({ isActive: { $ne: false }, lotNo: { $exists: true, $ne: '' } })
        .select('lotNo')
        .distinct('lotNo')
        .sort();
    res.status(200).json({ success: true, data: lotNumbers.map(lotNo => ({ lotNo })) });
});

export const getRiceInward = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName', 'doNumber']);
    filters.isActive = { $ne: false };
    const aggregate = RiceInward.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await RiceInward.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { riceInward: result.docs, totalRiceInward: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});
export const getRiceInwardById = asyncHandler(async (req, res) => {
    const record = await RiceInward.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});
export const createRiceInward = asyncHandler(async (req, res) => {
    const record = await RiceInward.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});
export const updateRiceInward = asyncHandler(async (req, res) => {
    const record = await RiceInward.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});
export const deleteRiceInward = asyncHandler(async (req, res) => {
    const record = await RiceInward.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
