import RiceBranOutward from '../../models/outward/RiceBranOutward.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getRiceBranOutward = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName', 'brokerName']);
    filters.isActive = { $ne: false };
    const aggregate = RiceBranOutward.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await RiceBranOutward.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { riceBranOutward: result.docs, totalRiceBranOutward: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});
export const getRiceBranOutwardById = asyncHandler(async (req, res) => {
    const record = await RiceBranOutward.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});
export const createRiceBranOutward = asyncHandler(async (req, res) => {
    const record = await RiceBranOutward.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});
export const updateRiceBranOutward = asyncHandler(async (req, res) => {
    const record = await RiceBranOutward.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});
export const deleteRiceBranOutward = asyncHandler(async (req, res) => {
    const record = await RiceBranOutward.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
