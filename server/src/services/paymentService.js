import Payment from "../models/Payment.js";
import Order from "../models/Order.js";

// Show all payment methods
export const getPaymentMethods = () => {
  return [
    {
      id: "cash_on_delivery",
      label: "Cash On Delivery",
      description: "Pay with cash when your order arrives",
      icon: "💵",
      enabled: true,
    },
    {
      id: "upi",
      label: "UPI",
      description: "Coming soon",
      icon: "📱",
      enabled: false,
    },
    {
      id: "razorpay",
      label: "Razorpay",
      description: "Coming soon",
      icon: "💳",
      enabled: false,
    },
    {
      id: "stripe",
      label: "Stripe",
      description: "Coming soon",
      icon: "🏦",
      enabled: false,
    },
  ];
};


// Create Payment (Only COD)
export const createPayment = async (userId, { orderId, paymentMethod }) => {

  // Accept common frontend values
  const method = paymentMethod?.toLowerCase().trim();

  if (
    method !== "cash_on_delivery" &&
    method !== "cash on delivery"
  ) {
    throw {
      statusCode: 400,
      message: "Only Cash On Delivery is available currently.",
    };
  }

  const order = await Order.findById(orderId);

  if (!order) {
    throw {
      statusCode: 404,
      message: "Order not found",
    };
  }

  if (order.user.toString() !== userId.toString()) {
    throw {
      statusCode: 403,
      message: "Access denied",
    };
  }

  const existingPayment = await Payment.findOne({ order: orderId });

  if (existingPayment) {
    throw {
      statusCode: 400,
      message: "Payment already exists for this order",
    };
  }

  const payment = await Payment.create({
    order: orderId,
    user: userId,
    amount: order.totalPrice,
    currency: "INR",
    paymentMethod: "cash_on_delivery",
    paymentStatus: "pending",
  });

  await Order.findByIdAndUpdate(orderId, {
    paymentStatus: "pending",
  });

  return payment;
};


// Admin marks COD collected
export const markCODAsCollected = async (orderId) => {

  const payment = await Payment.findOne({ order: orderId });

  if (!payment) {
    throw {
      statusCode: 404,
      message: "Payment not found",
    };
  }

  if (payment.paymentStatus === "paid") {
    throw {
      statusCode: 400,
      message: "Payment already collected",
    };
  }

  payment.paymentStatus = "paid";
  payment.paidAt = new Date();

  await payment.save();

  await Order.findByIdAndUpdate(orderId, {
    paymentStatus: "paid",
  });

  return payment;
};


// User/Admin
export const getPaymentByOrder = async (orderId, user) => {

  const payment = await Payment.findOne({ order: orderId })
    .populate("user", "name email")
    .populate("order");

  if (!payment) {
    throw {
      statusCode: 404,
      message: "Payment not found",
    };
  }

  if (
    user.role !== "admin" &&
    payment.user._id.toString() !== user._id.toString()
  ) {
    throw {
      statusCode: 403,
      message: "Access denied",
    };
  }

  return payment;
};


// Admin
export const getAllPayments = async () => {

  return await Payment.find()
    .populate("user", "name email")
    .populate("order")
    .sort({ createdAt: -1 });

};