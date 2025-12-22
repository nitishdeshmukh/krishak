import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    partyName: { type: String, required: true, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
    brokerName: { type: String, trim: true },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker' },

    salesType: { type: String, enum: ['do-sales', 'other-sales'] },

    // Note: Quantity seems missing in form schema or name differently, checking form...
    // Assuming generic quantity/rate for now based on other forms, but specific fields below:
    rate: { type: String, trim: true },
    wastagePercent: { type: String, trim: true },
    brokerage: { type: String, trim: true },
    packaging: { type: String, enum: ['with-packaging', 'return-packaging'] },

    // Legacy mapping
    paddyType: { type: String, trim: true },
    quantity: { type: String, trim: true },
    amount: { type: String, trim: true },

    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

schema.plugin(aggregatePaginate);
export default mongoose.model('PaddySales', schema);
