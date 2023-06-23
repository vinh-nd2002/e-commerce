const rootRouter = require("express").Router();
const userRoute = require("./user.route");
const productRoute = require("./product.route");
const categoryRoute = require("./category.route");
const blogCategoryRoute = require("./blogCategory.route");
const blogRoute = require("./blog.route");
const brandRoute = require("./brand.route");
const couponRoute = require("./coupon.route");

rootRouter.use("/users", userRoute);
rootRouter.use("/products", productRoute);
rootRouter.use("/categories", categoryRoute);
rootRouter.use("/blog-categories", blogCategoryRoute);
rootRouter.use("/blogs", blogRoute);
rootRouter.use("/brands", brandRoute);
rootRouter.use("/coupons", couponRoute);

module.exports = rootRouter;
