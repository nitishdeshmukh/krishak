import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { createNumberGeneratorMiddleware } from '../../utils/numberGenerator.js';

const otherLaborSchema = new mongoose.Schema(
    {
        laborNumber: {
            type: String,
            unique: true,
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
        },
        laborType: {
            type: String,
            enum: ['pala_bharai', 'kota', 'silai', 'other'],
            required: [true, 'Labor type is required'],
        },
        laborTeam: {
            type: String,
            required: [true, 'Labor team name is required'],
        },
        gunnyCount: {
            type: Number,
            default: 0,
        },
        rate: {
            type: Number,
            default: 0,
        },
        detail: {
            type: String,
            default: '',
        },
        totalAmount: {
            type: Number,
            required: [true, 'Total amount is required'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Add pagination plugin
otherLaborSchema.plugin(mongooseAggregatePaginate);

// Auto-generate laborNumber: OTL-DDMMYY-N
otherLaborSchema.pre('save', createNumberGeneratorMiddleware('laborNumber', 'OTL'));

// Pre-save hook to calculate amounts
otherLaborSchema.pre('save', function (next) {
    // Calculate total amount for pala_bharai, kota, silai (not for 'other')
    if (this.laborType !== 'other' && this.rate > 0) {
        this.totalAmount = this.rate; // For these types, rate is the total amount
        this.gunnyCount = 0; // No gunny count for these types
    }
    next();
});

const OtherLabor = mongoose.model('OtherLabor', otherLaborSchema);
export default OtherLabor;
