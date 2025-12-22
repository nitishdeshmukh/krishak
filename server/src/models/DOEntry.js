import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const doEntrySchema = new mongoose.Schema({
    doNumber: {
        type: String,
        required: [true, 'DO Number is required'],
        unique: true,
        trim: true,
    },
    committeeCenter: { type: String, required: [true, 'Committee/Storage Center is required'], trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
    date: { type: Date, default: Date.now },

    grainMota: { type: String, trim: true },
    grainPatla: { type: String, trim: true },
    grainSarna: { type: String, trim: true },
    total: { type: String, trim: true },

    // Legacy/Generic
    quantity: { type: String, trim: true },
    status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

doEntrySchema.index({ doNumber: 'text', committeeCenter: 'text' });
doEntrySchema.plugin(aggregatePaginate);

export default mongoose.model('DOEntry', doEntrySchema);
