const express = require("express");
const dbConnect = require("./configs/dbConnect");
const rootRouter = require("./routes");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
app.use(cookieParser());
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConnect();

app.use("/api/v1", rootRouter);
app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Máy chủ đang chạy trên cổng: ${port}`);
});
