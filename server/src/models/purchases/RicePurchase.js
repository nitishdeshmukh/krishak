import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { createNumberGeneratorMiddleware } from '../../utils/numberGenerator.js';

const ricePurchaseSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    ricePurchaseNumber: { type: String, trim: true, unique: true },
    partyName: { type: String, required: true, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
    brokerName: { type: String, trim: true },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker' },

    purchaseType: { type: String, enum: ['lot-purchase', 'other-purchase'] },
    riceType: { type: String, trim: true },
    quantity: { type: String, trim: true },
    rate: { type: String, trim: true },
    amount: { type: String, trim: true },

    wastagePercent: { type: String, trim: true },
    brokerage: { type: String, trim: true },

    packaging: { type: String, enum: ['with-weight', 'with-quantity', 'return'] },
    newPackagingRate: { type: String, trim: true },
    oldPackagingRate: { type: String, trim: true },
    plasticPackagingRate: { type: String, trim: true },

    frk: { type: String, enum: ['frk-included', 'frk-give'] },
    frkRate: { type: String, trim: true },

    lotNumber: { type: String, trim: true },
    riceInward: { type: String, trim: true },
    riceInwardBalance: { type: String, trim: true },

    bardana: { type: String, trim: true },
    aadat: { type: String, trim: true },

    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Auto-generate ricePurchaseNumber: RP-DDMMYY-N
ricePurchaseSchema.pre('save', createNumberGeneratorMiddleware('ricePurchaseNumber', 'RP'));

ricePurchaseSchema.plugin(aggregatePaginate);

export default mongoose.model('RicePurchase', ricePurchaseSchema);
