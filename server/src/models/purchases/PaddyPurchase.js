import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { createNumberGeneratorMiddleware } from '../../utils/numberGenerator.js';

const paddyPurchaseSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    partyName: { type: String, required: true, trim: true },
    paddyPurchaseNumber: { type: String, trim: true, unique: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
    brokerName: { type: String, trim: true },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker' },
    delivery: { type: String, enum: ['pickup', 'delivery'] },
    purchaseType: { type: String, enum: ['do-purchase', 'other-purchase'] },
    doEntries: [{
        doNumber: { type: String, trim: true },
        committeeName: { type: String, trim: true },
        doPaddyQuantity: { type: String, trim: true }
    }],
    paddyQuantity: { type: String, trim: true },
    paddyRatePerQuintal: { type: String, trim: true },
    wastagePercent: { type: String, trim: true },
    brokerage: { type: String, trim: true },
    gunnyOption: { type: String, enum: ['with-weight', 'with-quantity', 'return'] },
    newPackagingRate: { type: String, trim: true },
    oldPackagingRate: { type: String, trim: true },
    plasticPackagingRate: { type: String, trim: true },
    paddyType: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Auto-generate paddyPurchaseNumber: PPP-DDMMYY-N
paddyPurchaseSchema.pre('save', createNumberGeneratorMiddleware('paddyPurchaseNumber', 'PPP'));

paddyPurchaseSchema.plugin(aggregatePaginate);

export default mongoose.model('PaddyPurchase', paddyPurchaseSchema);
