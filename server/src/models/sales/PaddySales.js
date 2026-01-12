import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { createNumberGeneratorMiddleware } from "../../utils/numberGenerator.js";
import {
  DELIVERY_OPTION_VALUES,
  GUNNY_OPTION_VALUES,
  SALES_TYPE_VALUES,
} from "../../utils/constants.js";

const schema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    dealNumber: { type: String, trim: true, unique: true },
    partyName: { type: String, required: true, trim: true },
    party: { type: mongoose.Schema.Types.ObjectId, ref: "Party" },
    brokerName: { type: String, trim: true },
    broker: { type: mongoose.Schema.Types.ObjectId, ref: "Broker" },
    salesType: { type: String, enum: SALES_TYPE_VALUES },
    quantity: { type: String, trim: true },
    delivery: { type: String, enum: DELIVERY_OPTION_VALUES },
    doEntries: [
      {
        doNumber: { type: String, trim: true },
        dhanMota: { type: String, trim: true },
        dhanPatla: { type: String, trim: true },
        dhanSarna: { type: String, trim: true },
      },
    ],
    paddyType: { type: String, trim: true },
    paddyQuantity: { type: String, trim: true },
    paddyRate: { type: String, trim: true },
    batavPercent: { type: String, trim: true },
    brokerage: { type: String, trim: true },
    gunnyOption: {
      type: String,
      enum: GUNNY_OPTION_VALUES,
    },
    newGunnyRate: { type: String, trim: true },
    oldGunnyRate: { type: String, trim: true },
    plasticGunnyRate: { type: String, trim: true },
    rate: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate dealNumber: PS-DDMMYY-N (Paddy Sales)
schema.pre("save", createNumberGeneratorMiddleware("dealNumber", "PS"));

schema.plugin(aggregatePaginate);
export default mongoose.model("PaddySales", schema);
