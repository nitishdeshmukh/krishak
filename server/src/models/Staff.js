import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        post: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        salary: {
            type: Number,
            default: 0,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        address: {
            type: String,
            trim: true,
        },
        previousStaffId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Staff = mongoose.model('Staff', staffSchema);

export default Staff;
