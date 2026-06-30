import express from "express";
import {
  register, login, getProfile,
  updateProfile, changePassword,
  getAllUsers, deleteUser,
} from "../controllers/authController.js";
import protect  from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public
router.post("/register", register);
router.post("/login", login);

// Logged in user
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

// Admin only
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);
router.delete("/users/:id", protect, authorizeRoles("admin"), deleteUser);

export default router;