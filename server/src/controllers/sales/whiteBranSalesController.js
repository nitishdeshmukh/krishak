import WhiteBranSales from '../../models/sales/WhiteBranSales.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getWhiteBranSales = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName', 'brokerName']);
    filters.isActive = { $ne: false };
    const aggregate = WhiteBranSales.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await WhiteBranSales.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { whiteBranSales: result.docs, totalWhiteBranSales: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});

export const getWhiteBranSaleById = asyncHandler(async (req, res) => {
    const record = await WhiteBranSales.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});

export const createWhiteBranSale = asyncHandler(async (req, res) => {
    const record = await WhiteBranSales.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});

export const updateWhiteBranSale = asyncHandler(async (req, res) => {
    const record = await WhiteBranSales.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});

export const deleteWhiteBranSale = asyncHandler(async (req, res) => {
    const record = await WhiteBranSales.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
