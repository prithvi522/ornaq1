import express from "express";
import rateLimit from "express-rate-limit";
import { body } from "express-validator";
import { adminLogin } from "../controllers/authController.js";
import { deleteCoupon, listCoupons, saveCoupon } from "../controllers/couponController.js";
import { downloadSalesRegister, getDashboardStats } from "../controllers/adminController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === "production" ? 50 : 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many login attempts, please try again later",
  skip: () => process.env.NODE_ENV !== "production"
});

router.post(
  "/login",
  adminLoginLimiter,
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  validateRequest,
  adminLogin
);

router.get("/dashboard", protect, authorize("admin"), getDashboardStats);
router.get("/coupons", protect, authorize("admin"), listCoupons);
router.post("/coupons", protect, authorize("admin"), saveCoupon);
router.put("/coupons/:id", protect, authorize("admin"), saveCoupon);
router.delete("/coupons/:id", protect, authorize("admin"), deleteCoupon);
router.get("/sales-register/download", protect, authorize("admin"), downloadSalesRegister);

export default router;
