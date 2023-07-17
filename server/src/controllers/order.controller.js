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

module.export = {
  createOrder,
};
