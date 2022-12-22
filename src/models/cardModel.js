const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const cardSchema = new mongoose.Schema(
  {
    cardNumber: { type: String, required: true, trim: true }, //  Auto_increment e.g: C001

    cardType: {
      type: String,
      required: true,
      trim: true,
      enum: ["REGULAR", "SPECIAL"],
    },

    customerName: { type: String, required: true, trim: true }, 

    status: {
      type: String,
      required: true,
      trim: true,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    }, // Default: ACTIVE

    vision: { type: String, required: true, trim: true },

    customerID: { type: ObjectId, ref: "Customer", required: true }, // Reference from customer table

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Card", cardSchema);
