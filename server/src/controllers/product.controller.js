const { Product } = require("./../models");
const asyncHandler = require("express-async-handler");
const slugifyTitle = require("./../utils/slug");

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

  const { createdAt, updatedAt, __v, ...response } = newProduct.toObject();
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

  // fields attributes
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");

    queryCommand = queryCommand.select(fields);
  }

  // fields attributes
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");

    queryCommand = queryCommand.select(fields);
  }

  // Pagination
  const page = +req.query.page * 1 || 1;
  const limit = +req.query.limit * 1 || process.env.LIMIT_PRODUCTS;
  const skip = (page - 1) * limit;

  queryCommand = queryCommand.skip(skip).limit(limit);

  // execute query
  queryCommand
    .then(async (response) => {
      const totals = await Product.find(formattedQueries).countDocuments();

      return res.status(200).json({
        success: response ? true : false,
        totals: totals,
        perPage: limit,
        data: response ? response : "Can't not found",
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
  if (!id || Object.keys(req.body).length === 0)
    throw new Error("Missing input");

  if (req.body && req.body.title) req.body.slug = slugifyTitle(req.body.title);

  const productUpdated = await Product.findByIdAndUpdate(
    { _id: id },
    req.body,
    { new: true }
  ).select("-createdAt -updatedAt -__v");
  return res.status(200).json({
    success: productUpdated ? true : false,
    mes: productUpdated ? "Product update successful" : "Update product failed",
  });
});

const ratings = asyncHandler(async (req, res) => {
  const { uid } = req.user;
  const { star, comment, pid } = req.body;

  if (!star || !pid) throw new Error("Missing inputs");

  const ratingProduct = await Product.findById(pid);

  const alreadyRating = ratingProduct?.ratings?.find(
    (ele) => ele.postedBy.toString() === uid
  );

  if (alreadyRating) {
    // update star and comment
    await Product.updateOne(
      {
        ratings: {
          $elemMatch: alreadyRating,
        },
      },
      {
        $set: {
          "ratings.$.star": star,
          "ratings.$.comment": comment,
        },
      },
      { new: true }
    );
  } else {
    // add star anh comment
    await Product.findByIdAndUpdate(
      pid,
      {
        $push: {
          ratings: { star, comment, postedBy: uid },
        },
      },
      { new: true }
    );
  }

  // re-sum total ratings
  const updatedProduct = await Product.findById(pid);

  const ratingCounts = updatedProduct.ratings.length;
  const sumRatings = updatedProduct.ratings.reduce(
    (sum, element) => sum + +element.star,
    0
  );

  updatedProduct.totalRatings =
    Math.round((sumRatings * 10) / ratingCounts) / 10;

  await updatedProduct.save();

  return res.status(200).json({
    success: updatedProduct ? true : false,
    mes: updatedProduct ? "Successful product review" : "Product review failed",
  });
});

module.exports = {
  createProduct,
  getProductById,
  getAllProducts,
  deleteProductById,
  updateProductById,
  ratings,
};
