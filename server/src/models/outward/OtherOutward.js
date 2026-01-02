import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { createNumberGeneratorMiddleware } from '../../utils/numberGenerator.js';

const schema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    outwardNumber: { type: String, trim: true, unique: true },
    otherSaleNumber: { type: String, trim: true },

    partyName: { type: String, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },

    brokerName: { type: String, trim: true },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker' },

    itemName: { type: String, trim: true },
    quantity: { type: String, trim: true },
    quantityType: { type: String, trim: true },

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
    newSackCount: { type: String, trim: true },
    oldSackCount: { type: String, trim: true },
    plasticSackCount: { type: String, trim: true },

    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Auto-generate outwardNumber: OO-DDMMYY-N
schema.pre('save', createNumberGeneratorMiddleware('outwardNumber', 'OO'));

schema.plugin(aggregatePaginate);
export default mongoose.model('OtherOutward', schema);
