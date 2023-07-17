// Import the BlogCategory model
const refValidator = require("../utils/checkExistsModel");
const BlogCategory = require("./blogCategory.model");

const mongoose = require("mongoose");
var blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "BlogCategory",
      required: true,
      validate: {
        validator: (value) => refValidator(BlogCategory, value),
        message: "Category does not exist",
      },
    },
    numberViews: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    image: {
      type: String,
      default:
        "https://img.freepik.com/premium-photo/how-start-blog-blogging-beginners-ways-monetize-your-blog-blog-word-table-with-laptop_72482-5630.jpg",
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

module.exports = mongoose.model("Blog", blogSchema);
