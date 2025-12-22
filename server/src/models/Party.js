import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const partySchema = new mongoose.Schema({
    partyName: {
        type: String,
        required: [true, 'Party name is required'],
        trim: true,
    },
    phone: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, default: 'India', trim: true },
    gstn: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

partySchema.index({ partyName: 'text' });
partySchema.plugin(aggregatePaginate);

export default mongoose.model('Party', partySchema);
