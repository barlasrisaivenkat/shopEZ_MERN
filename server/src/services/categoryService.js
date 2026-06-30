import Category from "../models/Category.js";

export const getAllCategories = async () => {
  return await Category.find().sort({ name: 1 });
};

export const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw { statusCode: 404, message: "Category not found" };
  return category;
};

export const createCategory = async (data) => {
  const existing = await Category.findOne({ name: data.name });
  if (existing) throw { statusCode: 400, message: "Category already exists" };
  return await Category.create(data);
};

export const updateCategory = async (id, data) => {
  const category = await Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!category) throw { statusCode: 404, message: "Category not found" };
  return category;
};

export const deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) throw { statusCode: 404, message: "Category not found" };
};