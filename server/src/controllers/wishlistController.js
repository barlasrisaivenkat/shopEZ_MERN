import * as wishlistService from "../services/wishlistService.js";

export const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await wishlistService.getWishlist(req.user._id);
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) { next(error); }
};

export const addToWishlist = async (req, res, next) => {
  try {
    const wishlist = await wishlistService.addToWishlist(req.user._id, req.params.productId);
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) { next(error); }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await wishlistService.removeFromWishlist(req.user._id, req.params.productId);
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) { next(error); }
};