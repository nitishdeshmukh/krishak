import GovtRiceOutward from '../../models/outward/GovtRiceOutward.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getGovtRiceOutward = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['committeeName', 'doNumber', 'lotNo']);
    filters.isActive = { $ne: false };
    const aggregate = GovtRiceOutward.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await GovtRiceOutward.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { govtRiceOutward: result.docs, totalGovtRiceOutward: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});
export const getGovtRiceOutwardById = asyncHandler(async (req, res) => {
    const record = await GovtRiceOutward.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});
export const createGovtRiceOutward = asyncHandler(async (req, res) => {
    const record = await GovtRiceOutward.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});
export const updateGovtRiceOutward = asyncHandler(async (req, res) => {
    const record = await GovtRiceOutward.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});
export const deleteGovtRiceOutward = asyncHandler(async (req, res) => {
    const record = await GovtRiceOutward.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
