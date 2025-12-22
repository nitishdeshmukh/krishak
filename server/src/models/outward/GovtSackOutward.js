import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    gunnyDmNo: { type: String, trim: true }, // Form uses gunnyDmNo
    samitiSangrahan: { type: String, trim: true }, // Form uses samitiSangrahan

    oldGunnyQty: { type: String, trim: true },
    plasticGunnyQty: { type: String, trim: true },

    truckNo: { type: String, trim: true },

    // Legacy mapping
    dmNumber: { type: String, trim: true },
    committeeName: { type: String, trim: true },
    committee: { type: mongoose.Schema.Types.ObjectId, ref: 'Committee' },
    newSackCount: { type: String, trim: true },
    oldSackCount: { type: String, trim: true },

    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

schema.plugin(aggregatePaginate);
export default mongoose.model('GovtSackOutward', schema);
