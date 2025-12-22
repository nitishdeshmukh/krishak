import PrivateSackOutward from '../../models/outward/PrivateSackOutward.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getPrivateSackOutward = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName']);
    filters.isActive = { $ne: false };
    const aggregate = PrivateSackOutward.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await PrivateSackOutward.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { privateSackOutward: result.docs, totalPrivateSackOutward: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});
export const getPrivateSackOutwardById = asyncHandler(async (req, res) => {
    const record = await PrivateSackOutward.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});
export const createPrivateSackOutward = asyncHandler(async (req, res) => {
    const record = await PrivateSackOutward.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});
export const updatePrivateSackOutward = asyncHandler(async (req, res) => {
    const record = await PrivateSackOutward.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});
export const deletePrivateSackOutward = asyncHandler(async (req, res) => {
    const record = await PrivateSackOutward.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
