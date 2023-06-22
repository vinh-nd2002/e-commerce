const rootRouter = require("express").Router();
const userRoute = require("./user.route");
const productRoute = require("./product.route");
const categoryRoute = require("./category.route");
const blogCategoryRoute = require("./blogCategory.route");

rootRouter.use("/users", userRoute);
rootRouter.use("/products", productRoute);
rootRouter.use("/categories", categoryRoute);
rootRouter.use("/blog-categories", blogCategoryRoute);

module.exports = rootRouter;
