import HuskSales from '../../models/sales/HuskSales.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getHuskSales = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName', 'brokerName']);
    filters.isActive = { $ne: false };
    const aggregate = HuskSales.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await HuskSales.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { huskSales: result.docs, totalHuskSales: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});

export const getHuskSaleById = asyncHandler(async (req, res) => {
    const record = await HuskSales.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});

export const createHuskSale = asyncHandler(async (req, res) => {
    const record = await HuskSales.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});

export const updateHuskSale = asyncHandler(async (req, res) => {
    const record = await HuskSales.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});

export const deleteHuskSale = asyncHandler(async (req, res) => {
    const record = await HuskSales.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
