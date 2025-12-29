import OtherLabor from '../../models/laborCost/OtherLabor.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getOtherLabor = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['laborTeam', 'laborType']);
    filters.isActive = { $ne: false };
    const aggregate = OtherLabor.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await OtherLabor.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { otherLabor: result.docs, totalOtherLabor: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});

export const getOtherLaborById = asyncHandler(async (req, res) => {
    const record = await OtherLabor.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});

export const createOtherLabor = asyncHandler(async (req, res) => {
    const record = await OtherLabor.create(req.body);
    res.status(201).json({ success: true, message: 'Other Labor created successfully', data: record });
});

export const updateOtherLabor = asyncHandler(async (req, res) => {
    const record = await OtherLabor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Other Labor updated successfully', data: record });
});

export const deleteOtherLabor = asyncHandler(async (req, res) => {
    const record = await OtherLabor.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Other Labor deleted successfully' });
});
