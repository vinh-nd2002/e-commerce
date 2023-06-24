const productController = require("./../controllers/product.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/jwt");

const uploader = require("./../configs/cloudinary.config");

const router = require("express").Router();

router.get("/:id", productController.getProductById);
router.get("/", productController.getAllProducts);

router.use(verifyAccessToken);

router.put("/ratings", productController.ratings);

router.use(isAdmin);

router.post("/", productController.createProduct);
router.delete("/:id", productController.deleteProductById);
router.put("/:id", productController.updateProductById);
router.put(
  "/upload-images/:id",
  uploader.array("images", process.env.LIMIT_IMAGES),
  productController.uploadProductImages
);

module.exports = router;
