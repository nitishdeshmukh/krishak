import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { COMMITTEE_TYPE_VALUES } from "../utils/constants.js";

const committeeSchema = new mongoose.Schema(
  {
    committeeName: {
      type: String,
      required: [true, "Committee name is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: COMMITTEE_TYPE_VALUES,
      default: COMMITTEE_TYPE_VALUES[0],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

committeeSchema.index({ committeeName: "text" });
committeeSchema.plugin(aggregatePaginate);

export default mongoose.model("Committee", committeeSchema);
