import OutwardLabor from '../../models/laborCost/OutwardLabor.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getOutwardLabor = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['laborTeam', 'outwardType', 'truckNumber']);
    filters.isActive = { $ne: false };
    const aggregate = OutwardLabor.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await OutwardLabor.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { outwardLabor: result.docs, totalOutwardLabor: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});

export const getOutwardLaborById = asyncHandler(async (req, res) => {
    const record = await OutwardLabor.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});

export const createOutwardLabor = asyncHandler(async (req, res) => {
    const record = await OutwardLabor.create(req.body);
    res.status(201).json({ success: true, message: 'Outward Labor created successfully', data: record });
});

export const updateOutwardLabor = asyncHandler(async (req, res) => {
    const record = await OutwardLabor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Outward Labor updated successfully', data: record });
});

export const deleteOutwardLabor = asyncHandler(async (req, res) => {
    const record = await OutwardLabor.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Outward Labor deleted successfully' });
});
