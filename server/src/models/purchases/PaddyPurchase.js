import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const paddyPurchaseSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    partyName: { type: String, required: true, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
    brokerName: { type: String, trim: true },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker' },

    delivery: { type: String, enum: ['pickup', 'delivery'] },
    purchaseType: { type: String, enum: ['do-purchase', 'other-purchase'] },

    doEntries: [{
        doInfo: { type: String, trim: true },
        doNumber: { type: String, trim: true },
        committeeName: { type: String, trim: true },
        doPaddyQuantity: { type: String, trim: true }
    }],

    grainType: { type: String, trim: true },
    grainQuantity: { type: String, trim: true },
    quantity: { type: String, trim: true },

    // Note: Rate and Amount were possibly missing from observed form snippet or handled differently
    // Keeping them as they are core to purchase models usually
    rate: { type: String, trim: true },
    amount: { type: String, trim: true },

    wastagePercent: { type: String, trim: true },
    brokerage: { type: String, trim: true },

    includeCertificate: { type: String, enum: ['with-weight', 'with-quantity', 'return'] },

    newPackagingRate: { type: String, trim: true },
    oldPackagingRate: { type: String, trim: true },
    plasticPackagingRate: { type: String, trim: true },

    lifting: { type: String, trim: true },
    liftingBalance: { type: String, trim: true },

    // Legacy mapping
    paddyType: { type: String, trim: true },
    bardana: { type: String, trim: true },
    aadat: { type: String, trim: true },

    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

paddyPurchaseSchema.plugin(aggregatePaginate);

export default mongoose.model('PaddyPurchase', paddyPurchaseSchema);
