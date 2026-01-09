import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const doEntrySchema = new mongoose.Schema(
  {
    doNumber: {
      type: String,
      required: [true, "DO Number is required"],
      unique: true,
      trim: true,
    },
    committeeCenter: {
      type: String,
      required: [true, "Committee/Storage Center is required"],
      trim: true,
    },
    date: { type: Date, default: Date.now },
    paddyMota: { type: String, trim: true },
    paddyPatla: { type: String, trim: true },
    paddySarna: { type: String, trim: true },
    total: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

doEntrySchema.index({ doNumber: "text", committeeCenter: "text" });
doEntrySchema.plugin(aggregatePaginate);

export default mongoose.model("DOEntry", doEntrySchema);
