/**
 * Brokers Controller
 */
import Broker from '../models/Broker.js';
import asyncHandler from '../utils/asyncHandler.js';
import { getPagination, buildPaginationResponse, getSorting, getFilters } from '../utils/pagination.js';

// @desc    Get all brokers
// @route   GET /api/brokers
export const getBrokers = asyncHandler(async (req, res) => {
    const { page, pageSize } = getPagination(req.query);
    const sort = getSorting(req.query);
    const filters = getFilters(req.query, ['brokerName', 'phone', 'city']);
    filters.isActive = { $ne: false };

    const aggregate = Broker.aggregate([{ $match: filters }, { $sort: sort }]);
    const result = await Broker.aggregatePaginate(aggregate, { page, limit: pageSize });

    res.status(200).json({
        success: true,
        message: 'Brokers retrieved successfully',
        data: {
            brokers: result.docs,
            totalBrokers: result.totalDocs,
            ...buildPaginationResponse(result.totalDocs, page, pageSize),
        },
    });
});

// @desc    Get single broker
// @route   GET /api/brokers/:id
export const getBrokerById = asyncHandler(async (req, res) => {
    const broker = await Broker.findById(req.params.id);
    if (!broker) {
        return res.status(404).json({ success: false, message: 'Broker not found' });
    }
    res.status(200).json({ success: true, data: broker });
});

// @desc    Create broker
// @route   POST /api/brokers
export const createBroker = asyncHandler(async (req, res) => {
    const broker = await Broker.create(req.body);
    res.status(201).json({ success: true, message: 'Broker created successfully', data: broker });
});

// @desc    Update broker
// @route   PUT /api/brokers/:id
export const updateBroker = asyncHandler(async (req, res) => {
    const broker = await Broker.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!broker) {
        return res.status(404).json({ success: false, message: 'Broker not found' });
    }
    res.status(200).json({ success: true, message: 'Broker updated successfully', data: broker });
});

// @desc    Delete broker
// @route   DELETE /api/brokers/:id
export const deleteBroker = asyncHandler(async (req, res) => {
    const broker = await Broker.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!broker) {
        return res.status(404).json({ success: false, message: 'Broker not found' });
    }
    res.status(200).json({ success: true, message: 'Broker deleted successfully' });
});
