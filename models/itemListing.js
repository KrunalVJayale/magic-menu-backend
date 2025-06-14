const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema(
  {
    name: { type: String, required: true },
    originalPrice: Number, // Original price before discount
    discountedPrice: { type: Number, required: true },
    description: { type: String, required: true },
    images: [
      {
        url: { type: String, required: true },
        filename: { type: String, required: true },
      },
    ],
    isVeg: { type: Boolean, required: true },
    inStock:{type:Boolean ,require:true,default:false},
    isRecommended:{type:Boolean ,default:false},
    category: { type: String, required: true },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    rating: { type: Number, default: 0 }, // This will store the average rating
    ratingsCount: { type: Number, default: 0 }, // This will store the number of ratings received
  },
  { timestamps: true } // This will automatically add createdAt and updatedAt fields
);

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
