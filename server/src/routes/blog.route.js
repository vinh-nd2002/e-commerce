const blogController = require("./../controllers/blog.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/jwt");
const uploader = require("./../configs/cloudinary.config");

const router = require("express").Router();

router.get("/", blogController.getAllBlogs);

router.get("/:id", blogController.getBlogById);

router.use(verifyAccessToken);

router.put("/like/:bid", blogController.likeBlog);
router.put("/dislike/:bid", blogController.dislikeBlog);

router.use(isAdmin);

router.post("/", blogController.createBlog);
router.delete("/:id", blogController.deleteBlogById);
router.put("/:id", blogController.updateBlogById);
router.put(
  "/upload-image/:id",
  uploader.single("image"),
  blogController.uploadBlogImage
);

module.exports = router;
