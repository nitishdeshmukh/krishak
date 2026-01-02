import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { createNumberGeneratorMiddleware } from '../../utils/numberGenerator.js';

const outwardLaborSchema = new mongoose.Schema(
    {
        laborNumber: {
            type: String,
            unique: true,
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
        },
        outwardType: {
            type: String,
            enum: ['paddy', 'rice', 'sack', 'frk', 'other'],
            required: [true, 'Outward type is required'],
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
        loadingRate: {
            type: Number,
            required: [true, 'Loading rate is required'],
        },
        diulaiRate: {
            type: Number,
            required: [true, 'Diulai rate is required'],
        },
        laborTeam: {
            type: String,
            required: [true, 'Labor team name is required'],
        },
        loadingAmount: {
            type: Number,
            default: 0,
        },
        diulaiAmount: {
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
outwardLaborSchema.plugin(mongooseAggregatePaginate);

// Auto-generate laborNumber: OWL-DDMMYY-N
outwardLaborSchema.pre('save', createNumberGeneratorMiddleware('laborNumber', 'OWL'));

// Pre-save hook to calculate amounts
outwardLaborSchema.pre('save', function (next) {
    // Calculate amounts
    this.loadingAmount = this.totalBags * this.loadingRate;
    this.diulaiAmount = this.totalBags * this.diulaiRate;
    this.totalAmount = this.loadingAmount + this.diulaiAmount;
    next();
});

const OutwardLabor = mongoose.model('OutwardLabor', outwardLaborSchema);
export default OutwardLabor;
