const brandController = require("./../controllers/brand.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/jwt");

const router = require("express").Router();

router.get("/", brandController.getAllBrands);

router.use(verifyAccessToken, isAdmin);

router.get("/:id", brandController.getBrandById);
router.post("/", brandController.createBrand);
router.delete("/:id", brandController.deleteBrandById);
router.put("/:id", brandController.updateBrandById);

module.exports = router;
