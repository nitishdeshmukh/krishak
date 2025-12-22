import PrivateRiceOutward from '../../models/outward/PrivateRiceOutward.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getPrivateRiceOutward = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName', 'brokerName', 'lotNo']);
    filters.isActive = { $ne: false };
    const aggregate = PrivateRiceOutward.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await PrivateRiceOutward.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { privateRiceOutward: result.docs, totalPrivateRiceOutward: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});
export const getPrivateRiceOutwardById = asyncHandler(async (req, res) => {
    const record = await PrivateRiceOutward.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});
export const createPrivateRiceOutward = asyncHandler(async (req, res) => {
    const record = await PrivateRiceOutward.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});
export const updatePrivateRiceOutward = asyncHandler(async (req, res) => {
    const record = await PrivateRiceOutward.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});
export const deletePrivateRiceOutward = asyncHandler(async (req, res) => {
    const record = await PrivateRiceOutward.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
