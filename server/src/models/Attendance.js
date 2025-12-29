import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        staff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Staff',
            required: true,
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Half Day', 'Holiday'],
            default: 'Present',
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index to prevent duplicate attendance for same staff on same day
attendanceSchema.index({ date: 1, staff: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
