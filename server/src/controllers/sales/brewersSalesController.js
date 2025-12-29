import BrewersSales from '../../models/sales/BrewersSales.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getBrewersSales = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName', 'brokerName']);
    filters.isActive = { $ne: false };
    const aggregate = BrewersSales.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await BrewersSales.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { brewersSales: result.docs, totalBrewersSales: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});

// Get all Brewers sales for dropdown
export const getAllBrewersSales = asyncHandler(async (req, res) => {
    const sales = await BrewersSales.find({ isActive: { $ne: false } })
        .select('dealNumber partyName brokerName')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: { brewersSales: sales },
    });
});

// Get Brewers sale by deal number (for auto-fill)
export const getBrewersSaleByDealNumber = asyncHandler(async (req, res) => {
    const { dealNumber } = req.params;
    const record = await BrewersSales.findOne({ dealNumber, isActive: { $ne: false } })
        .select('partyName brokerName');
    if (!record) return res.status(404).json({ success: false, message: 'Brewers sale not found' });
    res.status(200).json({ success: true, data: record });
});

export const getBrewersSaleById = asyncHandler(async (req, res) => {
    const record = await BrewersSales.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});

export const createBrewersSale = asyncHandler(async (req, res) => {
    const record = await BrewersSales.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});

export const updateBrewersSale = asyncHandler(async (req, res) => {
    const record = await BrewersSales.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});

export const deleteBrewersSale = asyncHandler(async (req, res) => {
    const record = await BrewersSales.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
