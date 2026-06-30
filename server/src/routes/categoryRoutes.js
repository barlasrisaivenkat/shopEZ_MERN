import express from "express";
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import  protect  from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", protect, authorizeRoles("admin"), createCategory);
router.put("/:id", protect, authorizeRoles("admin"), updateCategory);
router.delete("/:id", protect, authorizeRoles("admin"), deleteCategory);

export default router;