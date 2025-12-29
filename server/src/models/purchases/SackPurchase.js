import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { createNumberGeneratorMiddleware } from '../../utils/numberGenerator.js';

const sackPurchaseSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    sackPurchaseNumber: { type: String, trim: true, unique: true },
    partyName: { type: String, required: true, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
    delivery: { type: String, enum: ['mill', 'samiti-sangrahan'], trim: true },
    samitiSangrahan: { type: String, trim: true },

    newPackagingCount: { type: String, trim: true },
    newPackagingRate: { type: String, trim: true },
    oldPackagingCount: { type: String, trim: true },
    oldPackagingRate: { type: String, trim: true },
    plasticPackagingCount: { type: String, trim: true },
    plasticPackagingRate: { type: String, trim: true },

    payableAmount: { type: String, trim: true },

    sackType: { type: String, trim: true },
    quantity: { type: String, trim: true },
    rate: { type: String, trim: true },
    amount: { type: String, trim: true },

    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Auto-generate sackPurchaseNumber: SP-DDMMYY-N
sackPurchaseSchema.pre('save', createNumberGeneratorMiddleware('sackPurchaseNumber', 'SP'));

sackPurchaseSchema.plugin(aggregatePaginate);

export default mongoose.model('SackPurchase', sackPurchaseSchema);
