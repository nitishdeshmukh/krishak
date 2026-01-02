import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { createNumberGeneratorMiddleware } from '../../utils/numberGenerator.js';

const schema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    millingNumber: { type: String, trim: true, unique: true },
    paddyType: { type: String, trim: true },
    hopperGunny: { type: String, trim: true },
    hopperQtl: { type: String, trim: true },
    riceType: { type: String, trim: true },
    riceQty: { type: String, trim: true },
    ricePercent: { type: String, trim: true },
    khandaQty: { type: String, trim: true },
    khandaPercent: { type: String, trim: true },
    kodhaQty: { type: String, trim: true },
    kodhaPercent: { type: String, trim: true },
    bhusaTon: { type: String, trim: true },
    bhusaPercent: { type: String, trim: true },
    nakkhiQty: { type: String, trim: true },
    nakkhiPercent: { type: String, trim: true },
    wastagePercent: { type: String, trim: true },
    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Auto-generate millingNumber: PM-DDMMYY-N
schema.pre('save', createNumberGeneratorMiddleware('millingNumber', 'PM'));

schema.plugin(aggregatePaginate);
export default mongoose.model('PaddyMilling', schema);
