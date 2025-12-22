import RiceBranSales from '../../models/sales/RiceBranSales.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getRiceBranSales = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName', 'brokerName']);
    filters.isActive = { $ne: false };
    const aggregate = RiceBranSales.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await RiceBranSales.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { riceBranSales: result.docs, totalRiceBranSales: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});

export const getRiceBranSaleById = asyncHandler(async (req, res) => {
    const record = await RiceBranSales.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});

export const createRiceBranSale = asyncHandler(async (req, res) => {
    const record = await RiceBranSales.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});

export const updateRiceBranSale = asyncHandler(async (req, res) => {
    const record = await RiceBranSales.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});

export const deleteRiceBranSale = asyncHandler(async (req, res) => {
    const record = await RiceBranSales.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
