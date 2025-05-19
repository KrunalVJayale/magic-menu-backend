const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pastOrderSchema = new Schema(
  {
    item: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    quantity: { type: Number, required: true },
    ticket: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Preparing", "Served", "Delivered", "Cancelled"], // Example statuses
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    remarks: String,
    hotel: {
      type: Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    servedAt: { type: Date, default: Date.now },
    arrivedAt: { type: Date, default: Date.now },
    deliveredAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // This will automatically add createdAt and updatedAt fields
);

const PastOrder = mongoose.model("PastOrder", pastOrderSchema);
module.exports = PastOrder;
