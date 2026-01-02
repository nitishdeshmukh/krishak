import mongoose from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const financialTransactionSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    transactionType: {
        type: String,
        enum: ['RECEIPT', 'PAYMENT'],
        required: true
    },

    // --- Common Lookup Links ---
    party: { type: mongoose.Schema.Types.ObjectId, ref: 'Party' },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: 'Broker' },
    transporter: { type: mongoose.Schema.Types.ObjectId, ref: 'Transporter' },
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff' },

    // --- Payment / Receipt Detail ---
    paymentCategory: {
        type: String,
        enum: ['DEAL', 'TRANSPORT', 'HAMALI', 'SALARY', 'OTHER', 'RECEIPT_DEAL'],
        // RECEIPT_DEAL is for the Receiving side (Sale Deal)
        default: 'OTHER'
    },

    // --- Deal Details (For Receipt & Deal Payment) ---
    dealType: { type: String, trim: true }, // e.g., 'Paddy Purchase', 'Rice Sale'
    dealId: { type: mongoose.Schema.Types.ObjectId }, // Generic reference to the deal

    // --- Transport Payment Details ---
    transportMode: { type: String, enum: ['SELF', 'TRANSPORTER'] },
    truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' }, // For Self
    dieselAmount: { type: Number },
    allowanceAmount: { type: Number }, // Bhatta
    repairAmount: { type: Number },

    // --- Hamali Payment Details ---
    hamaliType: { type: String, enum: ['INWARD', 'OUTWARD', 'MILLING', 'OTHER'] },
    laborTeam: { type: mongoose.Schema.Types.ObjectId }, // Ref to labor team (if exists)

    // --- Salary Payment Details ---
    salaryDetails: {
        month: { type: String }, // e.g., "January 2024" or just "January"
        basicSalary: { type: Number },
        attendance: { type: Number }, // Days present
        allowedLeave: { type: Number },
        payableSalary: { type: Number },
        advanceAmount: { type: Number }
    },

    // --- Financials ---
    amount: {
        type: Number,
        required: true
    },
    paymentMode: {
        type: String,
        enum: ['CASH', 'BANK', 'CHEQUE', 'ONLINE', 'OTHER'],
        default: 'CASH'
    },

    // --- Meta ---
    remarks: { type: String, trim: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

financialTransactionSchema.plugin(aggregatePaginate);

export default mongoose.model('FinancialTransaction', financialTransactionSchema);
