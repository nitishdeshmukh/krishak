/**
 * Paddy Purchases Controller
 */
import PaddyPurchase from '../../models/purchases/PaddyPurchase.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getPaddyPurchases = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName', 'brokerName', 'doEntries.doNumber']);
    filters.isActive = { $ne: false };

    const aggregate = PaddyPurchase.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await PaddyPurchase.aggregatePaginate(aggregate, { page, limit: pageSize });

    res.status(200).json({
        success: true,
        data: { paddyPurchases: result.docs, totalPaddyPurchases: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) },
    });
});

export const getPaddyPurchaseById = asyncHandler(async (req, res) => {
    const record = await PaddyPurchase.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});

export const createPaddyPurchase = asyncHandler(async (req, res) => {
    const record = await PaddyPurchase.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});

export const updatePaddyPurchase = asyncHandler(async (req, res) => {
    const record = await PaddyPurchase.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});

export const deletePaddyPurchase = asyncHandler(async (req, res) => {
    const record = await PaddyPurchase.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
