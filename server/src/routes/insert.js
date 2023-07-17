const {
  insertProduct,
  insertCategoryAndBrand,
} = require("../controllers/initData");

const router = require("express").Router();

router.post("/insert-products", insertProduct);
router.post("/insert-categories", insertCategoryAndBrand);

module.exports = router;
