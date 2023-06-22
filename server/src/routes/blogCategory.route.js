const blogCategoryController = require("./../controllers/blogCategory.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/jwt");

const router = require("express").Router();

router.get("/", blogCategoryController.getAllBlogCategories);

router.get("/:id", blogCategoryController.getBlogCategoryById);

router.use(verifyAccessToken, isAdmin);

router.post("/", blogCategoryController.createBlogCategory);
router.delete("/:id", blogCategoryController.deleteBlogCategoryById);
router.put("/:id", blogCategoryController.updateBlogCategoryById);

module.exports = router;
