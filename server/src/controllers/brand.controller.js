const { Brand } = require("./../models");
const asyncHandler = require("express-async-handler");

const createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new Error("Missing input");
  }

  const newBrand = await Brand.create(req.body);

  const { createdAt, updatedAt, __v, ...response } = newBrand.toObject();
  return res.status(200).json({
    success: newBrand ? true : false,
    data: newBrand ? response : "Can't create brand",
  });
});

const getBrandById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");

  const brand = await Brand.findById({ _id: id }).select(
    "-createdAt -updatedAt -__v"
  );
  return res.status(200).json({
    success: brand ? true : false,
    data: brand ? brand : "Can't found",
  });
});

const getAllBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find().select("-createdAt -updatedAt -__v");

  return res.status(200).json({
    success: brands ? true : false,
    data: brands ? brands : "Can't  found",
  });
});

const deleteBrandById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");
  const response = await Brand.findByIdAndDelete({ _id: id });
  return res.status(200).json({
    success: response ? true : false,
    mes: response
      ? "Brand has been deleted successfully"
      : "Delete brand failed",
  });
});

const updateBrandById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id || !req.body?.name) throw new Error("Missing input");

  const brandUpdated = await Brand.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  }).select("-createdAt -updatedAt -__v");
  return res.status(200).json({
    success: brandUpdated ? true : false,
    mes: brandUpdated ? "Brand update successful" : "Update brand failed",
  });
});

module.exports = {
  createBrand,
  getBrandById,
  getAllBrands,
  deleteBrandById,
  updateBrandById,
};
