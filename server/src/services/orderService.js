import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const createOrder = async (
  userId,
  { shippingAddress, paymentMethod, productId, quantity }
) => {
  let orderItems = [];
  let totalPrice = 0;
  let cart = null;

  if (productId) {
    const product = await Product.findById(productId);

    if (!product)
      throw { statusCode: 404, message: "Product not found" };

    if (product.stock < quantity) {
      throw {
        statusCode: 400,
        message: `Insufficient stock for ${product.title}`,
      };
    }

    orderItems = [
      {
        product: product._id,
        name: product.title,
        quantity,
        price: product.price,
        image: product.images?.[0] || "",
      },
    ];

    totalPrice = product.price * quantity;
  } else {
    cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0)
      throw { statusCode: 400, message: "Cart is empty" };

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw {
          statusCode: 400,
          message: `Insufficient stock for ${item.product.title}`,
        };
      }
    }

    orderItems = cart.items.map((item) => ({
      product: item.product._id,
      name: item.product.title,
      quantity: item.quantity,
      price: item.price,
      image: item.product.images?.[0] || "",
    }));

    totalPrice = cart.totalPrice;
  }

  const order = await Order.create({
    user: userId,
    orderItems,
    shippingAddress,
    paymentMethod,

    paymentStatus: "pending",

    orderStatus: "Order Placed",

    estimatedDelivery: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ),

    trackingHistory: [
      {
        status: "Order Placed",
        message: "Your order has been placed successfully.",
        updatedBy: "System",
      },
    ],

    totalPrice,
  });

  // Reduce stock

  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  // Clear cart

  if (!productId) {
    await Cart.findOneAndUpdate(
      { user: userId },
      {
        items: [],
        totalPrice: 0,
      }
    );
  }

  return order;
};

export const getOrdersByUser = async (userId) => {
  return await Order.find({ user: userId }).sort({
    createdAt: -1,
  });
};

export const getOrderById = async (id, user) => {
  const order = await Order.findById(id).populate(
    "user",
    "name email"
  );

  if (!order)
    throw {
      statusCode: 404,
      message: "Order not found",
    };

  if (
    user.role !== "admin" &&
    order.user._id.toString() !== user._id.toString()
  ) {
    throw {
      statusCode: 403,
      message: "Access denied",
    };
  }

  return order;
};

export const getAllOrders = async () => {
  return await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
};

export const updateOrderStatus = async (id, status) => {
  const validStatuses = [
    "Order Placed",
    "Confirmed",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  if (!validStatuses.includes(status)) {
    throw {
      statusCode: 400,
      message: "Invalid order status",
    };
  }

  const order = await Order.findById(id);

  if (!order)
    throw {
      statusCode: 404,
      message: "Order not found",
    };

  order.orderStatus = status;

  order.trackingHistory.push({
    status,
    message: `Order status updated to "${status}".`,
    updatedBy: "Seller/Admin",
    date: new Date(),
  });

  await order.save();

  return order;
};

export const cancelOrder = async (id, userId) => {
  const order = await Order.findById(id);

  if (!order)
    throw {
      statusCode: 404,
      message: "Order not found",
    };

  if (order.user.toString() !== userId.toString()) {
    throw {
      statusCode: 403,
      message: "Access denied",
    };
  }

  if (
    order.orderStatus === "Delivered" ||
    order.orderStatus === "Cancelled"
  ) {
    throw {
      statusCode: 400,
      message: "Order cannot be cancelled",
    };
  }

  order.orderStatus = "Cancelled";

  order.trackingHistory.push({
    status: "Cancelled",
    message: "Order cancelled by customer.",
    updatedBy: "Customer",
    date: new Date(),
  });

  await order.save();

  // Restore stock

  for (const item of order.orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: {
        stock: item.quantity,
      },
    });
  }

  return order;
};
