const couponController = require("./../controllers/coupon.controller");
const { verifyAccessToken, isAdmin } = require("../middlewares/jwt");

const router = require("express").Router();

router.get("/", couponController.getAllCoupons);

router.use(verifyAccessToken, isAdmin);

router.get("/:id", couponController.getCouponById);
router.post("/", couponController.createCoupon);
router.delete("/:id", couponController.deleteCouponById);
router.put("/:id", couponController.updateCouponById);

module.exports = router;
