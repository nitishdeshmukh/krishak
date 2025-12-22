import PrivateInward from '../../models/inward/PrivateInward.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getPrivateInward = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName']);
    filters.isActive = { $ne: false };
    const aggregate = PrivateInward.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await PrivateInward.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { privateInward: result.docs, totalPrivateInward: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});
export const getPrivateInwardById = asyncHandler(async (req, res) => {
    const record = await PrivateInward.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});
export const createPrivateInward = asyncHandler(async (req, res) => {
    const record = await PrivateInward.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});
export const updatePrivateInward = asyncHandler(async (req, res) => {
    const record = await PrivateInward.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});
export const deletePrivateInward = asyncHandler(async (req, res) => {
    const record = await PrivateInward.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
