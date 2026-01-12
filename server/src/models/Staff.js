import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    employeeCode: {
      type: String,
      unique: true,
    },
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
      ref: "Staff",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

staffSchema.pre("save", async function () {
  if (this.employeeCode) return;

  try {
    // Find last staff with a code starting with EMP
    const lastStaff = await this.constructor
      .findOne({
        employeeCode: { $regex: /^EMP\d+$/ },
      })
      .sort({ employeeCode: -1 });

    let nextNum = 1;
    if (lastStaff && lastStaff.employeeCode) {
      const lastNum = parseInt(lastStaff.employeeCode.replace("EMP", ""), 10);
      if (!isNaN(lastNum)) nextNum = lastNum + 1;
    }

    this.employeeCode = `EMP${String(nextNum).padStart(4, "0")}`;
  } catch (error) {
    throw new Error(error);
  }
});

const Staff = mongoose.model("Staff", staffSchema);

export default Staff;
