import RiceSales from '../../models/sales/RiceSales.js';
import asyncHandler from '../../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../../utils/pagination.js';

export const getRiceSales = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['partyName', 'brokerName', 'lotNumber']);
    filters.isActive = { $ne: false };
    const aggregate = RiceSales.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await RiceSales.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({ success: true, data: { riceSales: result.docs, totalRiceSales: result.totalDocs, ...buildPaginationResponse(result.totalDocs, page, pageSize) } });
});

export const getRiceSaleById = asyncHandler(async (req, res) => {
    const record = await RiceSales.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});

export const createRiceSale = asyncHandler(async (req, res) => {
    const record = await RiceSales.create(req.body);
    res.status(201).json({ success: true, message: 'Created successfully', data: record });
});

export const updateRiceSale = asyncHandler(async (req, res) => {
    const record = await RiceSales.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Updated successfully', data: record });
});

export const deleteRiceSale = asyncHandler(async (req, res) => {
    const record = await RiceSales.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Deleted successfully' });
});
