import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { generateLaborNumber } from '../../utils/numberGenerator.js';

const inwardLaborSchema = new mongoose.Schema(
    {
        laborNumber: {
            type: String,
            unique: true,
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
        },
        inwardType: {
            type: String,
            enum: ['paddy', 'rice', 'sack', 'frk', 'other'],
            required: [true, 'Inward type is required'],
        },
        truckNumber: {
            type: String,
            required: [true, 'Truck number is required'],
        },
        totalBags: {
            type: Number,
            required: [true, 'Total bags is required'],
        },
        bundleCount: {
            type: Number,
            default: 0,
        },
        unloadingRate: {
            type: Number,
            required: [true, 'Unloading rate is required'],
        },
        stackingRate: {
            type: Number,
            required: [true, 'Stacking rate is required'],
        },
        laborTeam: {
            type: String,
            required: [true, 'Labor team name is required'],
        },
        unloadingAmount: {
            type: Number,
            default: 0,
        },
        stackingAmount: {
            type: Number,
            default: 0,
        },
        totalAmount: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Add pagination plugin
inwardLaborSchema.plugin(mongooseAggregatePaginate);

// Pre-save hook to generate labor number and calculate amounts
inwardLaborSchema.pre('save', async function (next) {
    if (!this.laborNumber) {
        this.laborNumber = await generateLaborNumber('INWARD_LABOR');
    }

    // Calculate amounts
    this.unloadingAmount = this.totalBags * this.unloadingRate;
    this.stackingAmount = this.totalBags * this.stackingRate;
    this.totalAmount = this.unloadingAmount + this.stackingAmount;

    next();
});

const InwardLabor = mongoose.model('InwardLabor', inwardLaborSchema);
export default InwardLabor;
