const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const riderSchema = new Schema(
  {
    name: { type: String, required: true },
    number: { type: Number, required: true },
    vehical: {
      type: { type: String, required: true },
      brand: { type: String, required: true },
      rtoNumber: { type: Number, required: true },
    },
    legal: {
        passportPhoto: {
        url: { type: String, required: true },
        filename: { type: String, required: true },
      },
      adhar: { type: Number, required: true },
      license: { type: String, required: true },
    },
  },
  { timestamps: true } // This will automatically add createdAt and updatedAt fields
);

const Rider = mongoose.model("Rider", riderSchema);
module.exports = Rider;
