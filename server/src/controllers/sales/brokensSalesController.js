import BrokensSales from '../../models/sales/BrokensSales.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getBrokensSales = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName', 'brokerName']);
    filters.isActive = { $ne: false };
    const aggregate = BrokensSales.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await BrokensSales.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { brokensSales: result.docs, totalBrokensSales: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});

// Get all Brokens sales for dropdown
export const getAllBrokensSales = asyncHandler(async (req, res) => {
    const sales = await BrokensSales.find({ isActive: { $ne: false } })
        .select('dealNumber partyName brokerName')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: { brokensSales: sales },
    });
});

// Get Brokens sale by deal number (for auto-fill)
export const getBrokensSaleByDealNumber = asyncHandler(async (req, res) => {
    const { dealNumber } = req.params;
    const record = await BrokensSales.findOne({ dealNumber, isActive: { $ne: false } })
        .select('partyName brokerName');
    if (!record) return res.status(404).json({ success: false, message: 'Brokens sale not found' });
    res.status(200).json({ success: true, data: record });
});

export const getBrokensSaleById = asyncHandler(async (req, res) => {
    const record = await BrokensSales.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});

export const createBrokensSale = asyncHandler(async (req, res) => {
    const record = await BrokensSales.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});

export const updateBrokensSale = asyncHandler(async (req, res) => {
    const record = await BrokensSales.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});

export const deleteBrokensSale = asyncHandler(async (req, res) => {
    const record = await BrokensSales.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
