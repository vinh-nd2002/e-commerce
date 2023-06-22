const { BlogCategory } = require("./../models");
const asyncHandler = require("express-async-handler");
const slugifyTitle = require("./../utils/slug");

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

  const blogCategory = await BlogCategory.findById({ _id: id }).select(
    "-createdAt -updatedAt -__v"
  );
  return res.status(200).json({
    success: blogCategory ? true : false,
    data: blogCategory ? blogCategory : "Can't found",
  });
});

const getAllBlogCategories = asyncHandler(async (req, res) => {
  const blogCategories = await BlogCategory.find().select(
    "-createdAt -updatedAt -__v"
  );

  return res.status(200).json({
    success: blogCategories ? true : false,
    data: blogCategories ? blogCategories : "Can't not found",
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
