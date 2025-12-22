import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const transporterSchema = new mongoose.Schema({
    transporterName: {
        type: String,
        required: [true, 'Transporter name is required'],
        trim: true,
    },
    phone: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    gstn: { type: String, trim: true },

    // Address fields
    address: { type: String, trim: true }, // addressLine1 + addressLine2
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, default: 'India', trim: true },

    vehicleNumber: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

transporterSchema.index({ transporterName: 'text' });
transporterSchema.plugin(aggregatePaginate);

export default mongoose.model('Transporter', transporterSchema);
