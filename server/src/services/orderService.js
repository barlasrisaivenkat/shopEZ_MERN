import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const createOrder = async (userId, { shippingAddress, paymentMethod }) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart || cart.items.length === 0) throw { statusCode: 400, message: "Cart is empty" };

  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      throw { statusCode: 400, message: `Insufficient stock for ${item.product.title}` };
    }
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.title,
    quantity: item.quantity,
    price: item.price,
    image: item.product.images?.[0] || "",
  }));

  const order = await Order.create({
    user: userId,
    orderItems,
    shippingAddress,
    paymentMethod,
    paymentStatus:"pending",
    orderStatus:"pending",
    totalPrice: cart.totalPrice,
});

  // Decrement stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
  }

  // Clear cart
  await Cart.findOneAndUpdate({ user: userId }, { items: [], totalPrice: 0 });

  return order;
};

export const getOrdersByUser = async (userId) => {
  return await Order.find({ user: userId }).sort({ createdAt: -1 });
};

export const getOrderById = async (id, user) => {
  const order = await Order.findById(id).populate("user", "name email");
  if (!order) throw { statusCode: 404, message: "Order not found" };
  if (user.role !== "admin" && order.user._id.toString() !== user._id.toString()) {
    throw { statusCode: 403, message: "Access denied" };
  }
  return order;
};

export const getAllOrders = async () => {
  return await Order.find().populate("user", "name email").sort({ createdAt: -1 });
};

export const updateOrderStatus = async (id, status) => {
  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) throw { statusCode: 400, message: "Invalid status" };

  const order = await Order.findByIdAndUpdate(id, { orderStatus: status }, { new: true });
  if (!order) throw { statusCode: 404, message: "Order not found" };
  return order;
};

export const cancelOrder = async (id, userId) => {
  const order = await Order.findById(id);
  if (!order) throw { statusCode: 404, message: "Order not found" };
  if (order.user.toString() !== userId.toString()) throw { statusCode: 403, message: "Access denied" };
  if (order.orderStatus !== "pending") throw { statusCode: 400, message: "Only pending orders can be cancelled" };

  order.orderStatus = "cancelled";
  await order.save();

  // Restore stock
  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
  }

  return order;
};