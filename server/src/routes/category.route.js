const categoryController = require("./../controllers/category.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/jwt");

const router = require("express").Router();

router.get("/", categoryController.getAllCategories);

router.use(verifyAccessToken, isAdmin);

router.get("/:id", categoryController.getCategoryById);
router.post("/", categoryController.createCategory);
router.delete("/:id", categoryController.deleteCategoryById);
router.put("/:id", categoryController.updateCategoryById);

module.exports = router;
