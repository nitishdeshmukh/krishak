import mongoose from 'mongoose';

const truckSchema = new mongoose.Schema(
    {
        truckNumber: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Truck = mongoose.model('Truck', truckSchema);

export default Truck;
