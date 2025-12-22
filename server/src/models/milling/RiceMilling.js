import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    riceType: { type: String, trim: true },
    hopperGunny: { type: String, trim: true },
    hopperQtl: { type: String, trim: true },
    riceQty: { type: String, trim: true },
    ricePercent: { type: String, trim: true },
    khandaQty: { type: String, trim: true },
    khandaPercent: { type: String, trim: true },
    silkyKodhaQty: { type: String, trim: true },
    silkyKodhaPercent: { type: String, trim: true },
    wastagePercent: { type: String, trim: true },
    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

schema.plugin(aggregatePaginate);
export default mongoose.model('RiceMilling', schema);
