import FrkOutward from '../../models/outward/FrkOutward.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getFrkOutward = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName', 'brokerName']);
    filters.isActive = { $ne: false };
    const aggregate = FrkOutward.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await FrkOutward.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { frkOutward: result.docs, totalFrkOutward: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});
export const getFrkOutwardById = asyncHandler(async (req, res) => {
    const record = await FrkOutward.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});
export const createFrkOutward = asyncHandler(async (req, res) => {
    const record = await FrkOutward.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});
export const updateFrkOutward = asyncHandler(async (req, res) => {
    const record = await FrkOutward.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});
export const deleteFrkOutward = asyncHandler(async (req, res) => {
    const record = await FrkOutward.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
