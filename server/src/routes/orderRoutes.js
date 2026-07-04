import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController.js";

import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);

// Customer
router.post("/", createOrder);
router.get("/my-orders", getMyOrders);

// Track/View single order
router.get("/:id", getOrderById);

// Cancel order
router.put("/:id/cancel", cancelOrder);

// Admin
router.get("/", authorizeRoles("admin"), getAllOrders);
router.put("/:id/status", authorizeRoles("admin"), updateOrderStatus);

export default router;