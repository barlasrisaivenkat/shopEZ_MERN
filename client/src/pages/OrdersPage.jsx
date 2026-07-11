import { useEffect, useState } from "react";
import { orderApi, reviewApi } from "../services/api";

function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const [reviewData, setReviewData] = useState({});

  const loadOrders = async () => {
    try {
      const response = await orderApi.myOrders();
      setOrders(response.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      await orderApi.cancel(orderId);
      loadOrders();
      alert("Order cancelled successfully.");
    } catch (err) {
      alert(err.response?.data?.message || "Unable to cancel order");
    }
  };

  const handleReviewChange = (productId, field, value) => {
    setReviewData((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  const handleReviewSubmit = async (productId) => {
    const review = reviewData[productId];

    if (!review?.rating || !review?.comment) {
      alert("Please give rating and comment.");
      return;
    }

    try {
      await reviewApi.create(productId, {
        rating: Number(review.rating),
        comment: review.comment,
      });

      alert("Review submitted successfully!");

      setReviewData((prev) => ({
        ...prev,
        [productId]: {
          rating: "",
          comment: "",
          submitted: true,
        },
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Unable to submit review");
    }
  };

 const steps = [
    "Order Placed",
    "Confirmed",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
];

  return (
    <div className="page">
      <h1>My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <article
              key={order._id}
              className="order-card order-card-large"
            >
              <div className="section-header">
                <div>
                  <h3>Order #{order._id.slice(-6)}</h3>

                  <p className="text-muted">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`status-pill status-pill-${order.orderStatus}`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="order-meta">
                <div>
                  <p className="text-muted">Payment</p>
                  <strong>{order.paymentStatus}</strong>
                </div>

                <div>
                  <p className="text-muted">Order Total</p>
                  <strong>₹{order.totalPrice}</strong>
                </div>
              </div>

              {/* Order Tracking */}

              <div className="tracking-container">

                {steps.map((step, index) => {

                  const active =
                    steps.indexOf(order.orderStatus) >= index;

                  return (
                    <div
                      key={step}
                      className={`tracking-step ${
                        active ? "active" : ""
                      }`}
                    >
                      <div className="tracking-circle">
                        {active ? "✓" : ""}
                      </div>

                      <p>{step}</p>
                    </div>
                  );
                })}
              </div>

              <div className="order-items">
                <h4>Items</h4>

                {order.orderItems?.map((item) => (
                  <div
                    key={item.product}
                    className="item-row"
                  >
                    <div>
                      <strong>{item.name}</strong>

                      <p>Qty : {item.quantity}</p>
                    </div>

                    {/* Review Form */}

                    {order.orderStatus === "Delivered" && (
                      <div className="review-box">

                        {reviewData[item.product]?.submitted ? (
                          <p className="success-text">
                            ✅ Review Submitted
                          </p>
                        ) : (
                          <>
                            <h4>Write Review</h4>

                            <select
                              value={
                                reviewData[item.product]?.rating || ""
                              }
                              onChange={(e) =>
                                handleReviewChange(
                                  item.product,
                                  "rating",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">
                                Select Rating
                              </option>

                              <option value="5">
                                ⭐⭐⭐⭐⭐
                              </option>

                              <option value="4">
                                ⭐⭐⭐⭐
                              </option>

                              <option value="3">
                                ⭐⭐⭐
                              </option>

                              <option value="2">
                                ⭐⭐
                              </option>

                              <option value="1">
                                ⭐
                              </option>
                            </select>

                            <textarea
                              rows="3"
                              placeholder="Write your review..."
                              value={
                                reviewData[item.product]?.comment || ""
                              }
                              onChange={(e) =>
                                handleReviewChange(
                                  item.product,
                                  "comment",
                                  e.target.value
                                )
                              }
                            />

                            <button
                              className="primary-btn"
                              onClick={() =>
                                handleReviewSubmit(item.product)
                              }
                            >
                              Submit Review
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {order.shippingAddress && (
                <div className="order-footer">
                  <p className="text-muted">
                    Shipping Address
                  </p>

                  <p>
                    {order.shippingAddress.fullName}
                    <br />

                    {order.shippingAddress.street}
                    <br />

                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state}
                    <br />

                    {order.shippingAddress.pincode}
                    <br />

                    {order.shippingAddress.country}
                  </p>
                </div>
              )}

              {order.orderStatus === "Order Placed" && (
                <div className="section-footer">
                  <button
                    className="ghost-btn"
                    onClick={() =>
                      handleCancel(order._id)
                    }
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
