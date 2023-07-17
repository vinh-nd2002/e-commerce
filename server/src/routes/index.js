const rootRouter = require("express").Router();
const userRoute = require("./user.route");
const productRoute = require("./product.route");
const categoryRoute = require("./category.route");
const blogCategoryRoute = require("./blogCategory.route");
const blogRoute = require("./blog.route");
const brandRoute = require("./brand.route");
const insertRoute = require("./insert");

rootRouter.use("/", insertRoute);
rootRouter.use("/users", userRoute);
rootRouter.use("/products", productRoute);
rootRouter.use("/categories", categoryRoute);
rootRouter.use("/blog-categories", blogCategoryRoute);
rootRouter.use("/blogs", blogRoute);
rootRouter.use("/brands", brandRoute);

module.exports = rootRouter;
