const { Coupon } = require("./../models");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry) {
    throw new Error("Missing input");
  }

  const newCoupon = await Coupon.create({
    ...req.body,
    expiry: Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000,
  });

  const { createdAt, updatedAt, __v, ...response } = newCoupon.toObject();
  return res.status(200).json({
    success: newCoupon ? true : false,
    data: newCoupon ? response : "Can't create Coupon",
  });
});

const getCouponById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");

  const coupon = await Coupon.findById({ _id: id }).select(
    "-createdAt -updatedAt -__v"
  );
  return res.status(200).json({
    success: coupon ? true : false,
    data: coupon ? coupon : "Can't found",
  });
});

const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().select("-createdAt -updatedAt -__v");

  return res.status(200).json({
    success: coupons ? true : false,
    data: coupons ? coupons : "Can't  found",
  });
});

const deleteCouponById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");
  const response = await Coupon.findByIdAndDelete({ _id: id });
  return res.status(200).json({
    success: response ? true : false,
    mes: response
      ? "Coupon has been deleted successfully"
      : "Delete coupon failed",
  });
});

const updateCouponById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id || Object.keys(req.body).length === 0)
    throw new Error("Missing input");

  if (req.body.expiry) {
    req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
  }
  const couponUpdated = await Coupon.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
  }).select("-createdAt -updatedAt -__v");
  return res.status(200).json({
    success: couponUpdated ? true : false,
    mes: couponUpdated ? "Coupon update successful" : "Update coupon failed",
  });
});

module.exports = {
  createCoupon,
  getCouponById,
  getAllCoupons,
  deleteCouponById,
  updateCouponById,
};
