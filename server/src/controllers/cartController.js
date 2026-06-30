import * as cartService from "../services/cartService.js";

export const getCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user._id);
    res.status(200).json({ success: true, data: cart });
  } catch (error) { next(error); }
};

export const addToCart = async (req, res, next) => {
  try {
    const cart = await cartService.addToCart(req.user._id, req.body);
    res.status(200).json({ success: true, data: cart });
  } catch (error) { next(error); }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const cart = await cartService.updateCartItem(req.user._id, req.params.productId, req.body.quantity);
    res.status(200).json({ success: true, data: cart });
  } catch (error) { next(error); }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const cart = await cartService.removeFromCart(req.user._id, req.params.productId);
    res.status(200).json({ success: true, data: cart });
  } catch (error) { next(error); }
};

export const clearCart = async (req, res, next) => {
  try {
    await cartService.clearCart(req.user._id);
    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (error) { next(error); }
};