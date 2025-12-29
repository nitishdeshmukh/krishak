import MillingLabor from '../../models/laborCost/MillingLabor.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getMillingLabor = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['laborTeam']);
    filters.isActive = { $ne: false };
    const aggregate = MillingLabor.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await MillingLabor.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { millingLabor: result.docs, totalMillingLabor: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});

export const getMillingLaborById = asyncHandler(async (req, res) => {
    const record = await MillingLabor.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});

export const createMillingLabor = asyncHandler(async (req, res) => {
    const record = await MillingLabor.create(req.body);
    res.status(201).json({ success: true, message: 'Milling Labor created successfully', data: record });
});

export const updateMillingLabor = asyncHandler(async (req, res) => {
    const record = await MillingLabor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Milling Labor updated successfully', data: record });
});

export const deleteMillingLabor = asyncHandler(async (req, res) => {
    const record = await MillingLabor.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Milling Labor deleted successfully' });
});
