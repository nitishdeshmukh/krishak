/**
 * Other Purchases Controller
 */
import OtherPurchase from '../../models/purchases/OtherPurchase.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getOtherPurchases = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName', 'brokerName', 'itemName']);
    filters.isActive = { $ne: false };

    const aggregate = OtherPurchase.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await OtherPurchase.aggregatePaginate(aggregate, { page, limit: pageSize });

    res.status(200).json({
        success: true,
        data: { otherPurchases: result.docs, totalOtherPurchases: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) },
    });
});

export const getAllOtherPurchases = asyncHandler(async (req, res) => {
    const otherPurchases = await OtherPurchase.find({ isActive: { $ne: false } })
        .select('otherPurchaseNumber')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: 'All Other Purchases retrieved successfully',
        data: { otherPurchases },
    });
});

export const getOtherPurchaseById = asyncHandler(async (req, res) => {
    const record = await OtherPurchase.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});

export const createOtherPurchase = asyncHandler(async (req, res) => {
    const record = await OtherPurchase.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});

export const updateOtherPurchase = asyncHandler(async (req, res) => {
    const record = await OtherPurchase.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});

export const deleteOtherPurchase = asyncHandler(async (req, res) => {
    const record = await OtherPurchase.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
