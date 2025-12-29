import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { createNumberGeneratorMiddleware } from '../../utils/numberGenerator.js';

const schema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    dealNumber: { type: String, trim: true, unique: true },
    partyName: { type: String, required: true, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
    brokerName: { type: String, trim: true },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker' },

    itemName: { type: String, trim: true },
    quantity: { type: String, trim: true },
    quantityType: { type: String, trim: true },
    rate: { type: String, trim: true },
    amount: { type: String, trim: true },

    gstPercent: { type: String, trim: true },
    gstAmount: { type: String, trim: true },
    totalAmountWithGst: { type: String, trim: true },

    discountPercent: { type: String, trim: true },
    discountAmount: { type: String, trim: true },

    brokeragePerUnit: { type: String, trim: true },
    brokerPayable: { type: String, trim: true },

    totalPayable: { type: String, trim: true },

    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Auto-generate dealNumber: OS-DDMMYY-N (Other Sales)
schema.pre('save', createNumberGeneratorMiddleware('dealNumber', 'OS'));

schema.plugin(aggregatePaginate);
export default mongoose.model('OtherSales', schema);
