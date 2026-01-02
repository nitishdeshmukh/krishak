import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { createNumberGeneratorMiddleware } from '../../utils/numberGenerator.js';

const schema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    outwardNumber: { type: String, trim: true, unique: true },
    ricePurchaseNumber: { type: String, trim: true },

    partyName: { type: String, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },

    brokerName: { type: String, trim: true },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker' },

    lotNo: { type: String, trim: true },
    fciNan: { type: String, enum: ['fci', 'nan'] },
    riceType: { type: String, trim: true },
    dealQuantity: { type: String, trim: true },

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

    // Legacy mapping
    saleNumber: { type: String, trim: true },
    sackCount: { type: String, trim: true },
    weight: { type: String, trim: true },

    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Auto-generate outwardNumber: PRO-DDMMYY-N
schema.pre('save', createNumberGeneratorMiddleware('outwardNumber', 'PRO'));

schema.plugin(aggregatePaginate);
export default mongoose.model('PrivateRiceOutward', schema);
