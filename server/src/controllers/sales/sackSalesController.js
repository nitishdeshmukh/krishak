import SackSales from '../../models/sales/SackSales.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getSackSales = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName']);
    filters.isActive = { $ne: false };
    const aggregate = SackSales.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await SackSales.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { sackSales: result.docs, totalSackSales: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});

// Get all sack sales for dropdown
export const getAllSackSales = asyncHandler(async (req, res) => {
    const sales = await SackSales.find({ isActive: { $ne: false } })
        .select('dealNumber')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: { sackSales: sales },
    });
});

// Get sack sale by deal number (for auto-fill)
export const getSackSaleByDealNumber = asyncHandler(async (req, res) => {
    const { dealNumber } = req.params;
    const record = await SackSales.findOne({ dealNumber, isActive: { $ne: false } })
        .select('partyName');
    if (!record) return res.status(404).json({ success: false, message: 'Sack sale not found' });
    res.status(200).json({ success: true, data: record });
});

export const getSackSaleById = asyncHandler(async (req, res) => {
    const record = await SackSales.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});

export const createSackSale = asyncHandler(async (req, res) => {
    const record = await SackSales.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});

export const updateSackSale = asyncHandler(async (req, res) => {
    const record = await SackSales.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});

export const deleteSackSale = asyncHandler(async (req, res) => {
    const record = await SackSales.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
