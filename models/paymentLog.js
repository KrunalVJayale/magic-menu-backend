const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentLogSchema = new Schema({
  transactionId: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["PENDING", "FAILURE", "SUCCESS"], // Example statuses
    required: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  amount: { type: Number, required: true },
  responsePayload: Object,
  createdAt: { type: Date, default: Date.now },
});

const PaymentLog = mongoose.model("PaymentLog", paymentLogSchema);
module.exports = PaymentLog;
