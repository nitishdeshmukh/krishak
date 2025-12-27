import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    partyName: { type: String, required: true, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
    brokerName: { type: String, trim: true },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker' },

    salesType: { type: String, enum: ['do-sales', 'other-sales'] },
    quantity: { type: String, trim: true },
    delivery: { type: String, enum: ['at-location', 'delivered'] },

    // DO Entries (for DO बिक्री)
    doEntries: [{
        doNumber: { type: String, trim: true },
        dhanMota: { type: String, trim: true },
        dhanPatla: { type: String, trim: true },
        dhanSarna: { type: String, trim: true },
    }],

    paddyType: { type: String, trim: true },
    paddyQuantity: { type: String, trim: true },
    paddyRate: { type: String, trim: true },
    wastagePercent: { type: String, trim: true },
    brokerage: { type: String, trim: true },

    packaging: { type: String, enum: ['with-weight', 'with-quantity', 'return'] },
    newPackagingRate: { type: String, trim: true },
    oldPackagingRate: { type: String, trim: true },
    plasticPackagingRate: { type: String, trim: true },

    // Legacy fields
    rate: { type: String, trim: true },
    amount: { type: String, trim: true },
    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

schema.plugin(aggregatePaginate);
export default mongoose.model('PaddySales', schema);
