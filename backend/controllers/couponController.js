import { StatusCodes } from "http-status-codes";
import Coupon from "../models/Coupon.js";

export const calculateCoupon = (coupon, subtotal) => {
  const now = new Date();
  if (!coupon || !coupon.active) throw new Error("This coupon is invalid or inactive.");
  if (coupon.startsAt && now < coupon.startsAt) throw new Error("This coupon is not active yet.");
  if (coupon.expiresAt && now > coupon.expiresAt) throw new Error("This coupon has expired.");
  if (coupon.usageLimit > 0 && coupon.usageCount >= coupon.usageLimit) throw new Error("This coupon has reached its usage limit.");
  if (subtotal < coupon.minOrderAmount) throw new Error(`This coupon requires a minimum order of ₹${coupon.minOrderAmount}.`);
  const raw = coupon.discountType === "FLAT" ? coupon.value : subtotal * coupon.value / 100;
  const capped = coupon.discountType === "PERCENT" && coupon.maxDiscountAmount > 0 ? Math.min(raw, coupon.maxDiscountAmount) : raw;
  const discountAmount = Math.min(subtotal, Math.max(0, Math.round(capped * 100) / 100));
  return { code: coupon.code, discountAmount };
};

export const validateCoupon = async (req, res) => {
  const code = String(req.body.code || "").trim().toUpperCase();
  const subtotal = Number(req.body.subtotal);
  if (!code || !Number.isFinite(subtotal) || subtotal < 0) return res.status(StatusCodes.BAD_REQUEST).json({ message: "Enter a coupon code and a valid order subtotal." });
  try {
    const coupon = await Coupon.findOne({ code });
    return res.json(calculateCoupon(coupon, subtotal));
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const listCoupons = async (_req, res) => res.json(await Coupon.find().sort("-createdAt").lean());

export const saveCoupon = async (req, res) => {
  const data = { ...req.body, code: String(req.body.code || "").trim().toUpperCase() };
  if (!data.code || !Number.isFinite(Number(data.value)) || Number(data.value) <= 0 || !["PERCENT", "FLAT"].includes(data.discountType)) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Enter a code, a positive discount value, and a valid discount type." });
  }
  if (data.discountType === "PERCENT" && Number(data.value) > 100) return res.status(StatusCodes.BAD_REQUEST).json({ message: "Percentage discount cannot exceed 100%." });
  try {
    const coupon = req.params.id
      ? await Coupon.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
      : await Coupon.create(data);
    if (!coupon) return res.status(StatusCodes.NOT_FOUND).json({ message: "Coupon not found." });
    return res.status(req.params.id ? StatusCodes.OK : StatusCodes.CREATED).json(coupon);
  } catch (error) {
    return res.status(error.code === 11000 ? StatusCodes.CONFLICT : StatusCodes.BAD_REQUEST).json({ message: error.code === 11000 ? "That coupon code already exists." : error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) return res.status(StatusCodes.NOT_FOUND).json({ message: "Coupon not found." });
  return res.status(StatusCodes.NO_CONTENT).send();
};
