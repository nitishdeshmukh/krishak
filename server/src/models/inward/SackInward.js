import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { createNumberGeneratorMiddleware } from '../../utils/numberGenerator.js';

const schema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    inwardNumber: { type: String, trim: true, unique: true },
    sackPurchaseNumber: { type: String, trim: true },

    partyName: { type: String, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },

    gunnyNew: { type: String, trim: true },
    gunnyOld: { type: String, trim: true },
    gunnyPlastic: { type: String, trim: true },
    gunnyBundle: { type: String, trim: true },

    // Removing old sackType/Count if no longer used, or keeping aliased?
    // Form doesn't use sackType/Count directly

    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Auto-generate inwardNumber: SI-DDMMYY-N
schema.pre('save', createNumberGeneratorMiddleware('inwardNumber', 'SI'));

schema.plugin(aggregatePaginate);
export default mongoose.model('SackInward', schema);
