const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const liveOrderSchema = new Schema(
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
      enum: ["Pending","Preparing", "Served", "Cancelled","Rejected"], // Example statuses
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
    requiredTime: { type: Number },
    orderedAt: { type: Date, default: Date.now },
    servedAt: { type: Date},
    arrivedAt: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true } // This will automatically add createdAt and updatedAt fields
);

const LiveOrder = mongoose.model("LiveOrder", liveOrderSchema);
module.exports = LiveOrder;
