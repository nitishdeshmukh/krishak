import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    nakkhiSaleNumber: { type: String, trim: true },

    partyName: { type: String, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },

    brokerName: { type: String, trim: true },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker' },

    gunnyPlastic: { type: String, trim: true },
    plasticWeight: { type: String, trim: true },

    truckNo: { type: String, trim: true },
    rstNo: { type: String, trim: true },

    truckWeight: { type: String, trim: true },
    gunnyWeight: { type: String, trim: true },
    finalWeight: { type: String, trim: true },

    // Legacy mapping
    saleNumber: { type: String, trim: true },
    plasticSackCount: { type: String, trim: true },

    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

schema.plugin(aggregatePaginate);
export default mongoose.model('BrewersOutward', schema);
