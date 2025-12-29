import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { generateLaborNumber } from '../../utils/numberGenerator.js';

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

// Pre-save hook to generate labor number and calculate amount
otherLaborSchema.pre('save', async function (next) {
    if (!this.laborNumber) {
        this.laborNumber = await generateLaborNumber('OTHER_LABOR');
    }

    // Calculate total amount for pala_bharai, kota, silai (not for 'other')
    if (this.laborType !== 'other' && this.rate > 0) {
        this.totalAmount = this.rate; // For these types, rate is the total amount
        this.gunnyCount = 0; // No gunny count for these types
    }

    next();
});

const OtherLabor = mongoose.model('OtherLabor', otherLaborSchema);
export default OtherLabor;
