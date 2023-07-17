const userController = require("../controllers/user.controller.");
const { verifyAccessToken, isAdmin } = require("../middlewares/jwt");

const router = require("express").Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/forgot-password", userController.forgotPassword);
router.put("/reset-password", userController.resetPassword);
router.post("/refresh-token", userController.refreshAccessToken);

router.use(verifyAccessToken);

router.get("/current", userController.getCurrent);
router.get("/logout", userController.logout);
router.put("/current", userController.updateUser);
router.put("/current-address", userController.updateUserAddress);

router.use(isAdmin);

router.get("/", userController.getAllUsers);
router.put("/:id", userController.updateUserByAdmin);
router.put("/:id/undo", userController.updateUserByAdmin);
router.delete("/:id", userController.deleteUserById);

module.exports = router;
