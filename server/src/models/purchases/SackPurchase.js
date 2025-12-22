import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const sackPurchaseSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    partyName: { type: String, required: true, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },

    newPackagingCount: { type: String, trim: true },
    newPackagingRate: { type: String, trim: true },
    oldPackagingCount: { type: String, trim: true },
    oldPackagingRate: { type: String, trim: true },
    plasticPackagingCount: { type: String, trim: true },
    plasticPackagingRate: { type: String, trim: true },

    payableAmount: { type: String, trim: true },

    // Legacy mapping
    sackType: { type: String, trim: true },
    quantity: { type: String, trim: true },
    rate: { type: String, trim: true },
    amount: { type: String, trim: true },

    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

sackPurchaseSchema.plugin(aggregatePaginate);

export default mongoose.model('SackPurchase', sackPurchaseSchema);
