import OtherSales from '../../models/sales/OtherSales.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getOtherSales = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName', 'brokerName', 'itemName']);
    filters.isActive = { $ne: false };
    const aggregate = OtherSales.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await OtherSales.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { otherSales: result.docs, totalOtherSales: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});

// Get all Other sales for dropdown
export const getAllOtherSales = asyncHandler(async (req, res) => {
    const sales = await OtherSales.find({ isActive: { $ne: false } })
        .select('dealNumber partyName brokerName itemName')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: { otherSales: sales },
    });
});

// Get Other sale by deal number (for auto-fill)
export const getOtherSaleByDealNumber = asyncHandler(async (req, res) => {
    const { dealNumber } = req.params;
    const record = await OtherSales.findOne({ dealNumber, isActive: { $ne: false } })
        .select('partyName brokerName itemName');
    if (!record) return res.status(404).json({ success: false, message: 'Other sale not found' });
    res.status(200).json({ success: true, data: record });
});

export const getOtherSaleById = asyncHandler(async (req, res) => {
    const record = await OtherSales.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});

export const createOtherSale = asyncHandler(async (req, res) => {
    const record = await OtherSales.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});

export const updateOtherSale = asyncHandler(async (req, res) => {
    const record = await OtherSales.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});

export const deleteOtherSale = asyncHandler(async (req, res) => {
    const record = await OtherSales.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
