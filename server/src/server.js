const express = require("express");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", (req, res) => {
  res.send("Thanh cong roi");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
