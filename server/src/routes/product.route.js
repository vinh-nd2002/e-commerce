const productController = require("./../controllers/product.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/jwt");

const router = require("express").Router();

router.get("/:id", productController.getProductById);
router.get("/", productController.getAllProducts);

router.use(verifyAccessToken);

router.put("/ratings", productController.ratings);

router.use(isAdmin);

router.post("/", productController.createProduct);
router.delete("/:id", productController.deleteProductById);
router.put("/:id", productController.updateProductById);

module.exports = router;
