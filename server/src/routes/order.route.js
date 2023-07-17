const orderController = require("./../controllers/order.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/jwt");

const router = require("express").Router();



router.use(verifyAccessToken);
router.post("/", orderController.createOrder);
// router.get("/:id", orderController.getOrderById);
// router.delete("/:id", orderController.deleteOrderById);

router.use(isAdmin);
// router.get("/", orderController.getAllOrders);
// router.put("/:id", orderController.updateOrderById);

module.exports = router;
