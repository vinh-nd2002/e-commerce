const rootRouter = require("express").Router();
const userRoute = require("./user.route");
const productRoute = require("./product.route");

rootRouter.use("/users", userRoute);
rootRouter.use("/products", productRoute);

module.exports = rootRouter;
