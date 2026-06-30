import express from "express";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductsByCategory } from "../controllers/productController.js";
import  protect  from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/category/:categoryId", getProductsByCategory);
router.get("/:id", getProductById);
router.post("/", protect, authorizeRoles("admin","seller"), createProduct);
router.put("/:id", protect, authorizeRoles("admin","seller"), updateProduct);
router.delete("/:id", protect, authorizeRoles("admin","seller"), deleteProduct);

export default router;