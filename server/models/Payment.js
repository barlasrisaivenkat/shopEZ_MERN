const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
{
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: [
            "Cash On Delivery",
            "Razorpay",
            "Stripe",
            "UPI"
        ],
        required: true
    },

    paymentStatus: {
        type: String,
        enum: [
            "Pending",
            "Paid"
        ],
        default: "Pending"
    }
},
{
    timestamps: true
});

module.exports = mongoose.model("Payment", paymentSchema);