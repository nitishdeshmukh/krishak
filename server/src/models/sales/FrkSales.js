import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
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

schema.plugin(aggregatePaginate);
export default mongoose.model('FrkSales', schema);
