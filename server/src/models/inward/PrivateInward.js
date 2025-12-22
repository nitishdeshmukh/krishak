import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    partyName: { type: String, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
    riceType: { type: String, trim: true },
    sackCount: { type: String, trim: true },
    weight: { type: String, trim: true },
    truckNo: { type: String, trim: true },
    rstNo: { type: String, trim: true },
    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

schema.plugin(aggregatePaginate);
export default mongoose.model('PrivateInward', schema);
