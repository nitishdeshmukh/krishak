import OtherInward from '../../models/inward/OtherInward.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getOtherInward = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName']);
    filters.isActive = { $ne: false };
    const aggregate = OtherInward.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await OtherInward.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { otherInward: result.docs, totalOtherInward: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});
export const getOtherInwardById = asyncHandler(async (req, res) => {
    const record = await OtherInward.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});
export const createOtherInward = asyncHandler(async (req, res) => {
    const record = await OtherInward.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});
export const updateOtherInward = asyncHandler(async (req, res) => {
    const record = await OtherInward.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});
export const deleteOtherInward = asyncHandler(async (req, res) => {
    const record = await OtherInward.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
