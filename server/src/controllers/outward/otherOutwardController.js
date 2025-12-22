import OtherOutward from '../../models/outward/OtherOutward.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getOtherOutward = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName', 'brokerName', 'itemName']);
    filters.isActive = { $ne: false };
    const aggregate = OtherOutward.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await OtherOutward.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { otherOutward: result.docs, totalOtherOutward: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});
export const getOtherOutwardById = asyncHandler(async (req, res) => {
    const record = await OtherOutward.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});
export const createOtherOutward = asyncHandler(async (req, res) => {
    const record = await OtherOutward.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});
export const updateOtherOutward = asyncHandler(async (req, res) => {
    const record = await OtherOutward.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});
export const deleteOtherOutward = asyncHandler(async (req, res) => {
    const record = await OtherOutward.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
