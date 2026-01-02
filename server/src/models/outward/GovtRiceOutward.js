import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { createNumberGeneratorMiddleware } from '../../utils/numberGenerator.js';

const schema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    outwardNumber: { type: String, trim: true, unique: true },
    lotNo: { type: String, trim: true },
    fciNan: { type: String, enum: ['fci', 'nan'] },

    riceType: { type: String, trim: true },

    gunnyNew: { type: String, trim: true },
    gunnyOld: { type: String, trim: true },

    juteWeight: { type: String, trim: true },

    truckNo: { type: String, trim: true },
    rstNo: { type: String, trim: true },

    truckWeight: { type: String, trim: true },
    gunnyWeight: { type: String, trim: true },
    finalWeight: { type: String, trim: true },

    // Legacy / Generic
    doNumber: { type: String, trim: true },
    doEntry: { type: mongoose.Schema.Types.ObjectId, ref: 'DOEntry' },
    committeeName: { type: String, trim: true },
    committee: { type: mongoose.Schema.Types.ObjectId, ref: 'Committee' },
    sackCount: { type: String, trim: true },
    weight: { type: String, trim: true },

    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Auto-generate outwardNumber: GRO-DDMMYY-N
schema.pre('save', createNumberGeneratorMiddleware('outwardNumber', 'GRO'));

schema.plugin(aggregatePaginate);
export default mongoose.model('GovtRiceOutward', schema);
