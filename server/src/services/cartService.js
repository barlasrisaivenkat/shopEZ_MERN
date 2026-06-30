import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product", "title price images stock");
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return cart;
};

export const addToCart = async (userId, { productId, quantity = 1 }) => {
  const product = await Product.findById(productId);
  if (!product) throw { statusCode: 404, message: "Product not found" };
  if (product.stock < quantity) throw { statusCode: 400, message: "Insufficient stock" };

  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });

  const existingItem = cart.items.find((item) => item.product.toString() === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity, price: product.price });
  }

  cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  await cart.save();
  return cart.populate("items.product", "title price images stock");
};

export const updateCartItem = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw { statusCode: 404, message: "Cart not found" };

  const item = cart.items.find((item) => item.product.toString() === productId);
  if (!item) throw { statusCode: 404, message: "Item not in cart" };

  if (quantity <= 0) {
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  } else {
    item.quantity = quantity;
  }

  cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  await cart.save();
  return cart.populate("items.product", "title price images stock");
};

export const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw { statusCode: 404, message: "Cart not found" };

  cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  await cart.save();
  return cart.populate("items.product", "title price images stock");
};

export const clearCart = async (userId) => {
  await Cart.findOneAndUpdate({ user: userId }, { items: [], totalPrice: 0 });
};