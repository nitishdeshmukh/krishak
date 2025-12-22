import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    partyName: { type: String, required: true, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
    brokerName: { type: String, trim: true },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker' },

    khandaQuantity: { type: String, trim: true },
    khandaRate: { type: String, trim: true },
    khandaAmount: { type: String, trim: true },

    discountPercent: { type: String, trim: true },
    discountAmount: { type: String, trim: true },

    brokeragePerQuintal: { type: String, trim: true },
    brokerPayable: { type: String, trim: true },

    totalPayable: { type: String, trim: true },

    // Legacy mapping
    quantity: { type: String, trim: true },
    rate: { type: String, trim: true },
    amount: { type: String, trim: true },

    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

schema.plugin(aggregatePaginate);
export default mongoose.model('BrokensSales', schema);
