import SackInward from '../../models/inward/SackInward.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getSackInward = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName']);
    filters.isActive = { $ne: false };
    const aggregate = SackInward.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await SackInward.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { sackInward: result.docs, totalSackInward: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});
export const getSackInwardById = asyncHandler(async (req, res) => {
    const record = await SackInward.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});
export const createSackInward = asyncHandler(async (req, res) => {
    const record = await SackInward.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});
export const updateSackInward = asyncHandler(async (req, res) => {
    const record = await SackInward.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});
export const deleteSackInward = asyncHandler(async (req, res) => {
    const record = await SackInward.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
