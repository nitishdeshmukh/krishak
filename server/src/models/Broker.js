import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const brokerSchema = new mongoose.Schema({
    brokerName: {
        type: String,
        required: [true, 'Broker name is required'],
        trim: true,
    },
    phone: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },

    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, default: 'India', trim: true },

    commission: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

brokerSchema.index({ brokerName: 'text' });
brokerSchema.plugin(aggregatePaginate);

export default mongoose.model('Broker', brokerSchema);
