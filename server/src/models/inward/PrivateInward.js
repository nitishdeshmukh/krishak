import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { createNumberGeneratorMiddleware } from '../../utils/numberGenerator.js';

const schema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    inwardNumber: { type: String, trim: true, unique: true },
    partyName: { type: String, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
    riceType: { type: String, trim: true },
    sackCount: { type: String, trim: true },
    weight: { type: String, trim: true },
    truckNo: { type: String, trim: true },
    rstNo: { type: String, trim: true },
    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Auto-generate inwardNumber: PVI-DDMMYY-N
schema.pre('save', createNumberGeneratorMiddleware('inwardNumber', 'PVI'));

schema.plugin(aggregatePaginate);
export default mongoose.model('PrivateInward', schema);
