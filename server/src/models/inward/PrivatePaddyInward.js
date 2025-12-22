import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    paddyPurchaseNumber: { type: String, trim: true },

    partyName: { type: String, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },

    brokerName: { type: String, trim: true },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker' },

    balDo: { type: String, trim: true },
    purchaseType: { type: String, enum: ['do-purchase', 'other-purchase'] },

    doEntries: [{
        doNumber: { type: String, trim: true },
        samitiSangrahan: { type: String, trim: true }
    }],

    gunnyOption: { type: String, trim: true },
    gunnyNew: { type: String, trim: true },
    gunnyOld: { type: String, trim: true },
    gunnyPlastic: { type: String, trim: true },

    juteWeight: { type: String, trim: true },
    plasticWeight: { type: String, trim: true },
    gunnyWeight: { type: String, trim: true },
    truckLoadWeight: { type: String, trim: true },
    weight: { type: String, trim: true }, // Generic weight

    truckNo: { type: String, trim: true },
    rstNo: { type: String, trim: true },

    dhanType: { type: String, trim: true },
    paddyType: { type: String, trim: true }, // Alias or legacy
    dhanMota: { type: String, trim: true },
    dhanPatla: { type: String, trim: true },
    dhanSarna: { type: String, trim: true },
    dhanMaha: { type: String, trim: true },
    dhanRb: { type: String, trim: true },

    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

schema.plugin(aggregatePaginate);
export default mongoose.model('PrivatePaddyInward', schema);
