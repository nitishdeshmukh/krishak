/**
 * FRK Purchases Controller
 */
import FrkPurchase from '../../models/purchases/FrkPurchase.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getFrkPurchases = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName', 'brokerName']);
    filters.isActive = { $ne: false };

    const aggregate = FrkPurchase.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await FrkPurchase.aggregatePaginate(aggregate, { page, limit: pageSize });

    res.status(200).json({
        success: true,
        data: { frkPurchases: result.docs, totalFrkPurchases: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) },
    });
});

export const getFrkPurchaseById = asyncHandler(async (req, res) => {
    const record = await FrkPurchase.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});

export const createFrkPurchase = asyncHandler(async (req, res) => {
    const record = await FrkPurchase.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});

export const updateFrkPurchase = asyncHandler(async (req, res) => {
    const record = await FrkPurchase.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});

export const deleteFrkPurchase = asyncHandler(async (req, res) => {
    const record = await FrkPurchase.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
