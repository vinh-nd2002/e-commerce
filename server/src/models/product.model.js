const mongoose = require("mongoose");
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      // unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Brand",
    },
    price: {
      type: Number,
      required: true,
    },
    categories: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],

    quantity: {
      type: Number,
      default: 0,
      min: [1, "Must be at least 1, got {VALUE}"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    color: [
      {
        type: String,
        required: true,
      },
    ],
    ratings: [
      {
        star: {
          type: Number,
          // validate: (value) => {
          //   if (value < 1 || value > 5) return false;
          //   return true;
          // },
          required: true,
        },
        postedBy: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
        comment: {
          type: String,
        },
      },
    ],
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
