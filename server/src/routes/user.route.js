const userController = require("../controllers/user.controller.");
const { verifyAccessToken, isAdmin } = require("../middlewares/jwt");

const router = require("express").Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/current", verifyAccessToken, userController.getCurrent);
router.post("/refresh-token", userController.refreshAccessToken);
router.get("/logout", verifyAccessToken, userController.logout);
router.get("/forgot-password", userController.forgotPassword);
router.put("/reset-password", userController.resetPassword);
router.get("/", [verifyAccessToken, isAdmin], userController.getAllUsers);
router.put("/current", [verifyAccessToken], userController.updateUser);
router.put("/:id", [verifyAccessToken, isAdmin], userController.updateUserByAmin);
router.delete(
  "/:id",
  [verifyAccessToken, isAdmin],
  userController.deleteUserById
);
module.exports = router;
