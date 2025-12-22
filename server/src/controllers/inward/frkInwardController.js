import FrkInward from '../../models/inward/FrkInward.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getFrkInward = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName']);
    filters.isActive = { $ne: false };
    const aggregate = FrkInward.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await FrkInward.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { frkInward: result.docs, totalFrkInward: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});
export const getFrkInwardById = asyncHandler(async (req, res) => {
    const record = await FrkInward.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});
export const createFrkInward = asyncHandler(async (req, res) => {
    const record = await FrkInward.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});
export const updateFrkInward = asyncHandler(async (req, res) => {
    const record = await FrkInward.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});
export const deleteFrkInward = asyncHandler(async (req, res) => {
    const record = await FrkInward.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
