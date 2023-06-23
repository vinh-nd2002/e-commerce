const { BlogCategory } = require("./../models");
const asyncHandler = require("express-async-handler");
const slugifyTitle = require("./../utils/slug");
const mongoose = require("mongoose");

const createBlogCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    throw new Error("Missing input");
  }

  req.body.slug = slugifyTitle(title);

  const newBlogCategory = await BlogCategory.create(req.body);

  const { createdAt, updatedAt, __v, ...response } = newBlogCategory.toObject();
  return res.status(200).json({
    success: newBlogCategory ? true : false,
    data: newBlogCategory ? response : "Can't create BlogCategory",
  });
});

const getBlogCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");

  // const blogCategory = await BlogCategory.findById(id).select(
  //   "-createdAt -updatedAt -__v"
  // );

  // return res.status(200).json({
  //   success: blogCategory ? true : false,
  //   data: blogCategory ? blogCategory : "Can't found",
  // });

  await BlogCategory.aggregate([
    {
      $match: {
        _id: new mongoose.mongo.ObjectId(id), // lọc theo id của category
      },
    },
    {
      $lookup: {
        from: "blogs", // tên collection trong mongo muốn join sang
        localField: "_id", // trường khóa chính trong model BlogCategory
        foreignField: "category", // foreignKey trong model Blogs
        as: "blogs", // tên trường để lưu kết quả kết hợp
      },
    },
    {
      $project: {
        __v: 0,
        "blogs.category": 0,
        "blogs.__v": 0,
        "blogs.slug": 0,
        "blogs.likes": 0,
        "blogs.dislikes": 0,
      },
    },
  ])
    .then((category) => {
      return res.status(200).json({
        success: category ? true : false,
        data: category ? category : "Can't found",
      });
    })
    .catch((err) => {
      throw new Error(err.message);
    });
});

const getAllBlogCategories = asyncHandler(async (req, res) => {
  const blogCategories = await BlogCategory.find().select(
    "-createdAt -updatedAt -__v"
  );

  return res.status(200).json({
    success: blogCategories ? true : false,
    data: blogCategories ? blogCategories : "Can't found",
  });
});

const deleteBlogCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");
  const response = await BlogCategory.findByIdAndDelete({ _id: id });
  return res.status(200).json({
    success: response ? true : false,
    mes: response
      ? "BlogCategory has been deleted successfully"
      : "Delete blogCategory failed",
  });
});

const updateBlogCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id || !req.body?.title) throw new Error("Missing input");

  req.body.slug = slugifyTitle(req.body.title);

  const BlogCategoryUpdated = await BlogCategory.findByIdAndUpdate(
    { _id: id },
    req.body,
    { new: true }
  ).select("-createdAt -updatedAt -__v");
  return res.status(200).json({
    success: BlogCategoryUpdated ? true : false,
    mes: BlogCategoryUpdated
      ? "BlogCategory update successful"
      : "Update blogCategory failed",
  });
});

module.exports = {
  createBlogCategory,
  getBlogCategoryById,
  getAllBlogCategories,
  deleteBlogCategoryById,
  updateBlogCategoryById,
};
