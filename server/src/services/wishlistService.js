import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

export const getWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate("products", "title price images");
  if (!wishlist) wishlist = await Wishlist.create({ user: userId, products: [] });
  return wishlist;
};

export const addToWishlist = async (userId, productId) => {
  const product = await Product.findById(productId);
  if (!product) throw { statusCode: 404, message: "Product not found" };

  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) wishlist = await Wishlist.create({ user: userId, products: [] });

  if (wishlist.products.includes(productId)) {
    throw { statusCode: 400, message: "Product already in wishlist" };
  }

  wishlist.products.push(productId);
  await wishlist.save();
  return wishlist.populate("products", "title price images");
};

export const removeFromWishlist = async (userId, productId) => {
  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) throw { statusCode: 404, message: "Wishlist not found" };

  wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
  await wishlist.save();
  return wishlist.populate("products", "title price images");
};