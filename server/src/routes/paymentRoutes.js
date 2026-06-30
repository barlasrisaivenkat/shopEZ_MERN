import express from "express";
import {
  getPaymentMethods,
  createPayment,
  markCODAsCollected,
  getPaymentByOrder,
  getAllPayments,
} from "../controllers/paymentController.js";
import  protect  from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public — fetch all payment options to display on checkout page
router.get("/methods", getPaymentMethods);

// User
router.post("/", protect, createPayment);
router.get("/order/:orderId", protect, getPaymentByOrder);

// Admin
router.put("/cod/:orderId/collect", protect, authorizeRoles("admin"), markCODAsCollected);
router.get("/", protect, authorizeRoles("admin"), getAllPayments);

export default router;