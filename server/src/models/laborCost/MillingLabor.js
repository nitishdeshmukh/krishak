import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { createNumberGeneratorMiddleware } from '../../utils/numberGenerator.js';

const millingLaborSchema = new mongoose.Schema(
    {
        laborNumber: {
            type: String,
            unique: true,
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
        },
        hopperGunnyCount: {
            type: Number,
            required: [true, 'Hopper gunny count is required'],
        },
        hopperRate: {
            type: Number,
            required: [true, 'Hopper rate is required'],
        },
        laborTeam: {
            type: String,
            required: [true, 'Labor team name is required'],
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
millingLaborSchema.plugin(mongooseAggregatePaginate);

// Auto-generate laborNumber: MIL-DDMMYY-N
millingLaborSchema.pre('save', createNumberGeneratorMiddleware('laborNumber', 'MIL'));

// Pre-save hook to calculate amounts
millingLaborSchema.pre('save', function (next) {
    // Calculate total amount
    this.totalAmount = this.hopperGunnyCount * this.hopperRate;
    next();
});

const MillingLabor = mongoose.model('MillingLabor', millingLaborSchema);
export default MillingLabor;
