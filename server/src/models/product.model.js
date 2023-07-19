const mongoose = require("mongoose");
// const Brand = require("./brand.model");
// const Category = require("./category.model");

// // Define a validator function for the categories array
// var categoriesValidator = async function (value) {
//   // Loop through each element in the array
//   for (let category of value) {
//     // Check if the category exists in the database using refValidator
//     var isValid = await refValidator(Category, category);
//     // If not valid, return false
//     if (!isValid) return false;
//   }
//   // If all elements are valid, return true
//   return true;
// };

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
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    thumb: {
      type: String,
      required: true,
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
      required: true,
      // validate: {
      //   validator: (value) => refValidator(Brand, value),
      //   message: "Brand does not exist",
      // },
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
        // validate: {
        //   validator: categoriesValidator,
        //   message: "Category does not exist",
        // },
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
    // color: [
    //   {
    //     type: String,
    //     required: true,
    //   },
    // ],
    ratings: [
      {
        star: {
          type: Number,
          min: [1, "Rating must be above 1.0"],
          max: [5, "Rating must be below 5.0"],
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
    isDelete: {
      type: Boolean,
      default: false,
    },
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
