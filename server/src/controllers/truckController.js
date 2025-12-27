import asyncHandler from '../utils/asyncHandler.js';
import Truck from '../models/Truck.js';

/**
 * @desc    Add a new truck
 * @route   POST /api/trucks
 * @access  Private
 */
export const createTruck = asyncHandler(async (req, res) => {
    const { truckNumber } = req.body;

    if (!truckNumber) {
        res.status(400);
        throw new Error('Truck number is required');
    }

    const truck = await Truck.create({
        truckNumber,
    });

    res.status(201).json({
        success: true,
        data: truck,
        message: 'Truck added successfully',
    });
});

/**
 * @desc    Get all trucks
 * @route   GET /api/trucks
 * @access  Private
 */
export const getTrucks = asyncHandler(async (req, res) => {
    const trucks = await Truck.find({}).sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: trucks,
        message: 'Trucks retrieved successfully',
    });
});

/**
 * @desc    Delete a truck
 * @route   DELETE /api/trucks/:id
 * @access  Private
 */
export const deleteTruck = asyncHandler(async (req, res) => {
    const truck = await Truck.findById(req.params.id);

    if (!truck) {
        res.status(404);
        throw new Error('Truck not found');
    }

    await truck.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Truck deleted successfully',
    });
});
