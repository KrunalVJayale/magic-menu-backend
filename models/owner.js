const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ownerSchema = new Schema(
  {
    name: { type: String, required: true },
    number: { type: String, required: true },
    hotel: { type: String, required: true },
    description: { type: String, required: true },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      address: { type: String, required: true },
    },
    logo: {
      url: String,
      filename: String,
    },
    images: [
      {
        url: { type: String },
        filename: { type: String },
      },
    ],
    isServing: { type: Boolean, required: true },
    chef: {
      name: { type: String, required: true },
      number: { type: Number },
    },
    categories: [{ type: String }],
    isBrand: { type: Boolean, default: false },
  },
  { timestamps: true } // This will automatically add createdAt and updatedAt fields
);

const Owner = mongoose.model("Owner", ownerSchema);
module.exports = Owner;
