import FrkSales from '../../models/sales/FrkSales.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getFrkSales = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName', 'brokerName']);
    filters.isActive = { $ne: false };
    const aggregate = FrkSales.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await FrkSales.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { frkSales: result.docs, totalFrkSales: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});

// Get all FRK sales for dropdown
export const getAllFrkSales = asyncHandler(async (req, res) => {
    const sales = await FrkSales.find({ isActive: { $ne: false } })
        .select('dealNumber partyName')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: { frkSales: sales },
    });
});

// Get FRK sale by deal number (for auto-fill)
export const getFrkSaleByDealNumber = asyncHandler(async (req, res) => {
    const { dealNumber } = req.params;
    const record = await FrkSales.findOne({ dealNumber, isActive: { $ne: false } })
        .select('partyName brokerName');
    if (!record) return res.status(404).json({ success: false, message: 'FRK sale not found' });
    res.status(200).json({ success: true, data: record });
});

export const getFrkSaleById = asyncHandler(async (req, res) => {
    const record = await FrkSales.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});

export const createFrkSale = asyncHandler(async (req, res) => {
    const record = await FrkSales.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});

export const updateFrkSale = asyncHandler(async (req, res) => {
    const record = await FrkSales.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});

export const deleteFrkSale = asyncHandler(async (req, res) => {
    const record = await FrkSales.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
