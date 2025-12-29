import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { createNumberGeneratorMiddleware } from '../../utils/numberGenerator.js';

const frkPurchaseSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    frkPurchaseNumber: { type: String, trim: true, unique: true },
    partyName: { type: String, required: true, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
    brokerName: { type: String, trim: true },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker' },

    quantity: { type: String, trim: true },
    rate: { type: String, trim: true },
    amount: { type: String, trim: true },

    gstPercent: { type: String, trim: true },
    gstAmount: { type: String, trim: true },
    payableAmount: { type: String, trim: true },

    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Auto-generate frkPurchaseNumber: FP-DDMMYY-N
frkPurchaseSchema.pre('save', createNumberGeneratorMiddleware('frkPurchaseNumber', 'FP'));

frkPurchaseSchema.plugin(aggregatePaginate);

export default mongoose.model('FrkPurchase', frkPurchaseSchema);
