import * as productService from "../services/productService.js";

export const getAllProducts = async (req, res, next) => {
  try {
    const result = await productService.getAllProducts(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) { next(error); }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({ success: true, data: product });
  } catch (error) { next(error); }
};

export const createProduct = async (req, res, next) => {
  try {
   const product = await productService.createProduct({
    ...req.body,
    seller:req.user._id
});
    res.status(201).json({ success: true, data: product });
  } catch (error) { next(error); }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, {
      ...req.body,
      seller: req.user._id
    });
    res.status(200).json({ success: true, data: product });
  } catch (error) { next(error); }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await productService.deleteProduct(req.params.id, {
      ...req.body,
      seller: req.user._id
    });
    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) { next(error); }
};

export const getProductsByCategory = async (req, res, next) => {
  try {
    const products = await productService.getProductsByCategory(req.params.categoryId);
    res.status(200).json({ success: true, data: products });
  } catch (error) { next(error); }
};