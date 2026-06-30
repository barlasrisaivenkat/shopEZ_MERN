import * as paymentService from "../services/paymentService.js";

// GET /api/payments/methods — frontend uses this to render all payment options
export const getPaymentMethods = (req, res) => {
  const methods = paymentService.getPaymentMethods();
  res.status(200).json({ success: true, data: methods });
};

// POST /api/payments — user selects a method and submits; only COD goes through
export const createPayment = async (req, res, next) => {
  try {
    const payment = await paymentService.createPayment(req.user._id, req.body);
    res.status(201).json({ success: true, data: payment });
  } catch (error) { next(error); }
};

// PUT /api/payments/cod/:orderId/collect — admin marks cash collected
export const markCODAsCollected = async (req, res, next) => {
  try {
    const payment = await paymentService.markCODAsCollected(req.params.orderId);
    res.status(200).json({ success: true, data: payment });
  } catch (error) { next(error); }
};

// GET /api/payments/order/:orderId
export const getPaymentByOrder = async (req, res, next) => {
  try {
    const payment = await paymentService.getPaymentByOrder(req.params.orderId, req.user);
    res.status(200).json({ success: true, data: payment });
  } catch (error) { next(error); }
};

// GET /api/payments — admin only
export const getAllPayments = async (req, res, next) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.status(200).json({ success: true, data: payments });
  } catch (error) { next(error); }
};