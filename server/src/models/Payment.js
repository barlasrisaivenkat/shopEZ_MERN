import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
{
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
        unique: true
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

    currency: {
        type: String,
        default: "INR"
    },

    paymentMethod: {
        type: String,
        enum: [
            "cash_on_delivery",
            "upi",
            "razorpay",
            "stripe"
        ],
        required: true
    },

    paymentStatus: {
        type: String,
        enum: [
            "pending",
            "paid",
            "failed"
        ],
        default: "pending"
    },

    transactionId: {
        type: String,
        default: null
    },

    paidAt: {
        type: Date,
        default: null
    }

},
{
    timestamps: true
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;