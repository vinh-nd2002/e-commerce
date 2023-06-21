const productController = require("./../controllers/product.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/jwt");

const router = require("express").Router();

router.get("/:id", productController.getProductById);
router.get("/", productController.getAllProducts);

router.use(verifyAccessToken, isAdmin);
router.post("/", productController.createProduct);
router.delete("/:id", productController.deleteProductById);
router.put("/:id", productController.updateProductById);
// router.get("/current", verifyAccessToken, userController.getCurrent);
// router.post("/refresh-token", userController.refreshAccessToken);
// router.get("/logout", verifyAccessToken, userController.logout);
// router.get("/forgot-password", userController.forgotPassword);
// router.put("/reset-password", userController.resetPassword);
// router.get("/", [verifyAccessToken, isAdmin], userController.getAllUsers);
// router.put("/current", [verifyAccessToken], userController.updateUser);
// router.delete(
//   "/:id",
//   [verifyAccessToken, isAdmin],
//   userController.deleteUserById
// );
module.exports = router;
