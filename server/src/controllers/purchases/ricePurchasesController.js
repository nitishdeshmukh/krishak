/**
 * Rice Purchases Controller
 */
import RicePurchase from '../../models/purchases/RicePurchase.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getRicePurchases = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName', 'brokerName', 'lotNumber']);
    filters.isActive = { $ne: false };

    const aggregate = RicePurchase.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await RicePurchase.aggregatePaginate(aggregate, { page, limit: pageSize });

    res.status(200).json({
        success: true,
        data: { ricePurchases: result.docs, totalRicePurchases: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) },
    });
});

export const getAllRicePurchases = asyncHandler(async (req, res) => {
    const purchases = await RicePurchase.find({ isActive: { $ne: false } })
        .select('ricePurchaseNumber')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: { ricePurchases: purchases },
    });
});

// Get rice purchase by purchase number (for auto-fill)
export const getRicePurchaseByNumber = asyncHandler(async (req, res) => {
    const { purchaseNumber } = req.params;
    const record = await RicePurchase.findOne({ ricePurchaseNumber: purchaseNumber, isActive: { $ne: false } })
        .select('partyName brokerName');
    if (!record) return res.status(404).json({ success: false, message: 'Rice purchase not found' });
    res.status(200).json({ success: true, data: record });
});

export const getRicePurchaseById = asyncHandler(async (req, res) => {
    const record = await RicePurchase.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});

export const createRicePurchase = asyncHandler(async (req, res) => {
    const record = await RicePurchase.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});

export const updateRicePurchase = asyncHandler(async (req, res) => {
    const record = await RicePurchase.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});

export const deleteRicePurchase = asyncHandler(async (req, res) => {
    const record = await RicePurchase.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
