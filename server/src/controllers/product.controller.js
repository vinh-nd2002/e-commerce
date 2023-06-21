const { Product } = require("./../models");
const asyncHandler = require("express-async-handler");
const slugifyTitle = require("./../utils/slug");
const { query, response } = require("express");

const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, brand, quantity, images } = req.body;
  if (
    !title ||
    !description ||
    !price ||
    // !category ||
    !brand ||
    !quantity ||
    !images
  ) {
    throw new Error("Missing input");
  }

  req.body.slug = slugifyTitle(title);

  const newProduct = await Product.create(req.body);

  const { createdAt, updateAt, __v, ...response } = newProduct.toObject();
  return res.status(200).json({
    success: newProduct ? true : false,
    data: newProduct ? response : "Can't create product",
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");

  const product = await Product.findById({ _id: id }).select(
    "-createdAt -updatedAt -__v"
  );
  return res.status(200).json({
    success: product ? true : false,
    data: product ? product : "Can't found",
  });
});

// filtering, pagination, sorting
const getAllProducts = asyncHandler(async (req, res) => {
  // copy ra thành 2 queries riêng biệt
  const queries = { ...req.query };

  // tách các trường đặc biệt ra khỏi queries
  const excludeFields = ["limit", "sort", "page", "fields"];

  excludeFields.forEach((element) => delete queries[element]);

  // format lại operators sang cú pháp của mongo
  let queryString = JSON.stringify(queries);

  queryString = queryString.replace(
    /\b(gte|gt|lt|lte|in)\b/g,
    (matchedEle) => `$${matchedEle}`
  );

  const formattedQueries = JSON.parse(queryString);

  // filtering

  if (queries?.title) {
    formattedQueries.title = { $regex: queries.title, $options: "i" };
  }

  let queryCommand = Product.find(formattedQueries).select(
    "-createdAt -updatedAt -__v"
  );
  // sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");

    queryCommand = queryCommand.sort(sortBy);
  }

  // execute query
  queryCommand
    .then(async (response) => {
      const counts = await Product.find(formattedQueries).countDocuments;

      return res.status(200).json({
        success: response ? true : false,
        data: response ? response : "Can't not found",
        counts: counts,
      });
    })
    .catch((err) => {
      throw new Error(err.message);
    });
});

const deleteProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");
  const response = await Product.findByIdAndDelete({ _id: id });
  return res.status(200).json({
    success: response ? true : false,
    mes: response
      ? "Product has been deleted successfully"
      : "Delete product failed",
  });
});

const updateProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id || Object.keys(req.body) === 0) throw new Error("Missing input");

  if (req.body && req.body.title) req.body.slug = slugifyTitle(req.body.title);

  const productUpdated = await Product.findByIdAndUpdate(
    { _id: id },
    req.body,
    { new: true }
  ).select("-createdAt -updatedAt -__v");
  return res.status(200).json({
    success: productUpdated ? true : false,
    data: productUpdated ? productUpdated : "Update product failed",
  });
});

module.exports = {
  createProduct,
  getProductById,
  getAllProducts,
  deleteProductById,
  updateProductById,
};
