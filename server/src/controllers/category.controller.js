const { Category } = require("./../models");
const asyncHandler = require("express-async-handler");
const slugifyTitle = require("./../utils/slug");

const createCategory = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    throw new Error("Missing input");
  }

  req.body.slug = slugifyTitle(title);

  const newCategory = await Category.create(req.body);

  const { createdAt, updatedAt, __v, ...response } = newCategory.toObject();
  return res.status(200).json({
    success: newCategory ? true : false,
    data: newCategory ? response : "Can't create category",
  });
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");

  const category = await Category.findById({ _id: id }).select(
    "-createdAt -updatedAt -__v"
  );
  return res.status(200).json({
    success: category ? true : false,
    data: category ? category : "Can't found",
  });
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().select("-createdAt -updatedAt -__v");

  return res.status(200).json({
    success: categories ? true : false,
    data: categories ? categories : "Can't  found",
  });
});

const deleteCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");
  const response = await Category.findByIdAndDelete({ _id: id });
  return res.status(200).json({
    success: response ? true : false,
    mes: response
      ? "Category has been deleted successfully"
      : "Delete category failed",
  });
});

const updateCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id || !req.body?.title) throw new Error("Missing input");

  req.body.slug = slugifyTitle(req.body.title);

  const categoryUpdated = await Category.findByIdAndUpdate(
    { _id: id },
    req.body,
    { new: true }
  ).select("-createdAt -updatedAt -__v");
  return res.status(200).json({
    success: categoryUpdated ? true : false,
    mes: categoryUpdated
      ? "Category update successful"
      : "Update category failed",
  });
});

module.exports = {
  createCategory,
  getCategoryById,
  getAllCategories,
  deleteCategoryById,
  updateCategoryById,
};
