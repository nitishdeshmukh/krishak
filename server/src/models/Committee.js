import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const committeeSchema = new mongoose.Schema({
    committeeName: {
        type: String,
        required: [true, 'Committee name is required'],
        trim: true,
    },
    type: {
        type: String,
        enum: ['committee-production', 'storage'],
        default: 'committee-production'
    },
    code: { type: String, trim: true },
    address: { type: String, trim: true },
    district: { type: String, trim: true },
    state: { type: String, trim: true },
    contactPerson: { type: String, trim: true },
    phone: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

committeeSchema.index({ committeeName: 'text' });
committeeSchema.plugin(aggregatePaginate);

export default mongoose.model('Committee', committeeSchema);
