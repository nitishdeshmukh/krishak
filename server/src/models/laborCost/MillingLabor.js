import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { generateLaborNumber } from '../../utils/numberGenerator.js';

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

// Pre-save hook to generate labor number and calculate total amount
millingLaborSchema.pre('save', async function (next) {
    if (!this.laborNumber) {
        this.laborNumber = await generateLaborNumber('MILLING_LABOR');
    }

    // Calculate total amount
    this.totalAmount = this.hopperGunnyCount * this.hopperRate;

    next();
});

const MillingLabor = mongoose.model('MillingLabor', millingLaborSchema);
export default MillingLabor;
