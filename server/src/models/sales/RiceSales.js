import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    partyName: { type: String, required: true, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
    brokerName: { type: String, trim: true },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker' },

    lotNumber: { type: String, trim: true },
    saleType: { type: String, enum: ['fci', 'nan'] },
    riceType: { type: String, trim: true },

    quantity: { type: String, trim: true },
    rate: { type: String, trim: true },
    amount: { type: String, trim: true },

    discountPercent: { type: String, trim: true },
    discountAmount: { type: String, trim: true },

    brokeragePerQuintal: { type: String, trim: true },
    brokerPayable: { type: String, trim: true },

    packaging: { type: String, enum: ['with-packaging', 'return-packaging'] },
    newPackagingCount: { type: String, trim: true },
    newPackagingRate: { type: String, trim: true },
    oldPackagingCount: { type: String, trim: true },
    oldPackagingRate: { type: String, trim: true },
    plasticPackagingCount: { type: String, trim: true },
    plasticPackagingRate: { type: String, trim: true },

    totalPackagingAmount: { type: String, trim: true },
    totalPayable: { type: String, trim: true },

    // Legacy mapping
    bardana: { type: String, trim: true },
    aadat: { type: String, trim: true },

    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

schema.plugin(aggregatePaginate);
export default mongoose.model('RiceSales', schema);
