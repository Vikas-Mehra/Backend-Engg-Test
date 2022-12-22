const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },

    lastName: { type: String, required: true, trim: true },

    mobileNumber: { type: String, required: true, unique: true },

    DOB: { type: Date, required: true },

    emailID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    address: { type: String, required: true, trim: true },

    customerID: { type: String, required: true, trim: true },

    status: {
      type: String,
      required: true,
      trim: true,
      enum: ["ACTIVE", "INACTIVE"],
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
