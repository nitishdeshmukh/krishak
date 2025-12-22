import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    sackSaleNumber: { type: String, trim: true },

    partyName: { type: String, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },

    newGunnyQty: { type: String, trim: true },
    oldGunnyQty: { type: String, trim: true },
    plasticGunnyQty: { type: String, trim: true },

    truckNo: { type: String, trim: true },

    // Legacy mapping
    saleNumber: { type: String, trim: true },
    newSackCount: { type: String, trim: true },
    oldSackCount: { type: String, trim: true },

    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

schema.plugin(aggregatePaginate);
export default mongoose.model('PrivateSackOutward', schema);
