import FinancialTransaction from '../models/FinancialTransaction.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../utils/pagination.js';

export const getTransactions = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['transactionType', 'partyType', 'partyName', 'paymentMode']);
    filters.isActive = { $ne: false };

    const aggregate = FinancialTransaction.aggregate([
        { $match: filters },
        { $sort: sort }
    ]);

    const result = await FinancialTransaction.aggregatePaginate(aggregate, { page, limit: pageSize });
    res.status(200).json({
        success: true,
        data: {
            transactions: result.docs,
            totalTransactions: result.totalDocs,
            ...buildPaginationResponse(result.totalDocs, page, pageSize)
        }
    });
});

export const getTransactionById = asyncHandler(async (req, res) => {
    const record = await FinancialTransaction.findById(req.params.id);
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, data: record });
});

export const createTransaction = asyncHandler(async (req, res) => {
    const record = await FinancialTransaction.create(req.body);
    res.status(201).json({ success: true, message: 'Transaction created successfully', data: record });
});

export const updateTransaction = asyncHandler(async (req, res) => {
    const record = await FinancialTransaction.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Transaction updated successfully', data: record });
});

export const deleteTransaction = asyncHandler(async (req, res) => {
    const record = await FinancialTransaction.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
    res.status(200).json({ success: true, message: 'Transaction deleted successfully' });
});
