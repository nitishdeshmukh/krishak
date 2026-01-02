import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { createNumberGeneratorMiddleware } from '../../utils/numberGenerator.js';

const schema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    inwardNumber: { type: String, trim: true, unique: true },
    otherPurchaseNumber: { type: String, trim: true },

    itemName: { type: String, trim: true },
    quantity: { type: String, trim: true },
    quantityType: { type: String, trim: true },

    partyName: { type: String, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },

    brokerName: { type: String, trim: true },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker' },

    gunnyNew: { type: String, trim: true },
    gunnyOld: { type: String, trim: true },
    gunnyPlastic: { type: String, trim: true },

    juteWeight: { type: String, trim: true },
    plasticWeight: { type: String, trim: true },

    truckNo: { type: String, trim: true },
    rstNo: { type: String, trim: true },

    truckWeight: { type: String, trim: true },
    gunnyWeight: { type: String, trim: true },
    finalWeight: { type: String, trim: true },

    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Auto-generate inwardNumber: OI-DDMMYY-N
schema.pre('save', createNumberGeneratorMiddleware('inwardNumber', 'OI'));

schema.plugin(aggregatePaginate);
export default mongoose.model('OtherInward', schema);
