import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    ricePurchaseNumber: { type: String, trim: true },

    partyName: { type: String, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },

    brokerName: { type: String, trim: true },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker' },

    riceType: { type: String, trim: true },
    riceMota: { type: String, trim: true },
    ricePatla: { type: String, trim: true },

    awakBalance: { type: String, trim: true },

    lotType: { type: String, enum: ['lot-purchase', 'rice-purchase'] },
    lotNo: { type: String, trim: true },

    frkNon: { type: String, enum: ['frk', 'non-frk'] },

    gunnyOption: { type: String, trim: true },
    gunnyNew: { type: String, trim: true },
    gunnyOld: { type: String, trim: true },
    gunnyPlastic: { type: String, trim: true },

    juteWeight: { type: String, trim: true },
    plasticWeight: { type: String, trim: true },
    gunnyWeight: { type: String, trim: true },
    truckLoadWeight: { type: String, trim: true },
    weight: { type: String, trim: true }, // Generic

    truckNo: { type: String, trim: true },
    rstNo: { type: String, trim: true },

    // Legacy mapping or specific use case
    doNumber: { type: String, trim: true },
    doEntry: { type: mongoose.Schema.Types.ObjectId, ref: 'DOEntry' },

    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

schema.plugin(aggregatePaginate);
export default mongoose.model('RiceInward', schema);
