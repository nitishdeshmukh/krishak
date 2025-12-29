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

    bhusaQuantity: { type: String, trim: true },
    bhusaRate: { type: String, trim: true },
    bhusaAmount: { type: String, trim: true },

    brokeragePerTon: { type: String, trim: true },
    brokerPayable: { type: String, trim: true },

    totalPayable: { type: String, trim: true },

    // Legacy mapping
    quantity: { type: String, trim: true },
    rate: { type: String, trim: true },
    amount: { type: String, trim: true },

    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Auto-generate dealNumber: HS-DDMMYY-N (Husk Sales)
schema.pre('save', createNumberGeneratorMiddleware('dealNumber', 'HS'));

schema.plugin(aggregatePaginate);
export default mongoose.model('HuskSales', schema);
