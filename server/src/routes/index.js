const rootRouter = require("express").Router();
const userRoute = require("./user.route");

rootRouter.use("/users", userRoute);

module.exports = rootRouter;
