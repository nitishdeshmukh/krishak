import GovtSackOutward from '../../models/outward/GovtSackOutward.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getGovtSackOutward = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['committeeName']);
    filters.isActive = { $ne: false };
    const aggregate = GovtSackOutward.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await GovtSackOutward.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { govtSackOutward: result.docs, totalGovtSackOutward: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});
export const getGovtSackOutwardById = asyncHandler(async (req, res) => {
    const record = await GovtSackOutward.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});
export const createGovtSackOutward = asyncHandler(async (req, res) => {
    const record = await GovtSackOutward.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});
export const updateGovtSackOutward = asyncHandler(async (req, res) => {
    const record = await GovtSackOutward.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});
export const deleteGovtSackOutward = asyncHandler(async (req, res) => {
    const record = await GovtSackOutward.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
