import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { createNumberGeneratorMiddleware } from '../../utils/numberGenerator.js';

const schema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    inwardNumber: { type: String, trim: true, unique: true },
    doNumber: { type: String, trim: true },
    // Form uses samitiSangrahan instead of committeeName
    samitiSangrahan: { type: String, trim: true },
    // Keeping aliases for backward compatibility if needed, or mapping
    committeeName: { type: String, trim: true },

    // Detailed Gunny Info
    gunnyNew: { type: String, trim: true },
    gunnyOld: { type: String, trim: true },
    gunnyPlastic: { type: String, trim: true },

    // Weights
    juteWeight: { type: String, trim: true },
    plasticWeight: { type: String, trim: true },
    gunnyWeight: { type: String, trim: true },
    truckLoadWeight: { type: String, trim: true },
    weight: { type: String, trim: true }, // Generic weight if needed

    // DO Info
    balDo: { type: String, trim: true },

    // Transport
    truckNo: { type: String, trim: true },
    rstNo: { type: String, trim: true },

    // Paddy Details
    dhanType: { type: String, trim: true },
    dhanMota: { type: String, trim: true },
    dhanPatla: { type: String, trim: true },
    dhanSarna: { type: String, trim: true },
    dhanMaha: { type: String, trim: true },
    dhanRb: { type: String, trim: true },

    // Core fields
    doEntry: { type: mongoose.Schema.Types.ObjectId, ref: 'DOEntry' },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
    committee: { type: mongoose.Schema.Types.ObjectId, ref: 'Committee' },
    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Auto-generate inwardNumber: PI-DDMMYY-N
schema.pre('save', createNumberGeneratorMiddleware('inwardNumber', 'PI'));

schema.plugin(aggregatePaginate);
export default mongoose.model('PaddyInward', schema);
