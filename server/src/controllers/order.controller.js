const asyncHandler = require("express-async-handler");
const { Order, Product } = require("./../models");
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, phone, products } = req.body;
  if (!shippingAddress || !paymentMethod || !phone || products.length === 0) {
    throw new Error("Missing input");
  }

  req.body.buyer = req.user.uid;

  let totalPrice = products.reduce(
    (product, totalPrice) => totalPrice + product.product.price,
    0
  );

  let totalQuantity = products.reduce(
    (product, totalQuantity) => totalQuantity + product.totalProductQuantity,
    0
  );

  const order = await Order.create({
    ...req.body,
    totalPrice,
    totalQuantity,
  });

  for (const item of products) {
    const { id } = item.product;
    const { totalProductQuantity } = item;
    const product = await Product.findById(id);
    const sold = product.sold + totalProductQuantity;
    const quantity = product.quantity - totalProductQuantity;
    await Product.findByIdAndUpdate(id, { sold, quantity });
  }

  return res.status(200).json({
    success: order ? true : false,
    data: order ? order : "Can't create order",
  });
});

const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");
  const buyer = req.user;

  const response = await Order.findById(id);
  if (!response) throw new Error("Order not found");
  if (response.buyer._id !== buyer.uid)
    throw new Error("You can't cancel order");
  if (response.status === "Not Processed" || response.status === "Processing")
    response.status = "Cancelled";
  else
    throw new Error(
      "This order cannot be canceled, it has been shipped for delivery"
    );
  response = response.save();
  return res.status(200).json({
    success: response ? true : false,
    data: response ? response : "Can't cancel order",
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");
  const user = req.user;

  const response = await Order.findById(id);
  if (!response) throw new Error("Order not found");
  if (response.buyer._id !== user.uid || user.role !== "Admin")
    throw new Error("You do not have permission to view this order");
  return res.status(200).json({
    success: response ? true : false,
    data: response ? response : "Can't found order",
  });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");
  const user = req.user;

  const response = [];
  if (user.role === "Admin") {
    response = await Order.find();
  } else {
    response = await Order.find({ buyer: user.uid, isDelete: false });
  }
  return res.status(200).json({
    success: response ? true : false,
    data: response ? response : "Can't found order",
  });
});

const updateOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");
  const { status } = req.body;

  if (status === "Delivered") {
    req.body.deliveredAt = Date.now();
    req.body.isDelivered = true;
  }
  const response = await Order.findByIdAndUpdate(id, req.body, { new: true });

  return res.status(200).json({
    success: response ? true : false,
    data: response ? response : "Can't update order",
  });
});

const paymentOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");

  const response = await Order.findByIdAndUpdate(
    id,
    { paidAt: Date.now(), isPaid: true },
    { new: true }
  );

  return res.status(200).json({
    success: response ? true : false,
    data: response ? response : "Can't payment order",
  });
});

const deleteOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");

  const response = await Order.findByIdAndUpdate(
    id,
    { isDelete: true },
    { new: true }
  );

  return res.status(200).json({
    success: response ? true : false,
    data: response ? response : "Can't delete order",
  });
});

const undoOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new Error("Missing input");

  const response = await Order.findByIdAndUpdate(
    id,
    { isDelete: false },
    { new: true }
  );

  return res.status(200).json({
    success: response ? true : false,
    data: response ? response : "Can't undo order",
  });
});

module.exports = {
  createOrder,
  cancelOrder,
  getOrderById,
  getAllOrders,
  updateOrderById,
  paymentOrder,
  deleteOrderById,
  undoOrderById,
};
