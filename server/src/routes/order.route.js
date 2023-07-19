const orderController = require("./../controllers/order.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/jwt");

const router = require("express").Router();



router.use(verifyAccessToken);
router.post("/", orderController.createOrder);
router.get("/:id", orderController.getOrderById);
router.put("/:id/cancel", orderController.cancelOrder);
router.put("/:id/payment", orderController.paymentOrder);
router.get("/", orderController.getAllOrders);

router.use(isAdmin);
router.put("/:id", orderController.updateOrderById);
router.put("/:id/undo", orderController.undoOrderById);
router.delete("/:id", orderController.deleteOrderById);

module.exports = router;
