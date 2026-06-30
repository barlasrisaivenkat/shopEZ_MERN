import * as reviewService from "../services/reviewService.js";

export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getProductReviews(req.params.productId);
    res.status(200).json({ success: true, data: reviews });
  } catch (error) { next(error); }
};

export const addReview = async (req, res, next) => {
  try {
    const review = await reviewService.addReview(req.user._id, req.params.productId, req.body);
    res.status(201).json({ success: true, data: review });
  } catch (error) { next(error); }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await reviewService.updateReview(req.params.reviewId, req.user._id, req.body);
    res.status(200).json({ success: true, data: review });
  } catch (error) { next(error); }
};

export const deleteReview = async (req, res, next) => {
  try {
    await reviewService.deleteReview(req.params.reviewId, req.user);
    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) { next(error); }
};