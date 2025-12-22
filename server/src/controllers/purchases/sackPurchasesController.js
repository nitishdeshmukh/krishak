/**
 * Sack Purchases Controller
 */
import SackPurchase from '../../models/purchases/SackPurchase.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getSackPurchases = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName']);
    filters.isActive = { $ne: false };

    const aggregate = SackPurchase.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await SackPurchase.aggregatePaginate(aggregate, { page, limit: pageSize });

    res.status(200).json({
        success: true,
        data: { sackPurchases: result.docs, totalSackPurchases: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) },
    });
});

export const getSackPurchaseById = asyncHandler(async (req, res) => {
    const record = await SackPurchase.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});

export const createSackPurchase = asyncHandler(async (req, res) => {
    const record = await SackPurchase.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});

export const updateSackPurchase = asyncHandler(async (req, res) => {
    const record = await SackPurchase.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});

export const deleteSackPurchase = asyncHandler(async (req, res) => {
    const record = await SackPurchase.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
